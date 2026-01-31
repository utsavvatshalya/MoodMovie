import { useState } from 'react';
import { Search, Sparkles, TrendingUp } from 'lucide-react';
import { MovieCard } from '@/app/components/MovieCard';
import { motion } from 'motion/react';

// Updated interface to match your Python Backend's JSON response
interface Movie {
  title: string;
  overview: string;
  score: number;      // From Flask
  matchScore?: number; // For the UI
  description?: string;
  poster?: string;
  id?: number;
  genres?: any;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    try {
      // Connecting to your Flask Backend
      const response = await fetch('http://127.0.0.1:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood_query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Map the backend data to include a fallback poster 
      // (until we update fetch_movies.py to get real poster paths)
      const mappedData = data.map((movie: any) => ({
        ...movie,
        poster: movie.poster || `https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1080&auto=format&fit=crop`,
        matchScore: movie.score,
        description: movie.overview,
        year: 2024, // Placeholder
        genre: 'AI Picked' // Placeholder
      }));

      setResults(mappedData);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      alert("Make sure your Flask server is running on port 5000!");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-semibold text-white">CineMood AI</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Discover</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Trending</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Discover Movies That
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Match Your Mood
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              AI-powered movie discovery that understands how you feel. Just describe your mood, and we'll find the perfect film.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center px-6 py-5">
                <Search className="w-6 h-6 text-gray-400 mr-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Describe your mood... (e.g., 'A rainy night in Tokyo' or 'Nostalgic and hopeful')"
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="ml-4 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {isSearching ? 'Thinking...' : 'Search'}
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Results Section */}
      {results.length > 0 && (
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-semibold text-white">
                  AI Recommended Matches
                </h3>
              </div>
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((movie, index) => (
                <MovieCard key={index} movie={movie} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2026 CineMood AI. Built at MIT Manipal.</p>
        </div>
      </footer>
    </div>
  );
}