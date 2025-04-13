"use client";

import { motion } from "framer-motion";
import { 
  Rocket, 
  Users, 
  Film, 
  BookOpen, 
  Gamepad2, 
  Music, 
  Zap, 
  Sparkles, 
  Code, 
  Heart, 
  Globe, 
  ArrowRight,
  Github,
  Twitter,
  Disc,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

// Animated counter component
const Counter = ({ target, speed = 50, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        const diff = target - prev;
        const step = Math.ceil(diff / 10);
        return prev + (diff > step ? step : diff);
      });
    }, speed);

    return () => clearInterval(interval);
  }, [target, speed]);

  return (
    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default function About() {
  // Team members data
  const team = [
    {
      name: "Adarsh Pandey",
      role: "Founder & CEO",
      bio: "Anime addict who built the first prototype in his dorm",
      avatar: "/me.png",
      funFact: "Can recite every line from Evangelion",
    },
    {
      name: "Shubham Kumar",
      role: "Lead Designer",
      bio: "Makes everything pretty and functional",
      avatar: "/team-jammie.png",
      funFact: "Owns 500+ physical manga volumes",
    },
    {
      name: "Kumar Siddhant",
      role: "Dev Wizard",
      bio: "Turns coffee into clean code",
      avatar: "/cow.png",
      funFact: "Built a Raspberry Pi home theater at 14",
    },
    {
      name: "Ankit Agnihotri",
      role: "Dev Wizard",
      bio: "Turns chai into messy but functional code",
      avatar: "/team-alex.png",
      funFact: "Built a gang of goons at 16",
    },
  ];

  // Timeline data
  const timeline = [
    {
      year: "2021",
      event: "The Frustration",
      description: "Adarsh gets tired of using 5 different apps to track movies, anime, and books",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      year: "2022",
      event: "First Prototype",
      description: "A scrappy web app called 'MediaHive' is born",
      icon: <Code className="h-5 w-5" />,
    },
    {
      year: "2023",
      event: "IceBreaker Launches",
      description: "We pivot to focus on social discovery and Ice Cards",
      icon: <Rocket className="h-5 w-5" />,
    },
    {
      year: "2024",
      event: "Community Explodes",
      description: "100K+ users join in 6 months",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* ✨ Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 50],
              y: [0, (Math.random() - 0.5) * 50],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* 🚀 Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-full mb-6"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">OUR STORY</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          More Than Just a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Watchlist</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto"
        >
          We're building the ultimate platform for content lovers to <span className="text-purple-300">track</span>, <span className="text-blue-300">share</span>, and <span className="text-pink-300">connect</span> over their obsessions.
        </motion.p>
      </section>

      {/* 📜 Timeline Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How IceBreaker Was Born</h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 h-full w-0.5 bg-gradient-to-b from-purple-500 to-blue-500 -translate-x-1/2" />
          
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className={`mb-8 flex ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-start gap-4`}
            >
              <div className={`flex-1 ${index % 2 === 0 ? "md:text-right md:pr-8" : "md:pl-8"} order-1`}>
                <h3 className="text-xl font-bold">{item.event}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center order-2">
                {item.icon}
              </div>
              
              <div className={`flex-1 ${index % 2 === 0 ? "md:pl-8" : "md:text-right md:pr-8"} order-3`}>
                <span className="font-mono text-gray-500">{item.year}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🧬 Our DNA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our DNA</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "For Obsessives, By Obsessives",
                description: "We're not just building a tool—we're building the platform we wish existed.",
                icon: <Heart className="h-8 w-8" />,
              },
              {
                title: "Social First",
                description: "Discovering content is better with friends who get your taste.",
                icon: <Users className="h-8 w-8" />,
              },
              {
                title: "Open & Transparent",
                description: "We're building in public and value community feedback.",
                icon: <Globe className="h-8 w-8" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700"
              >
                <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 👥 Meet the Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">The Humans Behind IceBreaker</h2>
        
        <div className="grid md:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all"
            >
              <div className="h-48 bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                <Avatar className="h-24 w-24 border-4 border-white/20">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-purple-400 mb-2">{member.role}</p>
                <p className="text-gray-400 mb-4">{member.bio}</p>
                <div className="text-sm bg-gray-900/50 p-3 rounded-lg">
                  <span className="text-gray-500">Fun fact:</span> {member.funFact}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 📊 By the Numbers */}
      <section className="py-16 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">IceBreaker in Numbers</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">
                <Counter target={125000} />
              </div>
              <p className="text-gray-400">Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                <Counter target={4200000} />
              </div>
              <p className="text-gray-400">Items Tracked</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                <Counter target={980000} />
              </div>
              <p className="text-gray-400">Ice Cards Shared</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                <Counter target={42} suffix="+" />
              </div>
              <p className="text-gray-400">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* 💻 Tech Stack */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Tech Stack</h2>
        
        <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: "Next.js", purpose: "Frontend Framework" },
              { name: "Tailwind CSS", purpose: "Styling" },
              { name: "TypeScript", purpose: "Type Safety" },
              { name: "PostgreSQL", purpose: "Database" },
              { name: "Prisma", purpose: "ORM" },
              { name: "Vercel", purpose: "Hosting" },
            ].map((tech, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-900/50 p-4 rounded-lg border border-gray-700"
              >
                <h3 className="font-bold text-lg">{tech.name}</h3>
                <p className="text-gray-400 text-sm">{tech.purpose}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-gray-600">
            <Button variant="outline" className="gap-2">
              <Github className="h-4 w-4" /> GitHub
            </Button>
            <Button variant="outline" className="gap-2">
              <Twitter className="h-4 w-4" /> Twitter
            </Button>
            <Button variant="outline" className="gap-2">
              <Disc className="h-4 w-4" /> Discord
            </Button>
            <Button variant="outline" className="gap-2">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </Button>
          </div>
        </div>
      </section>

      {/* 🎉 Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm"
        >
          <h2 className="text-3xl font-bold mb-6">Want to Join the Journey?</h2>
          <p className="text-xl text-gray-300 mb-8">
            We're always looking for passionate people to help build IceBreaker.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg gap-2"
          >
            See Open Positions <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
}