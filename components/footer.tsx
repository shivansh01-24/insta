import Link from "next/link";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { ShieldCheck, Lock, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-zinc-950/80 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg instagram-gradient-bg flex items-center justify-center">
              <InstagramIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">InstaConnect</span>
          </div>
          <p className="text-sm text-gray-400 max-w-md leading-relaxed">
            Enterprise-grade Instagram authentication platform built on the official Meta Graph API OAuth architecture. Empowering customers to connect Professional accounts safely without developer friction.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Meta App Review Ready
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-purple-400" /> AES-256 Token Encryption
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-200 mb-4">Platform</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
            <li><Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-200 mb-4">Security & Meta</h4>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-gray-500" /> Graph API v23.0</li>
            <li className="text-gray-500 text-xs">Official Facebook Login</li>
            <li className="text-gray-500 text-xs">CSRF Protection</li>
            <li className="text-gray-500 text-xs">Zero Client Secret Leakage</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>© {new Date().getFullYear()} InstaConnect Platform. All rights reserved.</p>
        <p>Built with Next.js 15, TypeScript & Tailwind CSS for production Vercel deployment.</p>
      </div>
    </footer>
  );
}
