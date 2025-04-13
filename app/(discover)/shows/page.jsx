"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tv, Star, Flame, Trophy, Sparkles, Clock, Search, Heart, Share2, Play, List, Popcorn, LoaderCircle, Check, X, BookOpen, Bookmark, ClipboardCheck, ClipboardList, ClipboardCopy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  
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

const ShowCard = ({ show, isHovered, onHover }) => {
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
          category: 'shows',
          list: listType,
          item: {
            id: show.imdbID || `show-${show.Title.replace(/\s+/g, '-').toLowerCase()}`,
            title: show.Title,
            year: show.Year,
            image: show.Poster !== 'N/A' ? show.Poster : '/default-tv-poster.jpg',
            description: show.Plot?.replace(/<[^>]*>/g, '').slice(0, 120) + '...' || 'Plot not available',
            genre: show.Genre,
            rating: show.imdbRating,
            seasons: show.totalSeasons,
            runtime: show.Runtime
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
        message: 'Failed to add show',
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
      onHoverStart={() => onHover(show.imdbID)}
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
      <div className={`bg-gray-900 rounded-xl shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 border-2 ${isHovered ? 'border-cyan-400' : 'border-transparent'}`}>
        <div className="relative h-80 overflow-hidden">
          <img
            src={show.Poster !== 'N/A' ? show.Poster : '/default-tv-poster.jpg'}
            alt={show.Title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 gap-2"
            >
              <button 
                className={`p-3 border-2 border-cyan-500 rounded-full bg-gray-500/20 hover:bg-green-500/30 transition shadow-lg relative ${isAdding.completed ? 'opacity-50' : ''}`}
                onClick={() => !isAdding.completed && addToCollection('completed')}
                disabled={isAdding.completed}
              >
                {isAdding.completed ? (
                  <LoaderCircle className="w-5 h-5 text-green-500 animate-spin" />
                ) : (
                  <ClipboardCheck className="w-5 h-5 text-green-500 font-extrabold" />
                )}
              </button>
              <button 
                className={`p-3 border-2 border-cyan-500 bg-gray-500/20 rounded-full hover:bg-rose-500/30 transition shadow-lg relative ${isAdding.inProgress ? 'opacity-50' : ''}`}
                onClick={() => !isAdding.inProgress && addToCollection('inProgress')}
                disabled={isAdding.inProgress}
              >
                {isAdding.inProgress ? (
                  <LoaderCircle className="w-5 h-5 text-rose-500 animate-spin" />
                ) : (
                  <ClipboardCopy className="w-5 h-5 text-rose-500" />
                )}
              </button>
              <button 
                className={`p-3 border-2 border-cyan-500 bg-gray-500/20 rounded-full hover:bg-blue-500/30 transition shadow-lg relative ${isAdding.planned ? 'opacity-50' : ''}`}
                onClick={() => !isAdding.planned && addToCollection('planned')}
                disabled={isAdding.planned}
              >
                {isAdding.planned ? (
                  <LoaderCircle className="w-5 h-5 text-blue-500 animate-spin" />
                ) : (
                  <ClipboardList className="w-5 h-5 text-blue-500" />
                )}
              </button>
            </motion.div>
          )}
          {show.imdbRating && (
            <div className="absolute top-3 right-3 bg-gray-900/90 px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg border border-cyan-400">
              <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
              <span className="text-white font-medium">{show.imdbRating}</span>
            </div>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{show.Title}</h3>
          <p className="text-sm text-gray-400 mb-3">
            {show.Year} • {show.Genre?.split(', ')[0] || 'TV Show'}
          </p>
          <p className="text-sm text-gray-300 line-clamp-3 flex-grow">
            {show.Plot?.slice(0, 120) + '...' || 'Plot not available'}
          </p>
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-cyan-400">
              {show.totalSeasons || '?'} season{show.totalSeasons !== '1' ? 's' : ''}
            </span>
            <span className="text-xs text-gray-400">
              {show.Runtime || '? min/ep'}
            </span>
          </div>
        </div>
      </div>
      {isHovered && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -right-3 bg-cyan-400 rounded-full p-1 shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

const ShowSection = ({ title, showTitles, icon, color }) => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredShow, setHoveredShow] = useState(null);

  const iconMap = {
    flame: <Flame className={`w-5 h-5 ${color}`} />,
    trophy: <Trophy className={`w-5 h-5 ${color} fill-current`} />,
    popcorn: <Popcorn className={`w-5 h-5 ${color}`} />,
    list: <List className={`w-5 h-5 ${color}`} />
  };

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true);
        const results = await Promise.all(
          showTitles.map(title =>
            fetch(`https://www.omdbapi.com/?apikey=4a1a1bb1&t=${encodeURIComponent(title)}&type=series`)
              .then(res => res.json())
              .catch(() => null)
          )
        );
        const filtered = results.filter(show => show && show.Response !== 'False');
        setShows(filtered);
      } catch (error) {
        console.error("Error fetching shows:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, [showTitles]);

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
      ) : shows.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shows.map((show) => (
            <ShowCard 
              key={show.imdbID} 
              show={show} 
              isHovered={hoveredShow === show.imdbID}
              onHover={setHoveredShow}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-900/50 rounded-xl p-8 text-center">
          <p className="text-gray-400">No TV shows found or API rate limit reached</p>
        </div>
      )}
    </motion.div>
  );
};

const TVShows = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [globalToast, setGlobalToast] = useState({ show: false, message: '', type: 'success' });

  const closeGlobalToast = () => {
    setGlobalToast(prev => ({ ...prev, show: false }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-800 p-6 md:p-10"
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
              rotate: [0, 20, -20, 0],
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Tv className="w-12 h-12 text-cyan-500 mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-cyan-700">
            Binge Central
          </h1>
          <p className="text-gray-400 mb-6 text-center max-w-lg">
            Discover your next binge-worthy obsession
          </p>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for shows, actors..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {searchQuery ? (
          <ShowSection 
            title={`Search: ${searchQuery}`} 
            showTitles={[searchQuery]}
            icon="sparkles" 
            color="text-cyan-500" 
          />
        ) : (
          <>
            <ShowSection 
              title=" Trending Now" 
              showTitles={[
                "Stranger Things", "The Mandalorian", "The Boys", "Wednesday",
                "House of the Dragon", "The Last of Us", "The Witcher", "Loki"
              ]}
              icon="flame" 
              color="text-red-500" 
            />
            <ShowSection 
              title=" All-Time Greats" 
              showTitles={[
                "Breaking Bad", "Game of Thrones", "Ben 10", "The Wire",
                "Friends", "The Office", "Sherlock", "Power Rangers SPD"
              ]}
              icon="trophy" 
              color="text-amber-500" 
            />
            <ShowSection 
              title=" Currently Airing" 
              showTitles={[
                "Ahsoka", "The Bear", "Succession", "Yellowjackets",
                "The Crown", "Only Murders in the Building", "Ted Lasso", "Barry"
              ]}
              icon="list" 
              color="text-green-400" 
            />
            <ShowSection 
              title=" Popular Picks" 
              showTitles={[
                "Black Mirror", "Rick and Morty", "The Umbrella Academy", "Peaky Blinders",
                "Better Call Saul", "Money Heist", "The Queen's Gambit", "Arcane"
              ]}
              icon="popcorn" 
              color="text-purple-400" 
            />
          </>
        )}
      </div>

      {/* Floating decoration */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="fixed bottom-8 right-8 z-10 hidden md:block"
      >
        <div className="relative">
          <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
            <Tv className="w-8 h-8 text-white" />
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
            className="absolute -top-2 -right-2 bg-cyan-400 px-2 py-1 rounded-full text-xs text-gray-900 font-bold"
          >
            BINGE!
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TVShows;