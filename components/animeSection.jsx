'use client';
import React, { useEffect, useState } from 'react';
import { fetchAnime } from '@/lib/fetchAnime';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Star, Play, Heart, Share2, Tv } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const AnimeSection = ({ title, query, variant = 'trending' }) => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredAnime, setHoveredAnime] = useState(null);

  useEffect(() => {
    const getAnime = async () => {
      try {
        setLoading(true);
        const data = await fetchAnime(query, { page: 1, perPage: 10 });
        setAnimeList(data);
      } catch (error) {
        console.error("Error fetching anime:", error);
      } finally {
        setLoading(false);
      }
    };
    getAnime();
  }, [query]);

  const variantColors = {
    trending: {
      bg: 'from-red-900/20 to-pink-900/20',
      icon: <Flame className="w-6 h-6 text-red-500" />,
      border: 'hover:border-pink-500'
    },
    top: {
      bg: 'from-amber-900/20 to-yellow-900/20',
      icon: <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />,
      border: 'hover:border-amber-500'
    },
    new: {
      bg: 'from-blue-900/20 to-cyan-900/20',
      icon: <Play className="w-6 h-6 text-blue-400" />,
      border: 'hover:border-blue-500'
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`py-14 px-4 md:px-10 bg-gradient-to-br ${variantColors[variant].bg}`}
    >
      <div className="flex items-center gap-3 mb-8">
        <motion.div
          whileHover={{ rotate: 15, scale: 1.2 }}
          className="p-2 rounded-full bg-gray-900 shadow-md"
        >
          {variantColors[variant].icon}
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {animeList.map((anime) => (
            <motion.div
              key={anime.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.03 }}
              onHoverStart={() => setHoveredAnime(anime.id)}
              onHoverEnd={() => setHoveredAnime(null)}
              className="relative"
            >
              <div className={`bg-gray-900 rounded-xl shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 border-2 ${hoveredAnime === anime.id ? variantColors[variant].border : 'border-transparent'}`}>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={anime.coverImage.large}
                    alt={anime.title.english || anime.title.romaji}
                    className={`w-full h-full object-cover transition-transform duration-500 ${hoveredAnime === anime.id ? 'scale-110' : 'scale-100'}`}
                  />
                  {hoveredAnime === anime.id && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 gap-2"
                    >
                      <button className="p-2 bg-pink-600 rounded-full hover:bg-pink-700 transition">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                  <div className="absolute top-2 right-2 bg-gray-900/90 px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg border border-yellow-400">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-medium">{anime.averageScore || 'N/A'}</span>
                  </div>
                  {anime.isAdult && (
                    <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded-full text-xs text-white">
                      18+
                    </div>
                  )}
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                    {anime.title.english || anime.title.romaji}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {anime.genres?.slice(0, 3).map(genre => (
                      <span 
                        key={genre} 
                        className="text-xs px-2 py-1 bg-white/10 rounded-full text-white"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-3 flex-grow">
                    {anime.description?.replace(/<[^>]*>/g, '').slice(0, 120) + '...'}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-400 mt-3">
                    <span>{anime.format || 'TV'}</span>
                    <span>{anime.seasonYear || new Date().getFullYear()}</span>
                  </div>
                </div>
              </div>
              {hoveredAnime === anime.id && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 -right-3 bg-yellow-400 rounded-full p-1 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-gray-900" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default AnimeSection;