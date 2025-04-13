"use client";

import { motion } from "framer-motion";
import { 
  Rocket, 
  Code, 
  Zap, 
  Sparkles, 
  Heart, 
  Globe,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Film,
  BookOpen,
  Gamepad2,
  Music,
  Terminal,
  BrainCircuit,
  Palette,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { TypeAnimation } from 'react-type-animation';

// Floating tech icons for background
const floatingTechIcons = [
  { icon: <Terminal className="h-6 w-6" />, color: "text-purple-400" },
  { icon: <Film className="h-6 w-6" />, color: "text-blue-400" },
  { icon: <BookOpen className="h-6 w-6" />, color: "text-amber-400" },
  { icon: <Gamepad2 className="h-6 w-6" />, color: "text-red-400" },
  { icon: <Music className="h-6 w-6" />, color: "text-pink-400" },
  { icon: <BrainCircuit className="h-6 w-6" />, color: "text-green-400" },
  { icon: <Palette className="h-6 w-6" />, color: "text-cyan-400" },
  { icon: <Database className="h-6 w-6" />, color: "text-yellow-400" },
];

export default function About() {
  // Dynamic stats
  const stats = [
    { value: 125000, label: "Users", icon: <Heart className="h-5 w-5" /> },
    { value: 4200000, label: "Items Tracked", icon: <Film className="h-5 w-5" /> },
    { value: 980000, label: "Ice Cards Shared", icon: <Sparkles className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white overflow-hidden">
      {/* ✨ Animated floating tech icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {floatingTechIcons.map((tech, i) => (
          <motion.div
            key={i}
            className={`absolute ${tech.color}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 100],
              x: [0, (Math.random() - 0.5) * 50],
              rotate: [0, Math.random() * 360]
            }}
            transition={{
              duration: Math.random() * 30 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          >
            {tech.icon}
          </motion.div>
        ))}
      </div>

      {/* 🚀 Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-full mb-6"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">ONE-MAN ARMY</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <Avatar className="h-32 w-32 border-4 border-white/20 shadow-xl">
            <AvatarImage src="/me.png" />
            <AvatarFallback>AP</AvatarFallback>
          </Avatar>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Adarsh Pandey</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl h-12 mb-6"
        >
          <TypeAnimation
            sequence={[
              'Accidentally a Developer',
              1500,
              'Writes Code, Prays It Works',
              1500,
              'Full-Stack Overflow Specialist',
              1500,
              'Anime → Life Coach (Certified)',
              1500,
              'Open Source, Closed Fridge',
              1500,
              'Bug Producer Since 2019',
              1500,
              'Googling Pro Max Ultra',
              1500,
              'Dark Theme Activist',
              1500,
              'Expert in Procrastination',
              1500,
              'Still Debugging Hello World',
              1500
            ]}
            
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
        >
          I built IceBreaker because I was tired of using 5 different apps to track my 
          <span className="text-purple-300"> anime</span>, 
          <span className="text-blue-300"> movies</span>, and 
          <span className="text-pink-300"> books</span>. 
          Now it's a thriving community of media lovers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg gap-2"
            asChild
          >
            <a href="https://adarsh.cyou" target="_blank" rel="noopener noreferrer">
              Visit My Website <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </motion.div>
      </section>

      {/* 🧠 My Journey */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">My Unconventional Journey</h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 h-full w-0.5 bg-gradient-to-b from-purple-500 to-blue-500" />
          
          {[
            {
              year: "2019",
              event: "The Frustration Begins",
              description: "Started tracking media in 5 different apps, hated every moment",
              icon: <Zap className="h-5 w-5" />,
            },
            {
              year: "2020",
              event: "First Prototype",
              description: "Built a scrappy web app called 'MediaHive' in my dorm room",
              icon: <Code className="h-5 w-5" />,
            },
            {
              year: "2022",
              event: "IceBreaker Born",
              description: "Pivoted to focus on social discovery with Ice Cards",
              icon: <Rocket className="h-5 w-5" />,
            },
            {
              year: "2023",
              event: "Community Explodes",
              description: "100K+ users joined in 6 months completely organically",
              icon: <Heart className="h-5 w-5" />,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-8 flex items-start gap-4 pl-8 relative"
            >
              <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                {item.icon}
              </div>
              
              <div>
                <span className="font-mono text-gray-500">{item.year}</span>
                <h3 className="text-xl font-bold mt-1">{item.event}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💪 My Superpowers */}
      <section className="py-16 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">My Builder Superpowers</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Full-Stack Wizardry",
                description: "From pixel-perfect UI to scalable backend systems",
                icon: <Terminal className="h-8 w-8" />,
                color: "from-purple-600/20 to-blue-600/20"
              },
              {
                title: "Obsessive Product Focus",
                description: "I eat, sleep and breathe user experience",
                icon: <Heart className="h-8 w-8" />,
                color: "from-pink-600/20 to-rose-600/20"
              },
              {
                title: "Open Source Mindset",
                description: "Built in public, learn in public, grow in public",
                icon: <Globe className="h-8 w-8" />,
                color: "from-cyan-600/20 to-emerald-600/20"
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm"
              >
                <div className={`bg-gradient-to-br ${item.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📊 By the Numbers */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">IceBreaker By The Numbers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700"
              >
                <div className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                  {stat.icon}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {stat.value.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🛠️ Tech Stack */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">My Weapon of Choice</h2>
        
        <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: "Next.js", purpose: "Frontend Framework", color: "border-gray-400" },
              { name: "Tailwind CSS", purpose: "Styling", color: "border-cyan-400" },
              { name: "React", purpose: "Too much work", color: "border-blue-400" },
              { name: "MongoDb", purpose: "Database", color: "border-purple-400" },
              { name: "Clerk", purpose: "Good Auth", color: "border-emerald-400" },
              { name: "Vercel", purpose: "Hosting", color: "border-white" },
            ].map((tech, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`bg-gray-900/50 p-4 rounded-lg border-l-4 ${tech.color}`}
              >
                <h3 className="font-bold text-lg">{tech.name}</h3>
                <p className="text-gray-400 text-sm">{tech.purpose}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-4 text-black hover:text-black/70">
            <Button variant="outline" className="gap-2" asChild>
              <a href="https://github.com/proffgarryoak" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" /> GitHub
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href="https://x.com/proffgarryoak" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" /> Twitter
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href="https://linkedin.com/in/adarshpandey1133" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href="mailto:adarshp1133@gmail.com">
                <Mail className="h-4 w-4" /> Email
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* 🚀 Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm"
        >
          <h2 className="text-3xl font-bold mb-6">Let's Build Something Amazing</h2>
          <p className="text-xl text-gray-300 mb-8">
            Whether you want to collaborate or just geek out about anime and tech, I'm always down to chat.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg gap-2"
              asChild
            >
              <a href="https://adarsh.cyou" target="_blank" rel="noopener noreferrer">
                Visit My Website <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 text-black"
              asChild
            >
              <a href="mailto:adarsh@icebreaker.com">
                <Mail className="h-4 w-4" /> Email Me
              </a>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}