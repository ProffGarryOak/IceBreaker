"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search, User, Home, Compass, Library, Snowflake, Film, Eye, Tv2, Headphones, Gamepad2, BookOpen,ListCollapse, } from "lucide-react";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const contentRoutes = [
  {
    icon: <Film className="h-5 w-5" />,
    title: "Movies",
    route: "/movies",
    color: "text-amber-400 hover:bg-amber-400/10",
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: "Anime",
    route: "/anime",
    color: "text-emerald-400 hover:bg-emerald-400/10",
  },
  {
    icon: <Tv2 className="h-5 w-5" />,
    title: "TV Shows",
    route: "/shows",
    color: "text-cyan-400 hover:bg-cyan-400/10",
  },
  {
    icon: <Headphones className="h-5 w-5" />,
    title: "Music",
    route: "/songs",
    color: "text-purple-400 hover:bg-purple-400/10",
  },
  {
    icon: <Gamepad2 className="h-5 w-5" />,
    title: "Games",
    route: "/games",
    color: "text-red-400 hover:bg-red-400/10",
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "Books",
    route: "/books",
    color: "text-amber-600 hover:bg-amber-600/10",
  },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black bg-black backdrop-blur supports-[backdrop-filter]:bg-black/70 text-white">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        {/* Left Section - Logo and Main Navigation */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-blue-300">
            <Snowflake className="h-7 w-7 text-blue-300" />
            <span className="hidden sm:inline">Ice Breaker</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-3">

          <div className="mr-2">
            <SignedIn>
              <Link href="/card">
              <Button  className="bg-blue-100/10 hover:bg-blue-600/20 border-blue-400/50 text-blue-200">
                  <Snowflake className="h-4 w-4 mr-2" />
                  IceCard
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href="#card">
                <Button className="mx-0 px-2 bg-blue-100 hover:bg-blue-600/20 border-blue-400/50 text-blue-950">
                  <Snowflake className="h-4 w-4 mr-2" />
                  IceCard
                </Button>
              </Link>
            </SignedOut>
          </div>

            

            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white/80">
              <ListCollapse  className="h-4 w-4 text-white"/>Content
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-black border-gray-800">
              {contentRoutes.map((item) => (
                <DropdownMenuItem 
                key={item.route} 
                className={`focus:bg-${item.color}/20 focus:${item.color} hover:bg-gray-500/20 ${item.color}`}
              >
               
                  <Link href={item.route} className="flex items-center  w-full">
                    <span className="mr-2 ">{item.icon}</span>
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

            <SignedIn>
              <Link href="/dashboard" className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors px-2 py-1 rounded-md hover:bg-white/10">
                <Compass className="h-[1.1rem] w-[1.1rem]" />
                <span>Dashboard</span>
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href="#explore" className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors px-2 py-1 rounded-md hover:bg-white/10">
                <Compass className="h-[1.1rem] w-[1.1rem]" />
                <span>Explore</span>
              </Link>
            </SignedOut>
          </nav>
        </div>


        
        {/* Right Section - User Controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* IceCard Button */}
          

          
         

        
          
          <SignedOut>
            <div className="flex gap-4">
              <SignInButton>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 shadow-lg px-6 py-2 rounded-lg hover:shadow-purple-500/30 transition-all">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 shadow-lg px-6 py-2 rounded-lg hover:shadow-purple-500/30 transition-all">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4">
              <UserButton
                appearance={{
                  elements: {
                    userButtonBox: "border-2 border-blue-400/50 rounded-full shadow-md hover:shadow-lg transition-all",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}