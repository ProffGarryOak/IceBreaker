"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Star, Flame, Trophy, Sparkles, Clock, Search, Heart, Share2, ClipboardCheck, ClipboardCopy, ClipboardList, LoaderCircle, Check, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 750);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-600/90' : 'bg-red-500';
  
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
const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap z-50"
          >
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BookCard = ({ book, isHovered, onHover }) => {
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });
  const [isAdding, setIsAdding] = useState({ completed: false, inProgress: false, planned: false });
  const info = book.volumeInfo;

  const addToCollection = async (listType) => {
    try {
      setIsAdding(prev => ({ ...prev, [listType]: true }));
      
      const res = await fetch('/api/content/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 'books',
          list: listType,
          item: {
            id: book.id || `book-${info.title.replace(/\s+/g, '-').toLowerCase()}`,
            title: info.title,
            year: info.publishedDate?.slice(0, 4) || 'N/A',
            image: info.imageLinks?.thumbnail || '/default-book-cover.jpg',
            description: info.description?.replace(/<[^>]*>/g, '').slice(0, 120) + '...' || 'No description available.',
            genre: info.categories?.[0] || 'Book',
            author: info.authors?.join(', ') || 'Unknown Author',
            rating: info.averageRating || 'N/A'
          }
        })
      });

      const data = await res.json();
      
      // Show success feedback
      let listName = '';
      if (listType === 'completed') listName = 'Read';
      else if (listType === 'inProgress') listName = 'Reading';
      else if (listType === 'planned') listName = 'Read Later';
      
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
        message: 'Failed to add book',
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
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => onHover(book.id)}
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
      
      <div className={`bg-gray-900 rounded-xl shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 border-2 ${isHovered ? 'border-amber-800' : 'border-transparent'}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={info.imageLinks?.thumbnail || '/default-book-cover.jpg'}
            alt={info.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
          />
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4 gap-2"
            >
              <Tooltip content="Add to Read">
                <button 
                  className={`p-3 border-2 border-amber-800 rounded-full bg-white/20 hover:bg-green-500/30 transition shadow-lg relative ${isAdding.completed ? 'opacity-50' : ''}`}
                  onClick={() => !isAdding.completed && addToCollection('completed')}
                  disabled={isAdding.completed}
                  aria-label="Add to Read"
                >
                  {isAdding.completed ? (
                    <LoaderCircle className="w-5 h-5 text-green-500 animate-spin" />
                  ) : (
                    <ClipboardCheck className="w-5 h-5 text-green-500 font-extrabold" />
                  )}
                </button>
              </Tooltip>
              
              <Tooltip content="Add to Currently Reading">
                <button 
                  className={`p-3 border-2 border-amber-800 bg-white/20 rounded-full hover:bg-rose-500/30 transition shadow-lg relative ${isAdding.inProgress ? 'opacity-50' : ''}`}
                  onClick={() => !isAdding.inProgress && addToCollection('inProgress')}
                  disabled={isAdding.inProgress}
                  aria-label="Add to Currently Reading"
                >
                  {isAdding.inProgress ? (
                    <LoaderCircle className="w-5 h-5 text-rose-500 animate-spin" />
                  ) : (
                    <ClipboardCopy className="w-5 h-5 text-rose-500" />
                  )}
                </button>
              </Tooltip>
              
              <Tooltip content="Add to Read Later">
                <button 
                  className={`p-3 border-2 border-amber-800 bg-white/20 rounded-full hover:bg-blue-500/30 transition shadow-lg relative ${isAdding.planned ? 'opacity-50' : ''}`}
                  onClick={() => !isAdding.planned && addToCollection('planned')}
                  disabled={isAdding.planned}
                  aria-label="Add to Read Later"
                >
                  {isAdding.planned ? (
                    <LoaderCircle className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : (
                    <ClipboardList className="w-5 h-5 text-blue-500" />
                  )}
                </button>
              </Tooltip>
            </motion.div>
          )}
          {info.averageRating && (
            <div className="absolute top-2 right-2 bg-gray-900/90 px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg border border-amber-800">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span className="text-white font-medium">{info.averageRating}</span>
            </div>
          )}
        </div>
        <div className="p-5 flex-grow flex flex-col bg-gray-900">
          <h3 className="text-lg font-bold mb-2 line-clamp-2 text-white">{info.title}</h3>
          <p className="text-sm italic text-gray-300 mb-3 line-clamp-1">
            {info.authors?.join(', ') || 'Unknown Author'}
          </p>
          <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-grow">
            {info.description?.replace(/<[^>]*>/g, '').slice(0, 120) + '...' || 'No description available.'}
          </p>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>{info.publishedDate?.slice(0,4) || 'N/A'}</span>
            <span>{info.pageCount ? `${info.pageCount} pages` : ''}</span>
          </div>
        </div>
      </div>
      {isHovered && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -right-3 bg-amber-800 rounded-full p-1 shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

const BookSection = ({ title, query, icon, color }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredBook, setHoveredBook] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=6`)
      .then(res => res.json())
      .then(data => {
        if (data.items) setBooks(data.items);
      })
      .finally(() => setLoading(false));
  }, [query]);

  const iconMap = {
    flame: <Flame className={`w-5 h-5 ${color}`} />,
    trophy: <Trophy className={`w-5 h-5 ${color}`} />,
    clock: <Clock className={`w-5 h-5 ${color}`} />,
    sparkles: <Sparkles className={`w-5 h-5 ${color}`} />
  };

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
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
          {title}
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl bg-gray-800/80" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard 
              key={book.id}
              book={book}
              isHovered={hoveredBook === book.id}
              onHover={setHoveredBook}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const Books = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [globalToast, setGlobalToast] = useState({ show: false, message: '', type: 'success' });

  const closeGlobalToast = () => {
    setGlobalToast(prev => ({ ...prev, show: false }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-950/60 to-amber-950 p-6 md:p-10"
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
            <BookOpen className="w-12 h-12 text-amber-600 mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-800">
            Book Explorer
          </h1>
          <p className="text-gray-200 mb-6 text-center max-w-lg">
            Discover your next favorite read in our magical library
          </p>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for books, authors..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {searchQuery ? (
          <BookSection 
            title={`Search: ${searchQuery}`} 
            query={searchQuery} 
            icon="sparkles" 
            color="text-purple-500" 
          />
        ) : (
          <>
            <BookSection 
              title=" Trending Now" 
              query="fiction trending in 2025" 
              icon="flame" 
              color="text-red-500" 
            />
            <BookSection 
              title=" All-Time Classics" 
              query="subject:classics" 
              icon="trophy" 
              color="text-amber-500" 
            />
            <BookSection 
              title=" New Releases" 
              query="new releases 2025" 
              icon="clock" 
              color="text-blue-500" 
            />
            <BookSection 
              title=" Graphic Novels" 
              query="subject:graphic novels" 
              icon="sparkles" 
              color="text-purple-500" 
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
          <div className="w-16 h-16 bg-amber-800 rounded-full flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
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
            className="absolute -top-2 -right-2 bg-orange-400 px-2 py-1 rounded-full text-xs text-white font-bold"
          >
            explore
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Books;