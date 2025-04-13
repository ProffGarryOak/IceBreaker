'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Share2, Star, Snowflake, Sparkles } from 'lucide-react'
import { usePathname } from 'next/navigation'
import QRCode from 'react-qr-code'
import { useUser } from '@clerk/nextjs'
import {
  Film, Tv2, Eye, BookOpen, Headphones, Gamepad2,
  Check, Play, Plus, MoreHorizontal
} from 'lucide-react'

const CATEGORY_STYLES = {
  movies: { 
    icon: <Film className="h-5 w-5 text-amber-400" />, 
    name: 'Movies',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400',
    text: 'text-amber-400'
  },
  shows: { 
    icon: <Tv2 className="h-5 w-5 text-cyan-400" />, 
    name: 'TV Shows',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400',
    text: 'text-cyan-400'
  },
  anime: { 
    icon: <Eye className="h-5 w-5 text-green-400" />, 
    name: 'Anime',
    bg: 'bg-green-400/10',
    border: 'border-green-400',
    text: 'text-green-400'
  },
  books: { 
    icon: <BookOpen className="h-5 w-5 text-amber-600" />, 
    name: 'Books',
    bg: 'bg-amber-600/10',
    border: 'border-amber-600',
    text: 'text-amber-600'
  },
  music: { 
    icon: <Headphones className="h-5 w-5 text-purple-400" />, 
    name: 'Music',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400',
    text: 'text-purple-400'
  },
  games: { 
    icon: <Gamepad2 className="h-5 w-5 text-red-400" />, 
    name: 'Games',
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

export default function PublicProfile({ params }) {
  const { userId } = params
  const { user } = useUser()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const pathname = usePathname()
  const profileUrl = `${window.location.origin}${pathname}`

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${userId}`)
        if (!res.ok) throw new Error('Profile not found')
        
        const data = await res.json()
        setProfileData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

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

      // Track top category
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
    const displayName = user?.username || user?.fullName || `User ${userId.slice(0, 6)}`
    if (navigator.share) {
      navigator.share({
        title: `${displayName}'s Watchlist`,
        text: `Check out ${displayName}'s media collection on IceBreaker`,
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
    <div className="flex justify-center items-center h-screen">
      <Snowflake className="h-12 w-12 text-blue-400 animate-spin" />
    </div>
  )

  if (error) return (
    <div className="text-center mt-12">
      <div className="text-red-400 mb-4">Error: {error}</div>
      <Button onClick={() => window.location.href = '/'}>
        Back to Home
      </Button>
    </div>
  )

  const displayName = user?.username || user?.fullName || `user-${userId.slice(0, 6)}`

  return (
    <div className={`container mx-auto px-4 py-8 max-w-4xl text-white`}>
      {/* Hero Section with Top Category Theme */}
      <div className={`rounded-2xl p-6 mb-8 ${topCategoryTheme.bg} border ${topCategoryTheme.border}`}>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold mb-2">Hey There!</h1>
          <h2 className={`text-2xl ${topCategoryTheme.text} font-medium mb-4`}>
            Take a look at my watchlist
          </h2>
          
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className={`h-5 w-5 ${topCategoryTheme.text}`} />
            Media Stats
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Total Items:</span>
            <span className={`font-bold ${topCategoryTheme.text}`}>{stats.total}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats.byCategory)
            .filter(([_, stat]) => stat.total > 0)
            .map(([category, stat]) => {
              const theme = CATEGORY_STYLES[category]
              return (
                <div 
                  key={category} 
                  className={`bg-gray-900/50 border ${theme.border} rounded-lg p-4 hover:scale-[1.02] transition-transform`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {theme.icon}
                      <span className={`font-medium ${theme.text}`}>
                        {theme.name}
                      </span>
                    </div>
                    <span className="font-bold">{stat.total}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-3">
                    <div className="flex items-center gap-1">
                      {STATUS_ICONS.completed}
                      <span>{stat.completed}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {STATUS_ICONS.inProgress}
                      <span>{stat.inProgress}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {STATUS_ICONS.planned}
                      <span>{stat.planned}</span>
                    </div>
                  </div>

                  {stat.items.completed.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-xs text-gray-400 mb-1">Recently completed:</h4>
                      <div className="flex flex-wrap gap-1">
                        {stat.items.completed.map((item, i) => (
                          <span 
                            key={i} 
                            className={`text-xs ${theme.bg} ${theme.text} px-2 py-0.5 rounded`}
                          >
                            {item.title || item.name || `Item ${i+1}`}
                          </span>
                        ))}
                        {stat.completed > 4 && (
                          <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded flex items-center">
                            +{stat.completed - 4} <MoreHorizontal className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      </div>

      {/* Top Categories Section */}
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
                      className={`bg-gray-900/70 rounded-lg p-3 border ${theme.border} hover:scale-105 transition-transform`}
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

      {/* Share Section */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold mb-1">Like what you see?</h3>
          <p className="text-sm text-gray-400">Share my profile with others</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={shareProfile}
            className={`gap-2 ${topCategoryTheme.bg} hover:${topCategoryTheme.bg} border ${topCategoryTheme.border}`}
          >
            <Share2 className="h-4 w-4" />
            Share Profile
          </Button>
          <div className="p-2 bg-white rounded border border-gray-200">
            <QRCode 
              value={profileUrl}
              size={80}
              level="H"
              fgColor={topCategoryTheme.border.replace('border-', '')}
              bgColor="transparent"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2">
          <Snowflake className="h-4 w-4" />
          <span>{profileUrl.replace('https://', '')}</span>
          <Sparkles className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}