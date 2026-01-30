import requests
import pandas as pd

API_KEY = 'YOUR_API_KEY' # Paste your API key here
base_url = "https://api.themoviedb.org/3/movie/popular"

all_movies = []

# Let's fetch the first 10 pages (approx 200 popular movies)
for page in range(1, 11):
    params = {
        'api_key':'7fa3b6c359389aad39beaf1406aa4d9b',
        'language': 'en-US',
        'page': page
    }
    response = requests.get(base_url, params=params).json()
    
    if 'results' in response:
        for movie in response['results']:
            # We specifically need the overview for the "Mood" search
            all_movies.append({
                'title': movie['title'],
                'overview': movie['overview'],
                'genres': movie['genre_ids']
            })

# Save it to a CSV so we don't have to call the API every time
df = pd.DataFrame(all_movies)
df.to_csv("movies_data.csv", index=False)
print(f"Done! Saved {len(df)} movies to movies_data.csv")