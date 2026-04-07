import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Music, User, LogOut, Camera, Home as HomeIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  const handleLogout = () => {
    // In a real app, clear auth state here
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-purple-500/30">
      {!isAuthPage && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                MoodSync
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                to="/"
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-purple-400",
                  location.pathname === "/" ? "text-purple-400" : "text-white/60"
                )}
              >
                <HomeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </nav>
      )}

      <main className={cn("relative", !isAuthPage && "pt-16")}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isAuthPage && (
        <footer className="py-12 border-t border-white/5 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-white/40 text-sm">
              &copy; 2026 MoodSync. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
