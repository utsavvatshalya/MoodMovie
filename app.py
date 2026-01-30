from flask import Flask, render_template, request
import pandas as pd
import pickle
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load the AI model and data
df = pd.read_csv("movies_data.csv")
with open("movie_embeddings.pkl", "rb") as f:
    movie_embeddings = pickle.load(f)
model = SentenceTransformer('all-MiniLM-L6-v2')

@app.route("/", methods=["GET", "POST"])
def home():
    results = []
    query = ""
    if request.method == "POST":
        query = request.form.get("mood_query")
        # Generate embedding for user query
        query_vector = model.encode([query])
        # Find similarity
        similarities = cosine_similarity(query_vector, movie_embeddings).flatten()
        top_indices = similarities.argsort()[-5:][::-1]
        
        for idx in top_indices:
            results.append({
                "title": df.iloc[idx]["title"],
                "overview": df.iloc[idx]["overview"],
                "score": round(float(similarities[idx]), 2)
            })
            
    return render_template("index.html", results=results, query=query)

if __name__ == "__main__":
    app.run(debug=True)