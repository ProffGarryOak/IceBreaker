"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  BookOpen,
  Clapperboard,
  Gamepad2,
  Headphones,
  Music,
  Snowflake,
  ChevronRight,
  Star,
  Tv2,
  Users,
  Sparkles,
  MessageSquare,
  Heart,
  Share2,
  TrendingUp,
  Clock,
  Plus,
  Film,
  Gem,
  Zap,
  Goal,
  Eye,
  JapaneseYen,
  Search,
  BarChart2,
  Award,
  Calendar,
  Clock4,
  Compass,
  ThumbsUp,
  Rocket,
  Palette,
  Globe,
  Bookmark,
  Bell,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";

// 3D Card Effect Component with enhanced interaction
const ContentCard = ({ icon, title, route, bgColor, hoverEffect = true }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -10, scale: 1.03 } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 300 }}
      className={`p-6 rounded-2xl border ${bgColor} shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden`}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white"
          />
        )}
      </AnimatePresence>
      <Link
        href={route}
        className="flex flex-col items-center text-center relative z-10"
      >
        <motion.div
          animate={{
            scale: isHovered ? [1, 1.1, 1] : 1,
            rotate: isHovered ? [0, 5, -5, 0] : 0,
          }}
          transition={{ duration: 0.6 }}
          className="p-4 bg-white/20 rounded-full mb-4"
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </Link>
    </motion.div>
  );
};

// Trending item component with parallax effect
const TrendingItem = ({ item, index }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onMouseMove={handleMouseMove}
      className="bg-gray-800/70 border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500 transition-all relative group"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(167, 139, 250, 0.15), transparent 80%)`,
        }}
      />
      <Link href={`/${item.category}`}>
        <div className="h-10 bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
          <span className="text-4xl font-bold opacity-20">{index + 1}</span>
        </div>
        <div className="p-4">
          <div className="relative h-40 w-full mb-3 rounded-lg overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="font-bold text-lg">{item.title}</h3>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
            <span className="capitalize bg-purple-900 py-0 px-4 rounded-2xl text-white">
              {item.category}
            </span>
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" /> {item.fans.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Interactive stats component
const StatCard = ({ icon, value, label, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`bg-gradient-to-br ${color} p-6 rounded-xl shadow-lg flex items-center gap-4`}
  >
    <div className="p-3 bg-white/20 rounded-full">{icon}</div>
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  </motion.div>
);

// Testimonial component
const Testimonial = ({ quote, author, role, avatar }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg"
  >
    <div className="flex items-start gap-4 mb-4">
      <Avatar className="h-12 w-12 border-2 border-purple-500">
        <AvatarImage src={avatar} />
        <AvatarFallback>{author.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-bold">{author}</div>
        <div className="text-sm text-purple-300">{role}</div>
      </div>
    </div>
    <p className="italic">"{quote}"</p>
    <div className="flex gap-1 mt-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  </motion.div>
);

export default function Landing() {
  // All Content Routes with Icons & Colors
  const contentRoutes = [
    {
      icon: <Film className="h-8 w-8" />,
      title: "Movies",
      route: "/movies",
      bgColor: "bg-gradient-to-r from-amber-400 to-amber-600 border-0",
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Anime",
      route: "/anime",
      bgColor: "bg-gradient-to-r from-emerald-300 to-emerald-700 border-0",
    },
    {
      icon: <Tv2 className="h-8 w-8" />,
      title: "TV Shows",
      route: "/shows",
      bgColor: "bg-gradient-to-r from-cyan-300 to-cyan-700 border-0",
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Music",
      route: "/songs",
      bgColor: "bg-gradient-to-r from-purple-400 to-purple-600 border-0",
    },
    {
      icon: <Gamepad2 className="h-8 w-8" />,
      title: "Games",
      route: "/games",
      bgColor: "bg-gradient-to-r from-red-400 to-red-600 border-0",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Books",
      route: "/books",
      bgColor: "bg-gradient-to-r from-amber-600 to-amber-800 border-0",
    },
  ];

  // Trending Now (Mock Data)
  const trendingNow = [
    {
      title: "Dune: Part Two",
      category: "movies",
      fans: 1250,
      image: "/dune.png",
    },
    {
      title: "Chainsaw Man",
      category: "anime",
      fans: 980,
      image: "/chain.png",
    },
    {
      title: "3 Body Problem",
      category: "shows",
      fans: 750,
      image: "/3bd.png",
    },
    {
      title: "Project Hail Mary",
      category: "books",
      fans: 620,
      image: "/proj.png",
    },
  ];

  // Upcoming releases
  const upcomingReleases = [
    {
      title: "Interstellar",
      date: "Nov 07, 2014",
      category: "movies",
      image: "/inter.png",
    },
    {
      title: "Max Payne",
      date: "Jul 23, 2001",
      category: "games",
      image: "/maxp.png",
    },
    {
      title: "Silicon valley",
      date: "Apr 06, 2014",
      category: "shows",
      image: "/silicon.png",
    },
    {
      title: "Demon Slayer: Infinity Castle Arc",
      date: "Fall 2025",
      category: "anime",
      image: "/demon.png",
    },
  ];

  // Community stats
  const stats = [
    {
      icon: <Users className="h-6 w-6" />,
      value: "1.2M+",
      label: "Active Users",
      color: "from-purple-600 to-blue-600",
    },
    {
      icon: <Bookmark className="h-6 w-6" />,
      value: "8.7M",
      label: "Items Tracked",
      color: "from-amber-500 to-amber-700",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      value: "4.3M",
      label: "Reviews",
      color: "from-emerald-500 to-emerald-700",
    },
    {
      icon: <ThumbsUp className="h-6 w-6" />,
      value: "28M",
      label: "Likes",
      color: "from-red-500 to-pink-600",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      quote:
        "Finally found my people! The community features are incredible for connecting over niche interests.",
      author: "Alex Chen",
      role: "Anime Enthusiast",
      avatar: "/avatar1.jpg",
    },
    {
      quote:
        "As a film student, the tracking and analysis tools have been invaluable for my studies.",
      author: "Maria Rodriguez",
      role: "Film Student",
      avatar: "/avatar2.jpg",
    },
    {
      quote:
        "The Ice Cards feature helped me triple my book club membership in just two months!",
      author: "James Wilson",
      role: "Book Club Founder",
      avatar: "/avatar3.jpg",
    },
  ];

  // Rotating tagline
  const taglines = [
    "Track your obsessions",
    "Discover hidden gems",
    "Connect with fans",
    "Share your passion",
  ];
  const [currentTagline, setCurrentTagline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-x-hidden">
      {/* ✨ Floating Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => {
          const size = Math.random() * 100 + 50;
          const delay = Math.random() * 5;
          const duration = Math.random() * 15 + 10;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: size,
                height: size,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 0.1,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                delay,
                duration,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          );
        })}
      </div>

      {/* 🚀 Hero Section */}
      <SignedOut>
        <section className="relative py-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left side - Content */}
            <div className="md:w-1/2 space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 leading-tight"
              >
                Unlock Your Content Universe <br />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentTagline}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="block text-2xl md:text-4xl font-normal bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300 mt-4"
                  >
                    {taglines[currentTagline]}
                  </motion.span>
                </AnimatePresence>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300 max-w-3xl"
              >
                Track, share, and obsess over movies, anime, books, and
                more—with friends who{" "}
                <span className="text-purple-300 font-medium">actually</span>{" "}
                get it.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <SignedOut>
                  <SignUpButton>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-purple-500/30 transition-all group text-lg"
                    >
                      <span className="transition-transform">Get Started</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </SignUpButton>
                </SignedOut>

                <SignedIn>
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-6000 shadow-lg hover:shadow-purple-500/30 transition-all group text-lg"
                  >
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <span className="transition-transform">
                        Go to Dashboard
                      </span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </SignedIn>

                <Button
                  asChild
                  size="lg"
                  className="bg-gray-600/30 hover:bg-gray-700/20 transition-all group text-lg"
                >
                  <Link href="/about" className="flex items-center gap-2">
                    <span>Know More</span>
                    <TrendingUp className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Right side - Logo */}
            <div className="md:w-1/2 pt-20 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="max-w-md w-full"
              >
                <div className="relative w-[600px] h-[600px]">
                  {" "}
                  {/* adjust as needed */}
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </SignedOut>
      <SignedIn>
        <section className="relative py-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left side - Content */}
            <div className="md:w-1/2 space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 leading-tight"
              >
                Welcome Your Content Universe <br />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentTagline}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="block text-2xl md:text-4xl font-normal bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300 mt-4"
                  >
                    {taglines[currentTagline]}
                  </motion.span>
                </AnimatePresence>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300 max-w-3xl"
              >
                Track, share, and obsess over movies, anime, books, and
                more—with friends who{" "}
                <span className="text-purple-300 font-medium">actually</span>{" "}
                get it.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <SignedOut>
                  <SignUpButton>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-purple-500/30 transition-all group text-lg p-2"
                    >
                      <span className="transition-transform">Get Started</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </SignUpButton>
                </SignedOut>

                <SignedIn>
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-6000 shadow-lg hover:shadow-purple-500/30 transition-all group p-2 text-lg"
                  >
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <span className="transition-transform">
                        Go to Dashboard
                      </span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </SignedIn>

                <Button
                  asChild
                  size="lg"
                  className="bg-gray-600/30 hover:bg-gray-700/20 transition-all group text-lg"
                >
                  <Link href="/about" className="flex items-center gap-2">
                    <span>Know More</span>
                    <TrendingUp className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Right side - Logo */}
            <div className="md:w-1/2 flex pt-20 justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="max-w-md w-full"
              >
                <div className="relative w-[600px] h-[600px]">
                  {" "}
                  {/* adjust as needed */}
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </SignedIn>

      {/* 🌟 Featured Stats */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              color={stat.color}
            />
          ))}
        </div>
      </section>

      {/* 🌌 Content Galaxy (All Routes Grid) */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10"
        id="content"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Explore Your World</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Track anything, from blockbuster movies to underground anime gems.
            Your passions, all in one place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentRoutes.map((item, index) => (
            <ContentCard
              key={index}
              icon={item.icon}
              title={item.title}
              route={item.route}
              bgColor={item.bgColor}
            />
          ))}
        </div>
      </section>

      {/* 🔥 Trending Now Section */}
      <section
        className="py-16 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm"
        id="explore"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold">Trending Now</h2>
              <p className="text-gray-400">
                The community is obsessed with these right now
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingNow.map((item, index) => (
              <TrendingItem key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 🗓️ Coming Soon Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold">Top Picks</h2>
            <p className="text-gray-400">Our top picks for you to watch</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingReleases.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-gray-800/70 border border-gray-700 rounded-xl overflow-hidden hover:border-cyan-500 transition-all"
            >
              <Link href={`/${item.category}`}>
                <div className="relative h-40 w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <Clock4 className="h-4 w-4 mr-2 text-cyan-400" />
                    <span className="text-sm text-cyan-400">{item.date}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                    <span className="capitalize bg-cyan-900 py-0 px-4 rounded-2xl text-white">
                      {item.category}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900"
                    >
                      <ChevronsRight className="h-4 w-4 mr-2" /> See more
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🎮 Interactive Ice Cards Preview */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        id="card"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Your Personality, As a Card</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ice Cards are shareable profiles that show off your tastes in
            seconds.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Sample Ice Card */}
          <motion.div
            whileHover={{ rotate: -2 }}
            className=" bg-red-950/30 rounded-2xl p-2 w-full max-w-xl shadow-xl border border-white/10 relative overflow-hidden"
          >
            <Image
              src="/card.png"
              alt="Demon Image"
              width={700}
              height={700}
              className="rounded-lg"
            />
          </motion.div>

          <div className="space-y-6 max-w-md">
            <h3 className="text-2xl font-bold">Share Your Obsessions</h3>
            <p className="text-gray-300">
              Ice Cards auto-update with your activity. Drop them in social
              bios, dating profiles, or forums to find your people.
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span>Auto-updates with your activity</span>
              </li>
              <li className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-purple-400" />
                <span>One-click sharing to social media</span>
              </li>
              <li className="flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-400" />
                <span>Earn badges for milestones</span>
              </li>
            </ul>
            <Button asChild variant="secondary" className="w-full mt-6">
              <Link href="/card" className="flex items-center gap-2">
                <Gem className="h-4 w-4" /> Create Your Ice Card
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 🗣️ Testimonials */}
      <section className="py-16 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What Our Community Says</h2>
            <p className="text-gray-400">Join thousands of passionate users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* ✨ Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="relative z-10">
            <Sparkles className="h-12 w-12 mx-auto text-purple-400 mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Geek Out Together?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the community that celebrates your niche obsessions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <SignedOut>
                <div className="flex gap-4">
                  <SignInButton>
                    <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 shadow-lg flex-1 px-6 py-2 rounded-lg hover:shadow-purple-500/30">
                      Claim Your Username
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex gap-4">
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 shadow-lg flex-1 px-6 rounded-lg py-2 text-center hover:shadow-purple-500/30"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </SignedIn>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              No credit card needed. Your watchlist awaits.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
