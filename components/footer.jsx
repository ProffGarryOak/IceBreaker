import Link from "next/link";
import { Twitter, Github, Linkedin, Mail, Heart,Code, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-700 bg-gray-900 py-6">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand and copyright */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Link href="https://adarsh.cyou" className="flex items-center gap-2 text-gray-400 text-sm">
              <ExternalLink />
              <span>Website</span>
            </Link>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <Link 
              href="https://github.com/proffgarryoak" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link 
              href="https://x.com/proffgarryoak" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link 
              href="https://www.linkedin.com/in/adarshpandey1133/" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link 
              href="mailto:adarshpandey1133@gmail.com" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </Link>
          </div>

          {/* Source code */}
          <Link 
            href="https://github.com/proffgarryoak/icebreaker" 
            className="text-sm text-gray-400 hover:text-white transition-colors"
          ><div className="flex items-center gap-2 text-gray-400 text-sm">
            <Code/>
            <span>View Source</span></div>
          </Link>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Ice Breaker. All content belongs to their respective owners.
        </div>
      </div>
    </footer>
  );
}