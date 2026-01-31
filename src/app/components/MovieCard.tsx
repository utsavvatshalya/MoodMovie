import { motion } from 'motion/react';
import { Star, Play, Info } from 'lucide-react';

interface Movie {
  id: number;
  title: string;
  poster: string;
  matchScore: number;
  description: string;
  year: number;
  genre: string;
}

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export function MovieCard({ movie, index }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative cursor-pointer"
    >
      {/* Glassmorphic Card Container */}
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
          
          {/* Match Score Badge */}
          <div className="absolute top-4 right-4">
            <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/90 to-purple-500/90 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
              <Star className="w-4 h-4 text-white fill-white" />
              <span className="text-white font-semibold text-sm">{movie.matchScore}%</span>
            </div>
          </div>

          {/* Hover Overlay - Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="backdrop-blur-md bg-white/20 rounded-full p-4 border border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-white text-lg leading-tight group-hover:text-blue-400 transition-colors duration-300">
              {movie.title}
            </h4>
            <span className="text-gray-400 text-sm whitespace-nowrap">{movie.year}</span>
          </div>
          
          <div className="mb-3">
            <span className="inline-block px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-gray-400 border border-white/10">
              {movie.genre}
            </span>
          </div>

          {/* Description - Hidden by default, shown on hover */}
          <div className="max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-500">
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {movie.description}
            </p>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Watch
              </button>
              <button className="p-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 border border-white/20">
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 -z-10 blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
    </motion.div>
  );
}
