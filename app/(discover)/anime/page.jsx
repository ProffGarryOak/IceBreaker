"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tv, Star, Flame, Trophy, Sparkles, Clock, Search, Heart, Share2, Play, List, ClipboardCheck, ClipboardCopy, ClipboardList, LoaderCircle, Check, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 750);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-emerald-600/90' : 'bg-red-500';
  
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

// Tooltip component
const Tooltip = ({ children, content }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg border border-emerald-400 z-10">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-t-4 border-r-4 border-l-4 border-t-gray-900 border-r-transparent border-l-transparent"></div>
      </div>
    </div>
  );
};

const AnimeCard = ({ anime, isHovered, onHover }) => {
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
          category: 'anime',
          list: listType,
          item: {
            id: anime.mal_id || `anime-${anime.title.replace(/\s+/g, '-').toLowerCase()}`,
            title: anime.title,
            year: anime.year || 'TBA',
            image: anime.images?.jpg?.large_image_url || '/default-anime-poster.jpg',
            description: anime.synopsis?.slice(0, 120) + '...' || 'Synopsis not available',
            genre: anime.genres?.[0]?.name || anime.type || 'Anime',
            episodes: anime.episodes || '?',
            status: anime.status?.split(' ')[0] || 'Unknown',
            score: anime.score?.toFixed(1) || 'N/A'
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
        message: 'Failed to add anime',
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
      onHoverStart={() => onHover(anime.mal_id)}
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
      
      <div className={`bg-gray-900 rounded-xl shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 border-2 ${isHovered ? 'border-emerald-400' : 'border-transparent'}`}>
        <div className="relative h-80 overflow-hidden">
          <img
            src={anime.images?.jpg?.large_image_url || '/default-anime-poster.jpg'}
            alt={anime.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 gap-2"
            >
              <Tooltip content="Watched">
                <button 
                  className={`p-3 border-2 border-emerald-500 rounded-full bg-gray-500/20 hover:bg-green-500/30 transition shadow-lg relative ${isAdding.completed ? 'opacity-50' : ''}`}
                  onClick={() => !isAdding.completed && addToCollection('completed')}
                  disabled={isAdding.completed}
                >
                  {isAdding.completed ? (
                    <LoaderCircle className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <ClipboardCheck className="w-5 h-5 text-white" />
                  )}
                </button>
              </Tooltip>
              
              <Tooltip content="Currently Watching">
                <button 
                   className={`p-3 border-2 border-emerald-500 bg-gray-500/20 rounded-full hover:bg-rose-500/30 transition shadow-lg relative ${isAdding.inProgress ? 'opacity-50' : ''}`}
                  onClick={() => !isAdding.inProgress && addToCollection('inProgress')}
                  disabled={isAdding.inProgress}
                >
                  {isAdding.inProgress ? (
                    <LoaderCircle className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <ClipboardCopy className="w-5 h-5 text-white" />
                  )}
                </button>
              </Tooltip>
              
              <Tooltip content="Watch Later">
                <button 
                 className={`p-3 border-2 border-emerald-500 bg-gray-500/20 rounded-full hover:bg-blue-500/30 transition shadow-lg relative ${isAdding.planned ? 'opacity-50' : ''}`}
                  onClick={() => !isAdding.planned && addToCollection('planned')}
                  disabled={isAdding.planned}
                >
                  {isAdding.planned ? (
                    <LoaderCircle className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <ClipboardList className="w-5 h-5 text-white" />
                  )}
                </button>
              </Tooltip>
            </motion.div>
          )}
          {anime.score && (
            <div className="absolute top-3 right-3 bg-gray-900/90 px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg border border-emerald-400">
              <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
              <span className="text-white font-medium">{anime.score.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{anime.title}</h3>
          <p className="text-sm text-gray-400 mb-3">
            {anime.year || 'TBA'} • {anime.genres?.[0]?.name || anime.type || 'Anime'}
          </p>
          <p className="text-sm text-gray-300 line-clamp-3 flex-grow">
            {anime.synopsis?.slice(0, 120) + '...' || 'Synopsis not available'}
          </p>
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-emerald-400">
              {anime.episodes || '?'} eps
            </span>
            <span className="text-xs text-gray-400">
              {anime.status?.split(' ')[0] || 'Unknown'}
            </span>
          </div>
        </div>
      </div>
      {isHovered && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -right-3 bg-emerald-400 rounded-full p-1 shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

const AnimeSection = ({ title, fetchFunction, icon, color, searchQuery }) => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredAnime, setHoveredAnime] = useState(null);

  const iconMap = {
    flame: <Flame className={`w-5 h-5 ${color}`} />,
    trophy: <Trophy className={`w-5 h-5 ${color} fill-current`} />,
    clock: <Clock className={`w-5 h-5 ${color}`} />,
    list: <List className={`w-5 h-5 ${color}`} />
  };

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        const data = await fetchFunction();
        
        // Filter out duplicates and limit to 8
        const uniqueAnime = [];
        const seenIds = new Set();
        
        for (const anime of data.data || []) {
          if (!seenIds.has(anime.mal_id) && uniqueAnime.length < 8) {
            seenIds.add(anime.mal_id);
            uniqueAnime.push(anime);
          }
        }
        
        setAnimeList(uniqueAnime);
      } catch (error) {
        console.error("Error fetching anime:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (!searchQuery || title.includes('Search')) {
      fetchAnime();
    }
  }, [fetchFunction, searchQuery, title]);

  // Show empty state only if we're not in search mode and there's no results
  const showEmptyState = !searchQuery && animeList.length === 0 && !loading;

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
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-emerald-600">
          {title}
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={`skeleton-${i}`} className="h-96 rounded-xl bg-gray-800/50" />
          ))}
        </div>
      ) : showEmptyState ? (
        <div className="bg-gray-900/50 rounded-xl p-8 text-center">
          <p className="text-gray-400">No anime found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {animeList.map((anime) => (
            <AnimeCard 
              key={`${anime.mal_id}-${title}`} 
              anime={anime} 
              isHovered={hoveredAnime === anime.mal_id}
              onHover={setHoveredAnime}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Jikan API fetch functions
const fetchTopAnime = () => fetch('https://api.jikan.moe/v4/top/anime?filter=bypopularity').then(res => res.json());
const fetchTrendingAnime = () => fetch('https://api.jikan.moe/v4/top/anime?filter=airing').then(res => res.json());
const fetchUpcomingAnime = () => fetch('https://api.jikan.moe/v4/top/anime?filter=upcoming').then(res => res.json());
const fetchCurrentSeason = () => fetch('https://api.jikan.moe/v4/seasons/now').then(res => res.json());
const fetchSearchAnime = (query) => fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`).then(res => res.json());

const Anime = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [globalToast, setGlobalToast] = useState({ show: false, message: '', type: 'success' });

  const closeGlobalToast = () => {
    setGlobalToast(prev => ({ ...prev, show: false }));
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const data = await fetchSearchAnime(searchQuery);
        
        // Filter out duplicates
        const uniqueAnime = [];
        const seenIds = new Set();
        
        for (const anime of data.data || []) {
          if (!seenIds.has(anime.mal_id) && uniqueAnime.length < 8) {
            seenIds.add(anime.mal_id);
            uniqueAnime.push(anime);
          }
        }
        
        setSearchResults(uniqueAnime);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-900/20 p-6 md:p-10"
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
              rotate: [0, 10, -10, 0],
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Tv className="w-12 h-12 text-emerald-500 mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
            Anime Universe
          </h1>
          <p className="text-gray-400 mb-6 text-center max-w-lg">
            Discover your next anime obsession
          </p>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for anime, characters..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {searchQuery ? (
          <AnimeSection 
            title={`Search: ${searchQuery}`} 
            fetchFunction={() => Promise.resolve({ data: searchResults })}
            icon="sparkles" 
            color="text-emerald-500"
            searchQuery={searchQuery}
          />
        ) : (
          <>
            <AnimeSection 
              title="🔥 Trending Now" 
              fetchFunction={fetchTrendingAnime}
              icon="flame" 
              color="text-red-500"
              searchQuery={searchQuery}
            />
            <AnimeSection 
              title="🏆 Top Rated" 
              fetchFunction={fetchTopAnime}
              icon="trophy" 
              color="text-amber-500"
              searchQuery={searchQuery}
            />
            <AnimeSection 
              title="🆕 Upcoming" 
              fetchFunction={fetchUpcomingAnime}
              icon="clock" 
              color="text-blue-400"
              searchQuery={searchQuery}
            />
            <AnimeSection 
              title="📺 Current Season" 
              fetchFunction={fetchCurrentSeason}
              icon="list" 
              color="text-purple-400"
              searchQuery={searchQuery}
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
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
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
            className="absolute -top-2 -right-2 bg-emerald-400 px-2 py-1 rounded-full text-xs text-gray-900 font-bold"
          >
            KAKKOII!
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Anime;