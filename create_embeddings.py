import pandas as pd
from sentence_transformers import SentenceTransformer
import pickle

# 1. Load your data
df = pd.read_csv("movies_data.csv")

# 2. Load a pre-trained AI model
# 'all-MiniLM-L6-v2' is fast and great for a laptop
model = SentenceTransformer('all-MiniLM-L6-v2')

print("Generating AI embeddings for movie moods... this might take a minute.")

# 3. Turn 'overviews' into vectors
# This is the "Math" part: converting text to 384-dimensional vectors
movie_embeddings = model.encode(df['overview'].tolist(), show_progress_bar=True)

# 4. Save the "Brain" so we don't have to re-calculate it
with open("movie_embeddings.pkl", "wb") as f:
    pickle.dump(movie_embeddings, f)

print("Success! Your AI now 'understands' the 200 movies.")