"use client";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Search,
  User,
  Home,
  Compass,
  Library,
  Snowflake,
  Film,
  Eye,
  Tv2,
  Headphones,
  Gamepad2,
  BookOpen,
  ListCollapse,
  Menu,
  X,
} from "lucide-react";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black bg-black backdrop-blur supports-[backdrop-filter]:bg-black/70 text-white">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        {/* Left Section - Logo and Main Navigation */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-0 font-semibold text-blue-300"
          >
            <Image 
              src="/logo.png" 
              alt="Ice Breaker Logo"
              width={28} 
              height={28}
              className="h-15 w-15"
            />
            <span className="hidden sm:inline">Ice Breaker</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-3 ml-30">
            <div className="mr-2">
              <SignedIn>
                <Link href="/card">
                  <Button className="bg-muted-background hover:bg-gray-600/20 border-gray-400/50 ">
                    <Snowflake className="h-4 w-4 " />
                    IceCard
                  </Button>
                </Link>
              </SignedIn>
              <SignedOut>
                <Link href="#card">
                  <Button className="bg-muted-background hover:bg-gray-600/20 border-gray-400/50">
                    <Snowflake className="h-4 w-4 mr-2" />
                    IceCard
                  </Button>
                </Link>
              </SignedOut>
            </div>

            <SignedIn>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 hover:text-white/80"
                  >
                    <ListCollapse className="h-4 w-4 text-white" />
                    Content
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-black border-gray-800">
                  {contentRoutes.map((item) => (
                    <DropdownMenuItem
                      key={item.route}
                      className={`focus:bg-${item.color}/20 focus:${item.color} hover:bg-gray-500/20 ${item.color}`}
                    >
                      <Link
                        href={item.route}
                        className="flex items-center  w-full"
                      >
                        <span className="mr-2 ">{item.icon}</span>
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>
            <SignedOut>
              <Button
                variant="ghost"
                size="sm"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white hover:bg-white/10 hover:text-white/80 transition-colors"
              >
                <Link href="#content" className="flex items-center gap-1.5">
                <ListCollapse className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Content</span></Link>
              </Button>
            </SignedOut>

            <SignedIn>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors px-2 py-1 rounded-md hover:bg-white/10"
              >
                <Compass className="h-[1.1rem] w-[1.1rem]" />
                <span>Dashboard</span>
              </Link>
            </SignedIn>
            <SignedOut>
              <Link
                href="#explore"
                className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors px-2 py-1 rounded-md hover:bg-white/10"
              >
                <Compass className="h-[1.1rem] w-[1.1rem]" />
                <span>Explore</span>
              </Link>
            </SignedOut>
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <button
          ref={hamburgerRef}
          className="md:hidden ml-auto mr-4"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Right Section - User Controls */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {/* IceCard Button */}

          <SignedOut>
            <div className="flex gap-4">
              <SignInButton>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 shadow-lg px-4 py-1 rounded-md hover:shadow-purple-500/30 transition-all">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 shadow-lg px-4 py-1 rounded-md hover:shadow-purple-500/30 transition-all">
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
                    userButtonBox:
                      "border-2 border-blue-400/50 rounded-full shadow-md hover:shadow-lg transition-all",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden bg-black border-t border-gray-800 fixed inset-x-0 top-16"
        >
          <div className="container px-4 py-4 space-y-4">
            <SignedIn>
              <Link href="/card" className="flex items-center gap-2 text-white hover:text-white/80">
                <Snowflake className="h-4 w-4" />
                IceCard
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href="#card" className="flex items-center gap-2 text-white hover:text-white/80">
                <Snowflake className="h-4 w-4" />
                IceCard
              </Link>
            </SignedOut>

            <div className="space-y-2">
              {contentRoutes.map((item) => (
                <Link
                  key={item.route}
                  href={item.route}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${item.color}`}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </div>

            <SignedIn>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-white hover:text-white/80"
              >
                <Compass className="h-4 w-4" />
                Dashboard
              </Link>
            </SignedIn>
            <SignedOut>
              <Link
                href="#explore"
                className="flex items-center gap-2 text-white hover:text-white/80"
              >
                <Compass className="h-4 w-4" />
                Explore
              </Link>
            </SignedOut>

            <div className="pt-4 border-t border-gray-800">
              <SignedOut>
                <div className="flex flex-col gap-2">
                  <SignInButton>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 shadow-lg px-4 py-2 rounded-md hover:shadow-purple-500/30 transition-all">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 shadow-lg px-4 py-2 rounded-md hover:shadow-purple-500/30 transition-all">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-2">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonBox:
                          "border-2 border-blue-400/50 rounded-full shadow-md hover:shadow-lg transition-all",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
