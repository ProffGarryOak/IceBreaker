'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Download, Edit, Save, Share2, Sparkles, Heart, Star, Hash, Snowflake } from 'lucide-react'
import { toPng } from 'html-to-image'
import { useUser } from '@clerk/nextjs'
import QRCode from 'react-qr-code'
import {
  Film, Tv2, Eye, BookOpen, Headphones, Gamepad2,
  Popcorn, Clapperboard, Wand2, Sword, Music, Bookmark, Check, Play, Plus, X
} from 'lucide-react'
import Link from 'next/link'
const CATEGORY_STYLES = {
  movies: {
    bg: 'bg-gradient-to-br from-amber-400/10 to-amber-600/20',
    border: 'border-amber-400',
    icon: <Clapperboard className="h-5 w-5 text-amber-400" />,
    iconSolid: <Popcorn className="h-5 w-5 text-amber-400 fill-amber-400" />,
    accent: 'text-amber-400',
    name: 'Movies',
    tagline: 'Cinema Buff',
    cta: 'Join to discover hidden cinematic gems'
  },
  shows: {
    bg: 'bg-gradient-to-br from-cyan-300/10 to-cyan-700/20',
    border: 'border-cyan-400',
    icon: <Tv2 className="h-5 w-5 text-cyan-400" />,
    iconSolid: <Tv2 className="h-5 w-5 text-cyan-400 fill-cyan-400/20" />,
    accent: 'text-cyan-400',
    name: 'TV Shows',
    tagline: 'Binge Watcher',
    cta: 'Find your next binge-worthy series'
  },
  anime: {
    bg: 'bg-gradient-to-br from-emerald-400/10 to-emerald-700/20',
    border: 'border-emerald-400',
    icon: <Sword className="h-5 w-5 text-emerald-400" />,
    iconSolid: <Wand2 className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />,
    accent: 'text-emerald-400',
    name: 'Anime',
    tagline: 'Otaku Supreme',
    cta: 'Connect with fellow anime enthusiasts'
  },
  books: {
    bg: 'bg-gradient-to-br from-amber-600/10 to-amber-800/20',
    border: 'border-amber-600',
    icon: <BookOpen className="h-5 w-5 text-amber-600" />,
    iconSolid: <Bookmark className="h-5 w-5 text-amber-600 fill-amber-600/20" />,
    accent: 'text-amber-600',
    name: 'Books',
    tagline: 'Page Turner',
    cta: 'Share your literary adventures'
  },
  songs: {
    bg: 'bg-gradient-to-br from-purple-400/10 to-purple-600/20',
    border: 'border-purple-400',
    icon: <Music className="h-5 w-5 text-purple-400" />,
    iconSolid: <Headphones className="h-5 w-5 text-purple-400 fill-purple-400/20" />,
    accent: 'text-purple-400',
    name: 'Music',
    tagline: 'Melody Maker',
    cta: 'Track and share your sonic journey'
  },
  games: {
    bg: 'bg-gradient-to-br from-red-400/10 to-red-600/20',
    border: 'border-red-400',
    icon: <Gamepad2 className="h-5 w-5 text-red-400" />,
    iconSolid: <Gamepad2 className="h-5 w-5 text-red-400 fill-red-400/20" />,
    accent: 'text-red-400',
    name: 'Games',
    tagline: 'Game Master',
    cta: 'Level up your gaming experience'
  }
}

const STATUS_ICONS = {
  completed: <Check className="h-4 w-4 text-emerald-400" />,
  inProgress: <Play className="h-4 w-4 text-yellow-400" />,
  planned: <Plus className="h-4 w-4 text-blue-400" />
}

export default function IceCardMaker() {
  const { isLoaded, user } = useUser()
  const [contentData, setContentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [customDescription, setCustomDescription] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('movies')
  const [editMode, setEditMode] = useState(false)
  const qrCodeRef = useRef(null)
  const [qrCodeSize, setQrCodeSize] = useState(80)

  useEffect(() => {
    if (!isLoaded) return

    const fetchData = async () => {
      try {
        const res = await fetch('/api/content/get')
        if (!res.ok) throw new Error('Failed to fetch content')
        
        const data = await res.json()
        setContentData(data)
        
        const username = user?.username || 'MediaEnthusiast'
        const topCategories = Object.entries(data)
          .filter(([key]) => Object.keys(CATEGORY_STYLES).includes(key))
          .sort((a, b) => (b[1].completed?.length || 0) - (a[1].completed?.length || 0))
        
        if (topCategories.length > 0) {
          setSelectedTheme(topCategories[0][0])
        }
        
        setCustomDescription(`✨ ${username}'s ${topCategories.slice(0, 3).map(([key]) => CATEGORY_STYLES[key]?.name || '').filter(Boolean).join(' • ')} journey`)
        
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [isLoaded, user])

  useEffect(() => {
    const updateQrCodeSize = () => {
      if (qrCodeRef.current) {
        const width = qrCodeRef.current.offsetWidth
        setQrCodeSize(Math.min(width, 80))
      }
    }

    updateQrCodeSize()
    window.addEventListener('resize', updateQrCodeSize)

    return () => {
      window.removeEventListener('resize', updateQrCodeSize)
    }
  }, [])

  const calculateStats = () => {
    if (!contentData) return { total: 0, byCategory: {}, topCategory: null }
    
    const result = Object.keys(CATEGORY_STYLES).reduce((acc, category) => {
      const categoryData = contentData[category] || {}
      acc.byCategory[category] = {
        completed: categoryData.completed?.length || 0,
        inProgress: categoryData.inProgress?.length || 0,
        planned: categoryData.planned?.length || 0,
        total: (categoryData.completed?.length || 0) + 
               (categoryData.inProgress?.length || 0) + 
               (categoryData.planned?.length || 0)
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
  const profileUrl = `${window.location.origin}/profile/${user?.id || 'user'}`
  const topCategoryData = stats.topCategory ? CATEGORY_STYLES[stats.topCategory] : null

  const downloadCard = () => {
    const cardElement = document.getElementById('ice-card')
    if (!cardElement) return
    
    toPng(cardElement, {
      quality: 1,
      pixelRatio: 2,
      style: {
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)'
      }
    })
      .then(dataUrl => {
        const link = document.createElement('a')
        link.download = `${user?.username || 'ice'}-card.png`
        link.href = dataUrl
        link.click()
      })
      .catch(err => {
        console.error('Download error:', err)
      })
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Sparkles className="h-12 w-12 text-purple-400 animate-spin" />
    </div>
  )

  if (!contentData) return (
    <div className="text-center mt-12">
      <p className="text-gray-400">Couldn't load your content data</p>
      <Button onClick={() => window.location.reload()} className="mt-4">
        Try Again
      </Button>
    </div>
  )

  const username = user?.username || 'MediaLover'
  const userImage = user?.imageUrl || ''

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Card Preview */}
        <div className="flex-1">
          <div 
            id="ice-card"
            className={`relative rounded-2xl overflow-hidden shadow-2xl ${CATEGORY_STYLES[selectedTheme].bg} border-2 ${CATEGORY_STYLES[selectedTheme].border}`}
          >
            <div className="p-6 text-white">
              {/* Header with avatar, username and QR code */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-white/80 shadow-lg">
                    <AvatarImage src={userImage} />
                    <AvatarFallback className="bg-white/20">
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">@{username}</h2>
                    {topCategoryData && (
                      <p className="text-sm flex items-center gap-1 mt-1">
                        <span className={`px-2 py-0.5 rounded-full ${topCategoryData.bg} border ${topCategoryData.border} text-xs`}>
                          {topCategoryData.tagline}
                        </span>
                        <span className="text-xs opacity-80">{stats.total} items tracked</span>
                        
                      </p>
                    )}
                   <Link href={`${profileUrl}`}> <Share2 className={`h-4 w-4 ${CATEGORY_STYLES[selectedTheme].accent} mt-1`} />
                    </Link>
                  </div>
                </div>
                
                <div 
                  ref={qrCodeRef}
                  className={`p-2 bg-white rounded ${CATEGORY_STYLES[selectedTheme].border} border-2`}
                >
                  <QRCode 
                    value={profileUrl}
                    size={qrCodeSize}
                    level="H"
                    fgColor={CATEGORY_STYLES[selectedTheme].border.replace('border-', '')}
                    bgColor="transparent"
                  />
                  
                </div>
                
              </div>

              {/* Description Box */}
              {topCategoryData && (
                <div className={`mb-6 p-4 rounded-lg ${topCategoryData.bg} border ${topCategoryData.border}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {topCategoryData.icon}
                    <h3 className="font-medium">{topCategoryData.name} Enthusiast</h3>
                    <span className="text-sm ml-auto bg-white/10 px-2 py-0.5 rounded">
                      {stats.byCategory[stats.topCategory]?.completed || 0} completed
                    </span>
                  </div>
                  {editMode ? (
                    <Textarea
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      className="bg-white/10 border-0 text-white w-full"
                    />
                  ) : (
                    <p className="text-white/80">{customDescription}</p>
                  )}
                </div>
              )}
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {Object.entries(stats.byCategory)
                  .filter(([_, stat]) => stat.total > 0)
                  .map(([category, stat]) => (
                    <div 
                      key={category}
                      className={`p-4 rounded-lg ${CATEGORY_STYLES[category].bg} border ${CATEGORY_STYLES[category].border}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {CATEGORY_STYLES[category].icon}
                          <span className="font-medium">{CATEGORY_STYLES[category].name}</span>
                        </div>
                        <span className="text-sm font-bold">{stat.total}</span>
                      </div>
                      
                      <div className="flex justify-between mt-3 text-xs">
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
                    </div>
                  ))}
              </div>
              
              {/* Footer CTA */}
              <div className={`p-4 text-center rounded-lg ${CATEGORY_STYLES[selectedTheme].bg} border ${CATEGORY_STYLES[selectedTheme].border}`}>
                <h4 className="font-medium text-xl mb-2">{CATEGORY_STYLES[selectedTheme].cta}</h4>
                <div className="flex items-center justify-center gap-2 text-lg">
                  <Snowflake className="h-3 w-3" />
                  <span>icebreaker-nine.vercel.app</span>
                  <Sparkles className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Customization Panel */}
        <div className="lg:w-80 space-y-6">
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Customize Your Card
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-lg font-medium text-blue-300 mb-2">I am a </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(CATEGORY_STYLES).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTheme(key)}
                      className={`p-3 rounded-lg border-2 text-purple-300 hover:text-white transition-all ${selectedTheme === key ? `${theme.border} ${theme.bg} scale-105` : 'border-gray-700 hover:border-gray-600'}`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`p-2 rounded-full ${theme.bg} border ${theme.border}`}>
                          {theme.icon}
                        </div>
                        <span className="text-xs">{theme.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-md font-medium text-blue-300 mb-2">Description</label>
                <Textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="bg-gray-800 border-gray-700 h-24 text-gray-200"
                  placeholder="Describe your media taste..."
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                {editMode ? (
                  <>
                    <Button 
                      onClick={() => setEditMode(false)}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700 flex-1"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={() => setEditMode(true)}
                      className="gap-2 flex-1 bg-purple-900 hover:bg-purple-950/90"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={downloadCard}
                      className="gap-2"
                    >
                      Download
                      <Download className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Stats Summary */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 text-gray-200">
            <h3 className="font-medium text-blue-300 mb-3">Your Totals</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Items</span>
                <span className="font-bold text-purple-300">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Estimated Hours</span>
                <span className="font-bold text-purple-300">{Math.floor(stats.total * 3.7)} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Categories</span>
                <span className="font-bold text-purple-300">
                  {Object.keys(stats.byCategory).filter(c => stats.byCategory[c].total > 0).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
