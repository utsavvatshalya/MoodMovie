# New Imports
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
import pandas as pd
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS  # Required for React connectivity
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv

# 1. Setup and Security
load_dotenv()
app = Flask(__name__)
CORS(app)  # This allows your React frontend (port 5173) to talk to this API (port 5000)

# 2. Load the "Brain" (AI Model and Data)
# Using the same model you used to create the embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load your local movie database
df = pd.read_csv("movies_data.csv")

# Load the pre-calculated vectors
with open("movie_embeddings.pkl", "rb") as f:
    movie_embeddings = pickle.load(f)

@app.route("/api/search", methods=["POST"])
def search_movies():
    """
    Endpoint that receives a mood query and returns the top 5 movie matches.
    """
    try:
        # Get data from the React frontend
        data = request.json
        user_query = data.get("mood_query", "")

        if not user_query:
            return jsonify({"error": "No query provided"}), 400

        # AI Logic: Turn user mood into a vector
        query_vector = model.encode([user_query])
        
        # Calculate mathematical similarity
        similarities = cosine_similarity(query_vector, movie_embeddings).flatten()
        
        # Get top 8 results for a better UI grid
        top_indices = similarities.argsort()[-8:][::-1]
        
        results = []
        for idx in top_indices:
            results.append({
                "title": str(df.iloc[idx]["title"]),
                "overview": str(df.iloc[idx]["overview"]),
                "score": round(float(similarities[idx]) * 100, 1), # Percentage match
                "genres": df.iloc[idx]["genres"]
            })

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "API is running"}), 200

if __name__ == "__main__":
    # Running on port 5000 by default
    app.run(debug=True, port=5000)

# Database Setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# The Login Route
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    # 1. Check if user exists in db
    # 2. Verify encrypted password
    # 3. If correct, return a "Token" (JWT)
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)