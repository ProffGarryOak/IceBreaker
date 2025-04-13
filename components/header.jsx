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
import { Bell, Search, User, Home, Compass, Library, Snowflake } from "lucide-react";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

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
          <nav className="hidden md:flex items-center gap-5">
            <Link href="/" className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors px-2 py-1 rounded-md hover:bg-white/10">
              <Home className="h-[1.1rem] w-[1.1rem]" />
              <span>Home</span>
            </Link>
            <Link href="/about" className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors px-2 py-1 rounded-md hover:bg-white/10">
              <Library className="h-[1.1rem] w-[1.1rem]" />
              <span>About</span>
            </Link>
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
          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="md:hidden text-blue-600 hover:bg-white/10">
            <Search className="h-[1.1rem] w-[1.1rem]" />
            <span className="sr-only">Search</span>
          </Button>
          
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