import pandas as pd
import pickle
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# 1. Load the data and the "AI Brain" we created earlier
df = pd.read_csv("movies_data.csv")
with open("movie_embeddings.pkl", "rb") as f:
    movie_embeddings = pickle.load(f)

# 2. Load the same AI model
model = SentenceTransformer('all-MiniLM-L6-v2')

def find_movie_by_mood(user_query, top_k=5):
    # Turn the user's mood into a vector
    query_vector = model.encode([user_query])
    
    # Calculate how similar the query is to ALL 200 movies
    # This returns a list of scores between 0 and 1
    similarities = cosine_similarity(query_vector, movie_embeddings).flatten()
    
    # Get the indices of the top results (sorted by highest score)
    top_indices = similarities.argsort()[-top_k:][::-1]
    
    print(f"\nResults for: '{user_query}'")
    for idx in top_indices:
        score = similarities[idx]
        print(f"[{score:.2f}] {df.iloc[idx]['title']}")
        print(f"   Plot: {df.iloc[idx]['overview'][:100]}...")
        print("-" * 20)

# 3. Try it out!
search_query = input("Describe the mood of the movie you want: ")
find_movie_by_mood(search_query)