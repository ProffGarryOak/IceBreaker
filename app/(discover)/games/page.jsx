"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Flame, Trophy, Clock, Search, Star, LoaderCircle, ClipboardCheck, ClipboardCopy, ClipboardList, Sparkles, Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

const GameCard = ({ game, isHovered, onHover }) => {
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
          category: 'games',
          list: listType,
          item: {
            id: game.id || `game-${game.name.replace(/\s+/g, '-').toLowerCase()}`,
            title: game.name,
            year: game.released?.split('-')[0] || 'TBA',
            image: game.background_image || '/default-game.jpg',
            description: game.slug?.replace(/-/g, ' ').slice(0, 120) + '...' || 'Description not available',
            genre: game.genres?.[0]?.name || 'Game',
            rating: game.rating?.toFixed(1) || 'N/A'
          }
        })
      });

      const data = await res.json();
      
      // Show success feedback
      let listName = '';
      if (listType === 'completed') listName = 'Played';
      else if (listType === 'inProgress') listName = 'Playing';
      else if (listType === 'planned') listName = 'Play Later';
      
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
        message: 'Failed to add game',
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
      onHoverStart={() => onHover(game.id)}
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
      
      <div className={`bg-gray-900 rounded-xl shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 border-2 ${isHovered ? 'border-red-400' : 'border-transparent'}`}>
        <div className="relative h-80 overflow-hidden">
          <img
            src={game.background_image || '/default-game.jpg'}
            alt={game.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 gap-2"
            >
              <button 
                className={`p-3 border-2 border-red-500 rounded-full bg-gray-500/20 hover:bg-green-500/30 transition shadow-lg relative ${isAdding.completed ? 'opacity-50' : ''}`}
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
                className={`p-3 border-2 border-red-500 bg-gray-500/20 rounded-full hover:bg-rose-500/30 transition shadow-lg relative ${isAdding.inProgress ? 'opacity-50' : ''}`}
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
                className={`p-3 border-2 border-red-500 bg-gray-500/20 rounded-full hover:bg-blue-500/30 transition shadow-lg relative ${isAdding.planned ? 'opacity-50' : ''}`}
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
          {game.rating && (
            <div className="absolute top-3 right-3 bg-gray-900/90 px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg border border-red-400">
              <Star className="w-3 h-3 fill-red-400 text-red-400" />
              <span className="text-white font-medium">{game.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{game.name}</h3>
          <p className="text-sm text-gray-400 mb-3">
            {game.released || "TBA"} • {game.genres?.[0]?.name || "Game"}
          </p>
          <p className="text-sm text-gray-300 line-clamp-3 flex-grow">
            {game.slug?.slice(0, 120).replace(/-/g, ' ') + '...'}
          </p>
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-red-400">
              {game.platforms?.length || "?"} platforms
            </span>
            <span className="text-xs text-gray-400">
              {game.metacritic ? `Meta: ${game.metacritic}` : "No Score"}
            </span>
          </div>
        </div>
      </div>
      {isHovered && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -right-3 bg-red-500 rounded-full p-1 shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

const GameSection = ({ title, fetchFunction, icon, color }) => {
  const [gameList, setGameList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredGame, setHoveredGame] = useState(null);

  const iconMap = {
    flame: <Flame className={`w-5 h-5 ${color}`} />,
    trophy: <Trophy className={`w-5 h-5 ${color}`} />,
    clock: <Clock className={`w-5 h-5 ${color}`} />
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const data = await fetchFunction();
        const seen = new Set();
        const uniqueGames = data.results.filter((game) => {
          if (seen.has(game.name)) return false;
          seen.add(game.name);
          return true;
        });
        setGameList(uniqueGames.slice(0, 8));
      } catch (error) {
        console.error("Error fetching games:", error);
        setGameList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [fetchFunction]);

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
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-300 to-red-600">
          {title}
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl bg-gray-800/50" />
          ))}
        </div>
      ) : gameList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gameList.map((game) => (
            <GameCard 
              key={game.id}
              game={game}
              isHovered={hoveredGame === game.id}
              onHover={setHoveredGame}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-900/50 rounded-xl p-8 text-center">
          <p className="text-gray-400">No games found</p>
        </div>
      )}
    </motion.div>
  );
};

const fetchGames = (query = "") =>
  fetch(`https://api.rawg.io/api/games?key=738c2944f2f84bd183ec9f5161ba7e09${query ? `&search=${query}` : ""}`)
    .then((res) => res.json());

const fetchTrending = () =>
  fetchGames("&ordering=-added");

const fetchTopRated = () =>
  fetchGames("&ordering=-rating");

const fetchUpcoming = () =>
  fetchGames("&dates=2025-04-01,2025-12-31&ordering=-added");

const Games = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [globalToast, setGlobalToast] = useState({ show: false, message: '', type: 'success' });

  const closeGlobalToast = () => {
    setGlobalToast(prev => ({ ...prev, show: false }));
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-red-900/20 p-6 md:p-10"
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
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Gamepad2 className="w-12 h-12 text-red-500 mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
            Game Galaxy
          </h1>
          <p className="text-gray-400 mb-6 text-center max-w-lg">
            Explore epic games across all genres
          </p>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for games..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {isSearching ? (
          <GameSection
            title={`Search: ${searchQuery}`}
            fetchFunction={() => fetchGames(searchQuery)}
            icon="flame"
            color="text-red-500"
          />
        ) : (
          <>
            <GameSection
              title="🔥 Trending Now"
              fetchFunction={fetchTrending}
              icon="flame"
              color="text-red-500"
            />
            <GameSection
              title="🏆 Top Rated"
              fetchFunction={fetchTopRated}
              icon="trophy"
              color="text-amber-500"
            />
            <GameSection
              title="🆕 Upcoming Releases"
              fetchFunction={fetchUpcoming}
              icon="clock"
              color="text-blue-400"
            />
          </>
        )}
      </div>
      {/* Floating decoration */}
      <motion.div
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="fixed bottom-8 right-8 z-10 hidden md:block"
      >
        <div className="relative">
          <div className="w-16 h-16 bg-red-400 rounded-full flex items-center justify-center shadow-lg">
            <Gamepad2 className="w-8 h-8 text-white" />
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
            className="absolute -top-2 -right-2 bg-red-600 px-2 py-1 rounded-full text-xs text-white font-bold"
          >
            explore
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Games;