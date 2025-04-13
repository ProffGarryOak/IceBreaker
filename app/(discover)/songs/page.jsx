"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Headphones, Star, Flame, Trophy, Sparkles, Clock, Search, Heart, Share2, Play, LoaderCircle, Check, X, BookOpen, Bookmark, ClipboardCheck, ClipboardList, ClipboardCopy } from 'lucide-react';
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

const SongCard = ({ song, isHovered, onHover }) => {
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
          category: 'songs',
          list: listType,
          item: {
            id: song.trackId || `song-${song.trackName.replace(/\s+/g, '-').toLowerCase()}`,
            title: song.trackName,
            artist: song.artistName,
            image: song.artworkUrl100.replace('100x100', '300x300') || '/default-music-cover.jpg',
            genre: song.primaryGenreName,
            duration: Math.floor(song.trackTimeMillis/60000) + ':' + String(Math.floor((song.trackTimeMillis%60000)/1000)).padStart(2, '0'),
            previewUrl: song.previewUrl,
            rating: song.trackRating ? (song.trackRating/10).toFixed(1) : null
          }
        })
      });

      const data = await res.json();
      
      // Show success feedback
      let listName = '';
      if (listType === 'completed') listName = 'Listened';
      else if (listType === 'inProgress') listName = 'Currently Playing';
      else if (listType === 'planned') listName = 'Listen Later';
      
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
        message: 'Failed to add song',
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
      onHoverStart={() => onHover(song.trackId)}
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
      <div className={`bg-gray-900 rounded-xl shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 border-2 ${isHovered ? 'border-purple-500' : 'border-transparent'}`}>
        <div className="relative h-64 overflow-hidden">
          <img
            src={song.artworkUrl100.replace('100x100', '300x300') || '/default-music-cover.jpg'}
            alt={song.trackName}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 gap-2"
            >
              <button 
                className={`p-3 border-2 border-purple-500 rounded-full bg-gray-500/20 hover:bg-green-500/30 transition shadow-lg relative ${isAdding.completed ? 'opacity-50' : ''}`}
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
                className={`p-3 border-2 border-purple-500 bg-gray-100/20 rounded-full hover:bg-rose-500/30 transition shadow-lg relative ${isAdding.inProgress ? 'opacity-50' : ''}`}
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
                className={`p-3 border-2 border-purple-500 bg-gray-500/20 rounded-full hover:bg-blue-500/30 transition shadow-lg relative ${isAdding.planned ? 'opacity-50' : ''}`}
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
          {song.trackRating && (
            <div className="absolute top-3 right-3 bg-gray-900/90 px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg border border-purple-500">
              <Star className="w-3 h-3 fill-purple-400 text-purple-400" />
              <span className="text-white font-medium">{(song.trackRating/10).toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{song.trackName}</h3>
          <p className="text-sm text-gray-400 mb-3 line-clamp-1">
            {song.artistName}
          </p>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-xs text-purple-400">
              {song.primaryGenreName}
            </span>
            <span className="text-xs text-gray-400">
              {Math.floor(song.trackTimeMillis/60000)}:{String(Math.floor((song.trackTimeMillis%60000)/1000)).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
      {isHovered && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -right-3 bg-purple-500 rounded-full p-1 shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

const SongSection = ({ title, searchTerm, icon, color }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSong, setHoveredSong] = useState(null);

  const iconMap = {
    flame: <Flame className={`w-5 h-5 ${color}`} />,
    trophy: <Trophy className={`w-5 h-5 ${color} fill-current`} />,
    clock: <Clock className={`w-5 h-5 ${color}`} />,
    headphones: <Headphones className={`w-5 h-5 ${color}`} />
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=8`);
        const data = await res.json();
        setSongs(data.results || []);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [searchTerm]);

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
            <Skeleton key={i} className="h-80 rounded-xl bg-gray-800/50" />
          ))}
        </div>
      ) : songs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {songs.map((song) => (
            <SongCard 
              key={song.trackId} 
              song={song} 
              isHovered={hoveredSong === song.trackId}
              onHover={setHoveredSong}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-900/50 rounded-xl p-8 text-center">
          <p className="text-gray-400">No songs found</p>
        </div>
      )}
    </motion.div>
  );
};

const Songs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [globalToast, setGlobalToast] = useState({ show: false, message: '', type: 'success' });

  const closeGlobalToast = () => {
    setGlobalToast(prev => ({ ...prev, show: false }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#2e4531] to-purple-900 p-6 md:p-10"
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
            <Music className="w-12 h-12 text-purple-500 mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            Sound Waves
          </h1>
          <p className="text-gray-400 mb-6 text-center max-w-lg">
            Discover music that moves you
          </p>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for songs, artists..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {searchQuery ? (
          <SongSection 
            title={`Search: ${searchQuery}`} 
            searchTerm={searchQuery}
            icon="sparkles" 
            color="text-purple-500" 
          />
        ) : (
          <>
            <SongSection 
              title="🔥 Hot Right Now" 
              searchTerm="top songs 2025"
              icon="flame" 
              color="text-red-500" 
            />
            <SongSection 
              title="🏆 All-Time Hits" 
              searchTerm="classic hits"
              icon="trophy" 
              color="text-amber-500" 
            />
            <SongSection 
              title="🆕 New Releases" 
              searchTerm="new music this week"
              icon="clock" 
              color="text-blue-400" 
            />
            <SongSection 
              title="🎧 Your Vibes" 
              searchTerm="sexy"
              icon="headphones" 
              color="text-green-400" 
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
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <Headphones className="w-8 h-8 text-white" />
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
            className="absolute -top-2 -right-2 bg-purple-400 px-2 py-1 rounded-full text-xs text-gray-900 font-bold"
          >
            JAM!
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Songs;