// components/Card.jsx
"use client";

import { motion } from "framer-motion";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  MoreHorizontal,
  BookOpen,
  Clapperboard,
  Tv2,
  Gamepad2,
  Music,
  Star,
  Clock
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const ContentTypeIcon = ({ type }) => {
  const icons = {
    movie: <Clapperboard className="h-4 w-4" />,
    tv: <Tv2 className="h-4 w-4" />,
    anime: <Gamepad2 className="h-4 w-4" />,
    book: <BookOpen className="h-4 w-4" />,
    music: <Music className="h-4 w-4" />,
    short: <Clock className="h-4 w-4" />
  };
  
  return icons[type] || <Star className="h-4 w-4" />;
};

export function Card({ user }) {
  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* ... rest of your Card component code ... */}
    </motion.div>
  );
}