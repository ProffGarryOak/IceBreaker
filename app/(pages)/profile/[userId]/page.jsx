'use client'

import { useEffect, useState, use } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Star, Snowflake, Sparkles, ArrowRight, UserPlus, Eye, Ghost, Zap, Rocket, Palette } from 'lucide-react'
import { usePathname } from 'next/navigation'
import QRCode from 'react-qr-code'
import { useUser } from '@clerk/nextjs'
import {
  Film, Tv2, BookOpen, Headphones, Gamepad2,
  Check, Play, Plus, MoreHorizontal, ChevronRight
} from 'lucide-react'
import { motion } from 'framer-motion'

const CATEGORY_STYLES = {
  movies: { 
    icon: <Film className="h-5 w-5 text-amber-400" />, 
    name: 'Cinematic Universe',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400',
    text: 'text-amber-400'
  },
  shows: { 
    icon: <Tv2 className="h-5 w-5 text-cyan-400" />, 
    name: 'Binge Realm',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400',
    text: 'text-cyan-400'
  },
  anime: { 
    icon: <Eye className="h-5 w-5 text-green-400" />, 
    name: 'Anime Dimension',
    bg: 'bg-green-400/10',
    border: 'border-green-400',
    text: 'text-green-400'
  },
  books: { 
    icon: <BookOpen className="h-5 w-5 text-amber-600" />, 
    name: 'Literary Cosmos',
    bg: 'bg-amber-600/10',
    border: 'border-amber-600',
    text: 'text-amber-600'
  },
  songs: { 
    icon: <Headphones className="h-5 w-5 text-purple-400" />, 
    name: 'Sonic Galaxy',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400',
    text: 'text-purple-400'
  },
  games: { 
    icon: <Gamepad2 className="h-5 w-5 text-red-400" />, 
    name: 'Game Nexus',
    bg: 'bg-red-400/10',
    border: 'border-red-400',
    text: 'text-red-400'
  }
}

const STATUS_ICONS = {
  completed: <Check className="h-4 w-4 text-green-400" />,
  inProgress: <Play className="h-4 w-4 text-yellow-400" />,
  planned: <Plus className="h-4 w-4 text-blue-400" />
}

const CATCHY_LINES = [
  "A digital hoarder of epic stories",
  "Professional time-waster since birth",
  "Collector of imaginary worlds",
  "Serial binge-consumer",
  "Media archaeologist",
  "Cultural magpie",
  "Story addict in recovery (not really)"
]

export default function PublicProfile({ params }) {
  const { userId } = use (params)
  const { user: currentUser, isSignedIn } = useUser()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [catchyLine, setCatchyLine] = useState("")
  const pathname = usePathname()
  

  useEffect(() => {
    setCatchyLine(CATCHY_LINES[Math.floor(Math.random() * CATCHY_LINES.length)])
    
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${userId}`)
        if (!res.ok) throw new Error('Profile not found')
        
        const data = await res.json()
        setProfileData(data)
        
        if (isSignedIn && currentUser.id === userId) {
          setIsOwner(true)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId, currentUser, isSignedIn])

  const calculateStats = () => {
    if (!profileData) return { total: 0, byCategory: {}, topCategory: null }
    
    const result = Object.keys(CATEGORY_STYLES).reduce((acc, category) => {
      const categoryData = profileData[category] || {}
      acc.byCategory[category] = {
        completed: categoryData.completed?.length || 0,
        inProgress: categoryData.inProgress?.length || 0,
        planned: categoryData.planned?.length || 0,
        total: (categoryData.completed?.length || 0) + 
               (categoryData.inProgress?.length || 0) + 
               (categoryData.planned?.length || 0),
        items: {
          completed: categoryData.completed?.slice(0, 4) || [],
          inProgress: categoryData.inProgress?.slice(0, 4) || [],
          planned: categoryData.planned?.slice(0, 4) || []
        }
      }
      acc.total += acc.byCategory[category].total

      if (!acc.topCategory || acc.byCategory[category].completed > acc.byCategory[acc.topCategory].completed) {
        acc.topCategory = category
      }

      return acc
    }, { total: 0, byCategory: {}, topCategory: null })

    return result
  }

  const stats = calculateStats()
  const topCategoryTheme = stats.topCategory ? CATEGORY_STYLES[stats.topCategory] : CATEGORY_STYLES.movies

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `A Mysterious Collector's Profile`,
        text: `Check out this intriguing media collection on IceBreaker`,
        url: profileUrl
      }).catch(() => {
        navigator.clipboard.writeText(profileUrl)
        alert('Link copied to clipboard!')
      })
    } else {
      navigator.clipboard.writeText(profileUrl)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-black">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Snowflake className="h-16 w-16 text-blue-400" />
      </motion.div>
    </div>
  )

  if (error) return (
    <div className="text-center mt-12 bg-black min-h-screen flex flex-col items-center justify-center">
      <Ghost className="h-16 w-16 text-red-400 mb-4" />
      <div className="text-red-400 mb-6 text-2xl">This profile has vanished into the void</div>
      <Button 
        onClick={() => window.location.href = '/'}
        className="bg-white text-black hover:bg-white/90 px-8 py-4 text-lg"
      >
        RETURN TO SAFETY
      </Button>
    </div>
  )

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden opacity-10 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: Math.random() * 0.3,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              x: [null, Math.random() * 100],
              y: [null, Math.random() * 100],
              transition: {
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          >
            {Object.values(STATUS_ICONS)[i % 3]}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`rounded-2xl p-8 mb-12 ${topCategoryTheme.bg} border ${topCategoryTheme.border} relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/30 z-0"></div>
          <div className="relative z-10 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block mb-6"
            >
              <Sparkles className={`h-12 w-12 ${topCategoryTheme.text} mb-2 mx-auto`} />
            </motion.div>
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              SECRET COLLECTOR
            </h1>
            <p className={`text-xl ${topCategoryTheme.text} font-mono mb-6`}>
              {catchyLine.toUpperCase()}
            </p>
            <div className="flex justify-center gap-4">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => window.location.href = '/ '} 
                  className="gap-2 bg-white text-black hover:bg-white/90 px-6 py-3 text-lg"
                >
                  <Rocket className="h-5 w-5" />
                  UNLOCK YOUR PROFILE
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Glimpse */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mb-12 text-center"
        >
          <div className={`p-4 rounded-xl ${topCategoryTheme.bg} border ${topCategoryTheme.border}`}>
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-xs uppercase tracking-wider">ARTIFACTS</div>
          </div>
          <div className={`p-4 rounded-xl ${topCategoryTheme.bg} border ${topCategoryTheme.border}`}>
            <div className="text-3xl font-bold">
              {Object.keys(stats.byCategory).filter(c => stats.byCategory[c].total > 0).length}
            </div>
            <div className="text-xs uppercase tracking-wider">DIMENSIONS</div>
          </div>
          <div className={`p-4 rounded-xl ${topCategoryTheme.bg} border ${topCategoryTheme.border}`}>
            <div className="text-3xl font-bold">
              {stats.topCategory ? stats.byCategory[stats.topCategory].completed : 0}
            </div>
            <div className="text-xs uppercase tracking-wider">MASTERED</div>
          </div>
        </motion.div>

        {/* DNA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
            <Zap className={`h-6 w-6 ${topCategoryTheme.text}`} />
            <span>MEDIA DNA</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.byCategory)
              .filter(([_, stat]) => stat.total > 0)
              .map(([category, stat]) => {
                const theme = CATEGORY_STYLES[category]
                return (
                  <motion.div
                    key={category}
                    whileHover={{ scale: 1.03 }}
                    className={`bg-black/50 border ${theme.border} rounded-xl p-5 cursor-pointer`}
                    onClick={() => window.location.href = isOwner ? `/${category}` : '/ '}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {theme.icon}
                        <span className={`font-bold ${theme.text}`}>
                          {theme.name}
                        </span>
                      </div>
                      <span className="text-xl font-mono">{stat.total}</span>
                    </div>
                    
                    <div className="h-2 bg-gray-800 rounded-full mb-3 overflow-hidden">
                      <div 
                        className={`h-full ${theme.bg} rounded-full`}
                        style={{ width: `${(stat.completed / Math.max(1, stat.total)) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs uppercase tracking-wider">
                      <span>CONSUMED</span>
                      <span>{Math.round((stat.completed / Math.max(1, stat.total)) * 100)}%</span>
                    </div>
                  </motion.div>
                )
              })}
          </div>
        </motion.div>

        {/* Mystery Reveal */}
        {stats.topCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className={`rounded-2xl p-8 mb-16 ${topCategoryTheme.bg} border ${topCategoryTheme.border} text-center`}
          >
            <h2 className="text-2xl font-bold mb-2">PRIMARY OBSESSION</h2>
            <p className="mb-6">This collector's dominant dimension reveals their true nature</p>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <div className={`text-5xl font-bold mb-2 ${topCategoryTheme.text}`}>
                {CATEGORY_STYLES[stats.topCategory].name.toUpperCase()}
              </div>
            </motion.div>
            
            <div className="mt-6 flex justify-center">
              <div className={`text-sm px-4 py-2 rounded-full ${topCategoryTheme.bg} ${topCategoryTheme.border} border`}>
                {stats.byCategory[stats.topCategory].completed} MASTERPIECES CONQUERED
              </div>
            </div>
          </motion.div>
        )}
<div className={`rounded-xl p-6 mb-8 ${topCategoryTheme.bg} border ${topCategoryTheme.border}`}>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Star className={`h-5 w-5 ${topCategoryTheme.text}`} />
          <span>Top Categories</span>
        </h2>
        
        {Object.entries(stats.byCategory)
          .filter(([_, stat]) => stat.completed > 0)
          .sort((a, b) => b[1].completed - a[1].completed)
          .slice(0, 6)
          .map(([category, stat]) => {
            const theme = CATEGORY_STYLES[category]
            return (
              <div key={category} className="mb-8 last:mb-0">
                <div className="flex items-center gap-3 mb-4">
                  {theme.icon}
                  <h3 className={`font-bold text-lg ${theme.text}`}>
                    {theme.name}
                  </h3>
                  <span className="text-sm text-gray-300 ml-auto">
                    {stat.completed} completed
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {stat.items.completed.map((item, i) => (
                    <div 
                      key={i} 
                      className={`bg-gray-900/70 rounded-lg p-3 border ${theme.border} hover:scale-105 transition-transform cursor-pointer`}
                      onClick={() => window.location.href = isOwner ? `/${category}` : '/ '}
                    >
                      <div className={`font-medium text-sm truncate ${theme.text}`}>
                        {item.title || item.name || `Item ${i+1}`}
                      </div>
                      {item.image && (
                        <div className="mt-2 aspect-square bg-gray-800 rounded overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title || ''}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
      </div>

        {/* Interactive Teaser */}
        {!isOwner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mb-16 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">YOUR TURN TO COLLECT</h2>
            <p className="mb-8 max-w-2xl mx-auto">
              This is just a glimpse. Create your own profile to track, analyze, and showcase your media conquests across all dimensions.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button 
                onClick={() => window.location.href = '/ '} 
                className="gap-3 bg-white text-black hover:bg-white/90 px-8 py-4 text-lg"
              >
                <Palette className="h-6 w-6" />
                PAINT YOUR OWN CANVAS
              </Button>
            </motion.div>
          </motion.div>
        )}

        
        

        {/* Cosmic Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-center text-gray-500 text-sm"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Snowflake className="h-5 w-5" />
            <span>MEDIA COLLECTION #{userId.slice(5, 25).toUpperCase()}</span>
            <Sparkles className="h-5 w-5" />
          </div>
          
          <div className="border-t border-gray-800 pt-6">
            The universe is made of stories, not atoms
          </div>
        </motion.div>
      </div>
    </div>
  )
}