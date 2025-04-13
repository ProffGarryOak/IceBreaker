'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Download, RefreshCw, AlertCircle, List, Clock, CheckCircle, X, Play, Check, Plus, Film, Tv2, BookOpen, Headphones, Gamepad2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { motion } from 'framer-motion'

const contentCategories = [
  { id: 'movies', name: 'Movies', icon: <Film className="h-4 w-4" /> },
  { id: 'shows', name: 'TV Shows', icon: <Tv2 className="h-4 w-4" /> },
  { id: 'anime', name: 'Anime', icon: <Eye className="h-4 w-4" /> },
  { id: 'books', name: 'Books', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'music', name: 'Music', icon: <Headphones className="h-4 w-4" /> },
  { id: 'games', name: 'Games', icon: <Gamepad2 className="h-4 w-4" /> }
]

const statusOptions = [
  { id: 'planned', name: 'Watch Later', icon: <Plus className="h-4 w-4" />, color: 'bg-blue-500/20' },
  { id: 'inProgress', name: 'Watching', icon: <Play className="h-4 w-4" />, color: 'bg-yellow-500/20' },
  { id: 'completed', name: 'Watched', icon: <Check className="h-4 w-4" />, color: 'bg-green-500/20' }
]

export default function DashboardPage() {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('movies')
  const [activeStatus, setActiveStatus] = useState('planned')

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/content/get')
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      setContent(data)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

 // Updated move and remove functions in your dashboard component
 const moveContentItem = async (itemId, newStatus) => {
  try {
    // Find the item being moved
    const itemToMove = content[activeCategory][activeStatus].find(item => item.id === itemId);
    if (!itemToMove) {
      throw new Error('Item not found in current list');
    }

    // Optimistic UI update first
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev)); // Deep clone
      
      // Remove from current list
      newContent[activeCategory][activeStatus] = 
        newContent[activeCategory][activeStatus].filter(item => item.id !== itemId);
      
      // Add to new list if not already present
      if (!newContent[activeCategory][newStatus].some(item => item.id === itemId)) {
        newContent[activeCategory][newStatus].push(itemToMove);
      }
      
      return newContent;
    });

    // API call
    const res = await fetch('/api/content/move', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: activeCategory,
        fromList: activeStatus,
        toList: newStatus,
        itemId
      })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Failed to move item');
    }
    
  } catch (err) {
    console.error('Move error:', err);
    setError(err.message);
    // Revert optimistic update by refreshing data
    fetchContent();
  }
}

const removeContentItem = async (itemId) => {
  try {
    const res = await fetch('/api/content/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: activeCategory,
        list: activeStatus,
        itemId
      })
    })
    
    const data = await res.json()
    
    if (!res.ok) {
      throw new Error(data.error || 'Failed to remove item')
    }
    
    // Optimistic UI update
    setContent(prev => {
      const newContent = {...prev}
      newContent[activeCategory][activeStatus] = 
        newContent[activeCategory][activeStatus].filter(item => item.id !== itemId)
      return newContent
    })
    
  } catch (err) {
    console.error('Remove error:', err)
    setError(err.message)
    // Revert optimistic update
    fetchContent()
  }
}

  useEffect(() => {
    fetchContent()
  }, [])

  const calculateCategoryStats = () => {
    if (!content) return {}
    const stats = {}
    
    contentCategories.forEach(category => {
      if (!content[category.id]) return
      
      stats[category.id] = {
        planned: content[category.id]?.planned?.length || 0,
        inProgress: content[category.id]?.inProgress?.length || 0,
        completed: content[category.id]?.completed?.length || 0,
        total: (content[category.id]?.planned?.length || 0) + 
               (content[category.id]?.inProgress?.length || 0) + 
               (content[category.id]?.completed?.length || 0)
      }
    })
    
    return stats
  }

  const categoryStats = calculateCategoryStats()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Dashboard</h1>
          <p className="text-gray-400">Manage your watchlist and collections</p>
        </div>
        <Button onClick={fetchContent} disabled={loading} className="gap-2">
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh Data
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">
        <DashboardStat 
          title="Total Items" 
          value={calculateTotalItems(content)} 
          icon={<List className="h-5 w-5" />} 
          loading={loading} 
        />
        
        <DashboardStat 
          title="Status" 
          value={error ? 'Error' : (content ? 'Success' : '--')} 
          icon={error ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />} 
          loading={loading} 
          status={error ? 'error' : 'success'} 
        />
      </div>
      {/* Category Tabs */}
      <Tabs defaultValue="movies" className="mb-6">
        <ScrollArea className="w-full pb-2" orientation="horizontal">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800">
            {contentCategories.map((category) => (
              <TabsTrigger 
                key={category.id}
                value={category.id}
                onClick={() => setActiveCategory(category.id)}
                className="flex gap-2 items-center capitalize"
              >
                {category.icon}
                <span>{category.name}</span>
                <Badge variant="secondary" className="ml-1">
                  {categoryStats[category.id]?.total || 0}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
      </Tabs>

      {/* Status Toggle */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {statusOptions.map((status) => (
          <Button
            key={status.id}
            variant={activeStatus === status.id ? 'default' : 'outline'}
            onClick={() => setActiveStatus(status.id)}
            className={`flex-1 md:flex-none gap-2 ${activeStatus === status.id ? status.color : ''}`}
          >
            {status.icon}
            {status.name}
            <Badge variant="secondary" className="ml-1">
              {categoryStats[activeCategory]?.[status.id] || 0}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Content Cards */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="text-blue-400" />
              <CardTitle className="text-white">
                {contentCategories.find(c => c.id === activeCategory)?.name} -{' '}
                {statusOptions.find(s => s.id === activeStatus)?.name}
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-blue-400 text-blue-400">
                {categoryStats[activeCategory]?.planned || 0} Planned
              </Badge>
              <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                {categoryStats[activeCategory]?.inProgress || 0} Watching
              </Badge>
              <Badge variant="outline" className="border-green-400 text-green-400">
                {categoryStats[activeCategory]?.completed || 0} Watched
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full bg-gray-700 rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p>Error fetching content: {error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {content?.[activeCategory]?.[activeStatus]?.length > 0 ? (
                content[activeCategory][activeStatus].map((item) => (
                  <motion.div 
                    key={item.id || item.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative group"
                  >
                    <Card className="h-full bg-gray-900 border-gray-700 hover:border-blue-400 transition-colors">
                      <CardContent className="p-0">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                          <img 
                            src={item.image || '/placeholder-media.jpg'} 
                            alt={item.title || 'Media image'} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <div className="flex gap-2">
                              {statusOptions
                                .filter(s => s.id !== activeStatus)
                                .map(status => (
                                  <Tooltip key={status.id}>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        size="icon" 
                                        variant="outline" 
                                        className="w-8 h-8"
                                        onClick={() => moveContentItem(item.id, status.id)}
                                      >
                                        {status.icon}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Move to {status.name}
                                    </TooltipContent>
                                  </Tooltip>
                                ))}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="icon" 
                                    variant="destructive" 
                                    className="w-8 h-8"
                                    onClick={() => removeContentItem(item.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Remove from collection
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-white font-semibold truncate">{item.title || 'Untitled'}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-400 line-clamp-2 mt-1">{item.description}</p>
                          )}
                          {item.tag && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                {item.tag}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <List className="h-12 w-12 mb-4" />
                  <p className="text-lg">No items in this category</p>
                  <p className="text-sm">Add some content to get started</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Overview */}
      
    </div>
  )
}

function DashboardStat({ title, value, icon, loading, status = 'normal' }) {
  const statusColors = {
    normal: 'bg-gray-800',
    success: 'bg-green-900/50',
    error: 'bg-red-900/50'
  }

  return (
    <Card className={`${statusColors[status]} border-gray-700`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
          <div className="text-gray-400">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-3/4 bg-gray-700" />
        ) : (
          <h3 className={`text-2xl font-bold ${
            status === 'error' ? 'text-red-400' : 
            status === 'success' ? 'text-green-400' : 'text-white'
          }`}>
            {value}
          </h3>
        )}
      </CardContent>
    </Card>
  )
}

function calculateTotalItems(content) {
  if (!content || typeof content !== 'object') return '--'
  let total = 0
  Object.keys(content).forEach(key => {
    if (['_id', 'userId', '__v'].includes(key)) return
    const category = content[key]
    Object.values(category).forEach(statusArr => {
      total += Array.isArray(statusArr) ? statusArr.length : 0
    })
  })
  return total
}