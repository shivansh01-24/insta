"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { ShieldCheck, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";

export function Navbar() {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl instagram-gradient-bg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <InstagramIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
            InstaConnect <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">Meta OAuth</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {loading ? (
            <div className="h-9 w-24 bg-white/5 animate-pulse rounded-lg" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-gray-200 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-purple-400" />
                Dashboard
              </Link>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-300 border border-white/10">
                <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                <span>{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-rose-400 px-3 py-2 rounded-lg hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-300 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-white px-4 py-2 rounded-lg instagram-gradient-bg hover:opacity-90 transition-opacity shadow-md shadow-purple-500/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
