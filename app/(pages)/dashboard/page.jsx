"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RefreshCw,
  AlertCircle,
  List,
  CheckCircle,
  X,
  Play,
  Check,
  Plus,
  Film,
  Tv2,
  BookOpen,
  Headphones,
  Gamepad2,
  Eye,
  User as UserIcon,
  Snowflake,
  PersonStanding,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import Link from "next/link";

const contentCategories = [
  {
    id: "movies",
    name: "Movies",
    icon: <Film className="h-5 w-5" />,
    color:
      "bg-amber-500/20 border-amber-500 text-amber-500 hover:bg-amber-500/30",
  },
  {
    id: "shows",
    name: "TV Shows",
    icon: <Tv2 className="h-5 w-5" />,
    color: "bg-cyan-500/20 border-cyan-500 text-cyan-500 hover:bg-cyan-500/30",
  },
  {
    id: "anime",
    name: "Anime",
    icon: <Eye className="h-5 w-5" />,
    color:
      "bg-emerald-500/20 border-emerald-500 text-emerald-500 hover:bg-emerald-500/30",
  },
  {
    id: "books",
    name: "Books",
    icon: <BookOpen className="h-5 w-5" />,
    color:
      "bg-amber-600/20 border-amber-600 text-amber-600 hover:bg-amber-600/30",
  },
  {
    id: "songs",
    name: "Songs",
    icon: <Headphones className="h-5 w-5" />,
    color:
      "bg-purple-500/20 border-purple-500 text-purple-500 hover:bg-purple-500/30",
  },
  {
    id: "games",
    name: "Games",
    icon: <Gamepad2 className="h-5 w-5" />,
    color: "bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30",
  },
];

const statusOptions = [
  {
    id: "planned",
    name: "Watch Later",
    icon: <Plus className="h-5 w-5" />,
    color: "bg-blue-700/20 border-blue-700 text-blue-700 hover:bg-blue-700/30",
  },
  {
    id: "inProgress",
    name: "Watching",
    icon: <Play className="h-5 w-5" />,
    color: "bg-rose-700/20 border-rose-700 text-rose-700 hover:bg-rose-700/30",
  },
  {
    id: "completed",
    name: "Watched",
    icon: <Check className="h-5 w-5" />,
    color:
      "bg-emerald-700/20 border-emerald-700 text-emerald-700 hover:bg-emerald-700/30",
  },
];

export default function DashboardPage() {
  const { user } = useUser();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("movies");
  const [activeStatus, setActiveStatus] = useState("planned");

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/content/get");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setContent(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const moveContentItem = async (itemId, newStatus) => {
    try {
      const itemToMove = content[activeCategory][activeStatus].find(
        (item) => item.id === itemId
      );
      if (!itemToMove) throw new Error("Item not found");

      setContent((prev) => {
        const newContent = JSON.parse(JSON.stringify(prev));
        newContent[activeCategory][activeStatus] = newContent[activeCategory][
          activeStatus
        ].filter((item) => item.id !== itemId);
        newContent[activeCategory][newStatus].push(itemToMove);
        return newContent;
      });

      const res = await fetch("/api/content/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: activeCategory,
          fromList: activeStatus,
          toList: newStatus,
          itemId,
        }),
      });

      if (!res.ok) throw new Error("Failed to move item");
    } catch (err) {
      console.error("Move error:", err);
      setError(err.message);
      fetchContent();
    }
  };

  const removeContentItem = async (itemId) => {
    try {
      setContent((prev) => {
        const newContent = { ...prev };
        newContent[activeCategory][activeStatus] = newContent[activeCategory][
          activeStatus
        ].filter((item) => item.id !== itemId);
        return newContent;
      });

      const res = await fetch("/api/content/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: activeCategory,
          list: activeStatus,
          itemId,
        }),
      });

      if (!res.ok) throw new Error("Failed to remove item");
    } catch (err) {
      console.error("Remove error:", err);
      setError(err.message);
      fetchContent();
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const calculateCategoryStats = () => {
    if (!content) return {};
    const stats = {};

    contentCategories.forEach((category) => {
      if (!content[category.id]) return;

      stats[category.id] = {
        planned: content[category.id]?.planned?.length || 0,
        inProgress: content[category.id]?.inProgress?.length || 0,
        completed: content[category.id]?.completed?.length || 0,
        total:
          (content[category.id]?.planned?.length || 0) +
          (content[category.id]?.inProgress?.length || 0) +
          (content[category.id]?.completed?.length || 0),
      };
    });

    return stats;
  };

  const categoryStats = calculateCategoryStats();
  const activeCategoryData = contentCategories.find(
    (c) => c.id === activeCategory
  );
  const activeStatusData = statusOptions.find((s) => s.id === activeStatus);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Hello, {user?.firstName || "User"}!
          </h1>
          <p className="text-gray-400">Manage your watchlist and collections</p>
        </div>

        <div className="flex gap-3">
          <Link href="/card">
            <Button
              variant="outline"
              className="gap-2 bg-blue-600/10 hover:bg-blue-600/20 hover:text-blue-600/50 border-blue-400 text-blue-400"
            >
              <Snowflake className="h-5 w-5" />
              View Your IceCard
            </Button>
          </Link>
          <Link href={`/profile/${user?.id}`}>

            <Button
              variant="outline"
              className="gap-2 bg-rose-600/10 hover:bg-rose-600/20 hover:text-rose-500/50 border-rose-400 text-rose-400"
            >
              <PersonStanding className="h-5 w-5"/>
              View Your Public Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <DashboardStat
          title="Total Items"
          value={calculateTotalItems(content)}
          icon={<List className="h-5 w-5" />}
          loading={loading}
        />

        <DashboardStat
          title="Active Category"
          value={activeCategoryData?.name || "--"}
          icon={activeCategoryData?.icon || <List className="h-5 w-5" />}
          loading={loading}
        />

        <DashboardStat
          title="Current Status"
          value={activeStatusData?.name || "--"}
          icon={activeStatusData?.icon || <List className="h-5 w-5" />}
          loading={loading}
        />

        <DashboardStat
          title="Status"
          value={error ? "Error" : content ? "Success" : "--"}
          icon={
            error ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )
          }
          loading={loading}
          status={error ? "error" : "success"}
        />
      </div>

      <div className="mb-6">
  {/* Category Tabs - Horizontal Scrollable */}
  <div className="w-full pb-2" >
    <Tabs defaultValue="movies">
    <TabsList className="flex w-max bg-transparent  gap-2 p-1">
        {contentCategories.map((category) => {
          const isActive = activeCategory === category.id;
          const activeColorClass = category.color.split(' ')[0]; // Get the bg-color class
          const textColorClass = category.color.split(' ')[2]; // Get the text-color class
          
          return (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <TabsTrigger
                value={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`relative flex items-center gap-2 px-10 py-2 rounded-xl transition-all ${
                  isActive 
                    ? `${activeColorClass} border-2 ${textColorClass.replace('text-', 'border-')} shadow-lg`
                    : "bg-gray-800/50 hover:bg-gray-700/50"
                }`}
              >
                {/* Animated underline for active tab */}
                {isActive && (
                  <motion.div 
                    className={`absolute bottom-0 left-0 right-0 h-1 ${activeColorClass}`}
                    layoutId="activeCategoryUnderline"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div className={`p-2 rounded-md ${
                  isActive ? "bg-black/30" : "bg-black/20"
                }`}>
                  {React.cloneElement(category.icon, {
                    className: `h-5 w-5 ${isActive ? textColorClass : 'text-gray-400'}`
                  })}
                </div>
                <span className={`font-medium ${
                  isActive ? textColorClass : 'text-gray-300'
                }`}>
                  {category.name}
                </span>
                <Badge
                  variant="secondary"
                  className={`ml-1 ${
                    isActive 
                      ? 'bg-black/20 text-white' 
                      : 'bg-gray-700/50 text-gray-300'
                  }`}
                >
                  {categoryStats[category.id]?.total || 0}
                </Badge>
              </TabsTrigger>
            </motion.div>
          );
        })}
      </TabsList>
    </Tabs>
  </div>

  {/* Status Filters - Full Width Grid */}
  <div className="grid grid-cols-3 gap-2 mt-4">
    {statusOptions.map((status) => {
      const isActive = activeStatus === status.id;
      const activeColorClass = status.color.split(' ')[0]; // Get the bg-color class
      const textColorClass = status.color.split(' ')[2]; // Get the text-color class
      
      return (
        <motion.button
          key={status.id}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveStatus(status.id)}
          className={`relative flex items-center justify-between p-3 rounded-xl transition-all overflow-hidden ${
            isActive
              ? `${activeColorClass} border-2 ${textColorClass.replace('text-', 'border-')} shadow-lg`
              : "bg-gray-800/50 hover:bg-gray-700/50"
          }`}
        >
          {/* Animated background pulse for active status */}
          {isActive && (
            <motion.div 
              className={`absolute inset-0 ${activeColorClass} opacity-20`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 0.3 }}
            />
          )}
          
          <div className="flex items-center gap-3 z-10">
            <div className={`p-2 rounded-lg ${
              isActive ? "bg-black/30" : "bg-black/20"
            }`}>
              {React.cloneElement(status.icon, {
                className: `h-5 w-5 ${isActive ? textColorClass : 'text-gray-400'}`
              })}
            </div>
            <span className={`font-medium ${
              isActive ? textColorClass : 'text-gray-300'
            }`}>
              {status.name}
            </span>
          </div>
          <Badge
            variant="secondary"
            className={`z-10 ${
              isActive
                ? 'bg-black/20 text-white'
                : 'bg-gray-700/50 text-gray-300'
            }`}
          >
            {categoryStats[activeCategory]?.[status.id] || 0}
          </Badge>
        </motion.button>
      );
    })}
  </div>
</div>

      {/* Content Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${activeCategoryData?.color}`}>
                {activeCategoryData?.icon}
              </div>
              <CardTitle className="text-white">
                {activeCategoryData?.name} - {activeStatusData?.name}
              </CardTitle>
            </div>

            <div className="flex gap-2">
              <Link href={`/${activeCategory}`}>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add {activeCategoryData?.name}
                </Button>
              </Link>

              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className="border-blue-700 text-blue-700"
                >
                  {categoryStats[activeCategory]?.planned || 0} Planned
                </Badge>
                <Badge
                  variant="outline"
                  className="border-rose-700 text-rose-700"
                >
                  {categoryStats[activeCategory]?.inProgress || 0} Watching
                </Badge>
                <Badge
                  variant="outline"
                  className="border-green-700 text-green-700"
                >
                  {categoryStats[activeCategory]?.completed || 0} Watched
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-64 w-full bg-gray-700 rounded-lg"
                />
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
                    <Card className="h-full bg-gray-900 border-gray-700 hover:border-blue-400 transition-colors overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative aspect-[2/3] overflow-hidden">
                          <img
                            src={item.image || "/placeholder-media.jpg"}
                            alt={item.title || "Media image"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <div className="flex gap-2">
                              {statusOptions
                                .filter((s) => s.id !== activeStatus)
                                .map((status) => (
                                  <Tooltip key={status.id}>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        className="w-8 h-8"
                                        onClick={() =>
                                          moveContentItem(item.id, status.id)
                                        }
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
                          <h3 className="text-white font-semibold truncate">
                            {item.title || "Untitled"}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                              {item.description}
                            </p>
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
                  <Link href={`/${activeCategory}`}>
                    <Button variant="outline" className="mt-4 gap-2">
                      <Plus className="h-4 w-4" />
                      Add {activeCategoryData?.name}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardStat({ title, value, icon, loading, status = "normal" }) {
  const statusColors = {
    normal: "bg-gray-800 border-gray-700",
    success: "bg-green-900/50 border-green-800",
    error: "bg-red-900/50 border-red-800",
  };

  return (
    <Card
      className={`${statusColors[status]} transition-all hover:scale-[1.02]`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-400">
            {title}
          </CardTitle>
          <div className="text-gray-400">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-3/4 bg-gray-700" />
        ) : (
          <h3
            className={`text-2xl font-bold ${
              status === "error"
                ? "text-red-400"
                : status === "success"
                ? "text-green-400"
                : "text-white"
            }`}
          >
            {value}
          </h3>
        )}
      </CardContent>
    </Card>
  );
}

function calculateTotalItems(content) {
  if (!content || typeof content !== "object") return "--";
  let total = 0;
  Object.keys(content).forEach((key) => {
    if (["_id", "userId", "__v"].includes(key)) return;
    const category = content[key];
    Object.values(category).forEach((statusArr) => {
      total += Array.isArray(statusArr) ? statusArr.length : 0;
    });
  });
  return total;
}
