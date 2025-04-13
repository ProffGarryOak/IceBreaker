"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clapperboard, Popcorn, Star, Trophy, Sparkles, Clock, Search, Heart, Share2, LoaderCircle, Flame, ClipboardCheck, ClipboardList, ClipboardCopy, BookOpen, Bookmark, Check, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 750);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-900/70' : 'bg-red-500';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2`}
    >
      {type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      {message}
    </motion.div>
  );
};

const MovieCard = ({ movie, isHovered, onHover }) => {
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });
  const [isAdding, setIsAdding] = useState({ completed: false, inProgress: false, planned: false });

  const addToCollection = async (listType) => {
    try {
      setIsAdding(prev => ({ ...prev, [listType]: true }));
      
      const res = await fetch('/api/content/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 'movies',
          list: listType,
          item: {
            id: movie.imdbID || `movie-${movie.Title.replace(/\s+/g, '-').toLowerCase()}`,
            title: movie.Title,
            year: movie.Year,
            image: movie.Poster !== 'N/A' ? movie.Poster : '/default-movie-poster.jpg',
            description: movie.Plot?.replace(/<[^>]*>/g, '').slice(0, 120) + '...' || 'Plot not available',
            genre: movie.Genre,
            rating: movie.imdbRating
          }
        })
      });

      const data = await res.json();
      
      // Show success feedback
      let listName = '';
      if (listType === 'completed') listName = 'Watched';
      else if (listType === 'inProgress') listName = 'Watching';
      else if (listType === 'planned') listName = 'Watch Later';
      
      setFeedback({
        show: true,
        message: `Added to ${listName}!`,
        type: 'success'
      });
      
      console.log(`Added to ${listType}:`, data);
    } catch (error) {
      console.error(`Error adding to ${listType}:`, error);
      setFeedback({
        show: true,
        message: 'Failed to add movie',
        type: 'error'
      });
    } finally {
      setIsAdding(prev => ({ ...prev, [listType]: false }));
    }
  };

  const closeFeedback = () => {
    setFeedback(prev => ({ ...prev, show: false }));
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => onHover(movie.imdbID)}
      onHoverEnd={() => onHover(null)}
      className="relative"
    >
      {feedback.show && (
        <Toast 
          message={feedback.message} 
          type={feedback.type} 
          onClose={closeFeedback} 
        />
      )}
      
      <div className={`bg-gray-900 rounded-xl shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 border-2 ${isHovered ? 'border-amber-400' : 'border-transparent'}`}>
        <div className="relative h-80 overflow-hidden">
          <img
            src={movie.Poster !== 'N/A' ? movie.Poster : '/default-movie-poster.jpg'}
            alt={movie.Title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 gap-2"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className={`p-3 border-2 border-amber-500 rounded-full bg-gray-500/20 hover:bg-green-500/30 transition shadow-lg relative ${isAdding.completed ? 'opacity-50' : ''}`}
                      onClick={() => !isAdding.completed && addToCollection('completed')}
                      disabled={isAdding.completed}
                    >
                      {isAdding.completed ? (
                        <LoaderCircle className="w-5 h-5 text-green-500 animate-spin" />
                      ) : (
                        <ClipboardCheck className="w-5 h-5 text-green-500 font-extrabold" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-800 text-white border-gray-700">
                    <p>Mark as Watched</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className={`p-3 border-2 border-amber-500 bg-gray-500/20 rounded-full hover:bg-rose-500/30 transition shadow-lg relative ${isAdding.inProgress ? 'opacity-50' : ''}`}
                      onClick={() => !isAdding.inProgress && addToCollection('inProgress')}
                      disabled={isAdding.inProgress}
                    >
                      {isAdding.inProgress ? (
                        <LoaderCircle className="w-5 h-5 text-rose-500 animate-spin" />
                      ) : (
                        <ClipboardCopy className="w-5 h-5 text-rose-500" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-800 text-white border-gray-700">
                    <p>Currently Watching</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className={`p-3 border-2 border-amber-500 bg-gray-500/20 rounded-full hover:bg-blue-500/30 transition shadow-lg relative ${isAdding.planned ? 'opacity-50' : ''}`}
                      onClick={() => !isAdding.planned && addToCollection('planned')}
                      disabled={isAdding.planned}
                    >
                      {isAdding.planned ? (
                        <LoaderCircle className="w-5 h-5 text-blue-500 animate-spin" />
                      ) : (
                        <ClipboardList className="w-5 h-5 text-blue-500" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-800 text-white border-gray-700">
                    <p>Add to Watch Later</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          )}
          {movie.imdbRating && (
            <div className="absolute top-3 right-3 bg-gray-900/90 px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg border border-amber-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-white font-medium">{movie.imdbRating}</span>
            </div>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{movie.Title}</h3>
          <p className="text-sm text-gray-400 mb-3">{movie.Year} • {movie.Genre?.split(', ')[0] || 'Movie'}</p>
          <p className="text-sm text-gray-300 line-clamp-3 flex-grow">
            {movie.Plot?.replace(/<[^>]*>/g, '').slice(0, 120) + '...' || 'Plot not available'}
          </p>
        </div>
      </div>
      {isHovered && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -right-3 bg-amber-500 rounded-full p-1 shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

const MovieSection = ({ title, movieTitles, icon, color }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState(null);

  const iconMap = {
    flame: <Flame className={`w-5 h-5 ${color}`} />,
    trophy: <Trophy className={`w-5 h-5 ${color} fill-current`} />,
    clock: <Clock className={`w-5 h-5 ${color}`} />,
    popcorn: <Popcorn className={`w-5 h-5 ${color}`} />
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const results = await Promise.all(
          movieTitles.map(title =>
            fetch(`https://www.omdbapi.com/?apikey=4a1a1bb1&t=${encodeURIComponent(title)}`)
              .then(res => res.json())
              .catch(() => null)
          )
        );
        const filtered = results.filter(movie => movie && movie.Response !== 'False');
        setMovies(filtered);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [movieTitles]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.2 }}
          className={`p-2 rounded-full bg-gray-900 shadow-md ${color.replace('text', 'bg')}/20`}
        >
          {iconMap[icon]}
        </motion.div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">
          {title}
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl bg-gray-800/50" />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie, idx) => (
            <MovieCard 
              key={movie.imdbID || idx} 
              movie={movie} 
              isHovered={hoveredMovie === movie.imdbID}
              onHover={setHoveredMovie}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-900/50 rounded-xl p-8 text-center">
          <p className="text-gray-400">No movies found or API rate limit reached.</p>
        </div>
      )}
    </motion.div>
  );
};

const Movies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [globalToast, setGlobalToast] = useState({ show: false, message: '', type: 'success' });

  const closeGlobalToast = () => {
    setGlobalToast(prev => ({ ...prev, show: false }));
  };

  return (
    <TooltipProvider>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-10"
      >
        <AnimatePresence>
          {globalToast.show && (
            <Toast 
              message={globalToast.message} 
              type={globalToast.type} 
              onClose={closeGlobalToast} 
            />
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center mb-12"
          >
            <motion.div
              animate={{ 
                rotateY: [0, 360],
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Clapperboard className="w-12 h-12 text-amber-500 mb-4" />
            </motion.div>
            <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
              Movie Theater
            </h1>
            <p className="text-gray-400 mb-6 text-center max-w-lg">
              Discover blockbusters, classics, and hidden gems
            </p>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for movies, actors..."
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>

          {searchQuery ? (
            <MovieSection 
              title={`Search: ${searchQuery}`} 
              movieTitles={[searchQuery]}
              icon="sparkles" 
              color="text-amber-500" 
            />
          ) : (
            <>
              <MovieSection 
                title=" Hot in Theaters" 
                movieTitles={[
                  "Oppenheimer", "John Wick chapter 4", "Barbie", "The Batman", 
                  "Interstellar", "Dune", "Top Gun: Maverick", "Spider-Man: No Way Home"
                ]} 
                icon="flame" 
                color="text-red-500" 
              />
              <MovieSection 
                title=" IMDB Top Rated" 
                movieTitles={[
                  "The Shawshank Redemption", "The Godfather", "The Dark Knight", "Inception", 
                  "Forrest Gump", "Fight Club", "Pulp Fiction", "The Lord of the Rings: The Return of the King"
                ]} 
                icon="trophy" 
                color="text-amber-500" 
              />
              <MovieSection 
                title=" New Releases" 
                movieTitles={[
                  "Wonka", "The Marvels", "Napoleon", "Poor Things", 
                  "Killers of the Flower Moon", "Rebel Moon", "Dune: Part Two", "Aquaman and the Lost Kingdom"
                ]} 
                icon="clock" 
                color="text-blue-400" 
              />
              <MovieSection 
                title=" Animation & Family" 
                movieTitles={[
                  "Kung fu panda 4", "Pangolin: Kulu's Journey", "Frozen II", "Toy Story 4", 
                  "Encanto", "Luca", "Turning Red", "The Lion King", "Inside out"
                ]} 
                icon="popcorn" 
                color="text-green-400" 
              />
            </>
          )}
        </div>

        {/* Floating decoration */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="fixed bottom-8 right-8 z-10 hidden md:block"
        >
          <div className="relative">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
              <Popcorn className="w-8 h-8 text-white" />
            </div>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}
              className="absolute -top-2 -right-2 bg-amber-400 px-2 py-1 rounded-full text-xs text-gray-900 font-bold"
            >
              POP!
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
};

export default Movies;