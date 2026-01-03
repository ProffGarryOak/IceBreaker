"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import {
  Users,
  Flame,
  Search,
  Heart,
  Film,
  Tv2,
  Eye,
  BookOpen,
  Headphones,
  Gamepad2,
  Sparkles,
  Zap,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";

const CATEGORY_ICONS = {
  movies: <Film className="h-4 w-4" />,
  shows: <Tv2 className="h-4 w-4" />,
  anime: <Eye className="h-4 w-4" />,
  books: <BookOpen className="h-4 w-4" />,
  songs: <Headphones className="h-4 w-4" />,
  games: <Gamepad2 className="h-4 w-4" />,
};

const CATEGORY_COLORS = {
  movies: "text-amber-400 border-amber-400 bg-amber-400/10",
  shows: "text-cyan-400 border-cyan-400 bg-cyan-400/10",
  anime: "text-emerald-400 border-emerald-400 bg-emerald-400/10",
  books: "text-amber-600 border-amber-600 bg-amber-600/10",
  songs: "text-purple-400 border-purple-400 bg-purple-400/10",
  games: "text-red-400 border-red-400 bg-red-400/10",
};

export default function CommunityPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("trending");
  const [users, setUsers] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, trendingRes] = await Promise.all([
          fetch("/api/community/users"),
          fetch("/api/community/trending"),
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }

        if (trendingRes.ok) {
          const trendingData = await trendingRes.json();
          setTrending(trendingData);
        }
      } catch (error) {
        console.error("Failed to fetch community data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpvote = async (item) => {
    // Optimistic update
    setTrending((prev) =>
      prev.map((t) => {
        if (t.title === item.title && t.category === item.category) {
          const isUpvoted = t.upvotedBy?.includes(user?.id);
          return {
            ...t,
            upvotes: isUpvoted ? t.upvotes - 1 : t.upvotes + 1,
            upvotedBy: isUpvoted
              ? t.upvotedBy.filter((id) => id !== user?.id)
              : [...(t.upvotedBy || []), user?.id],
          };
        }
        return t;
      })
    );

    try {
      await fetch("/api/community/trending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: item.title, category: item.category }),
      });
    } catch (err) {
      console.error("Upvote failed:", err);
      // Revert could be implemented here
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrending = trending.filter((t) =>
    t.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-400" />
            Community Nexus
          </h1>
          <p className="text-gray-400">
            Discover collectors and what's trending
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            className="pl-9 bg-gray-900 border-gray-700 text-white"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue="trending"
        className="space-y-8"
        onValueChange={setActiveTab}
      >
        <TabsList className="bg-gray-800/50 p-1 border border-gray-700">
          <TabsTrigger
            value="explorers"
            className="gap-2 data-[state=active]:bg-blue-600  text-white"
          >
            <Sparkles className="h-4 w-4" />
            Explorers
          </TabsTrigger>
          <TabsTrigger
            value="trending"
            className="gap-2 data-[state=active]:bg-rose-600 text-white"
          >
            <Flame className="h-4 w-4" />
            Zeitgeist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="explorers">
          {loading ? (
            <div className="flex justify-center py-20">
              <Sparkles className="h-8 w-8 text-blue-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((profile, i) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-colors group">
                    <CardContent className="p-6 flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-gray-700 group-hover:border-blue-400 transition-colors">
                        <AvatarImage src={profile.imageUrl} />
                        <AvatarFallback className="bg-gray-800 text-gray-400">
                          {profile.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                          {profile.username}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${
                              CATEGORY_COLORS[profile.topCategory]
                            }`}
                          >
                            {CATEGORY_ICONS[profile.topCategory]}
                            <span className="ml-1">
                              {profile.topCategory} Main
                            </span>
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {profile.totalItems} Items
                          </span>
                        </div>
                      </div>

                      <Link href={`/profile/${profile.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-gray-600"
                        >
                          Visit
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending">
          {loading ? (
            <div className="flex justify-center py-20">
              <Flame className="h-8 w-8 text-rose-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrending.map((item, i) => (
                <motion.div
                  key={`${item.category}-${item.title}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  layoutId={`${item.category}-${item.title}`}
                >
                  <div className="relative group rounded-xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-600 transition-all">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={item.image || "/placeholder-media.jpg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2">
                        <div
                          className={`p-2 rounded-lg backdrop-blur-md ${CATEGORY_COLORS[
                            item.category
                          ].replace("text-", "bg-black/50 text-")}`}
                        >
                          {CATEGORY_ICONS[item.category]}
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                        <h3 className="font-bold text-white text-lg truncate">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div
                          className="flex items-center gap-1"
                          title="Users collected"
                        >
                          <Users className="h-4 w-4" />
                          <span>{item.watchCount}</span>
                        </div>
                        <div
                          className="flex items-center gap-1 text-rose-400"
                          title="Community Upvotes"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                          <span>{item.upvotes}</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUpvote(item)}
                        className={`gap-2 ${
                          item.upvotedBy?.includes(user?.id)
                            ? "text-rose-500 bg-rose-500/10 hover:bg-rose-500/20"
                            : "text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            item.upvotedBy?.includes(user?.id)
                              ? "fill-current"
                              : ""
                          }`}
                        />
                        {item.upvotedBy?.includes(user?.id) ? "Liked" : "Like"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
