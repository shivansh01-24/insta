import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import {
  Shield,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-purple-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-purple-600/20 via-pink-600/15 to-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs font-medium text-purple-300 border-purple-500/30 mb-2 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span>Official Meta Graph API OAuth Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Connect Your Instagram <br className="hidden sm:inline" />
            <span className="instagram-gradient-text">Without Technical Setup</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Allow any customer to securely connect their Instagram Professional account through official Meta authorization in seconds. No developer accounts, tokens, or app secrets required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl instagram-gradient-bg text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-xl shadow-purple-500/25 group"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-panel text-white font-semibold flex items-center justify-center gap-2.5 hover:bg-white/10 transition-all border border-white/15"
            >
              <InstagramIcon className="w-5 h-5 text-pink-400" />
              Connect Instagram
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Copy-Paste Tokens
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Official Meta OAuth
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Vercel & Production Ready
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative bg-zinc-900/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400">Architecture & Features</h2>
            <p className="text-3xl font-extrabold text-white">Built for Seamless Account Authorization</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl glass-panel-hover space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">1-Click Meta Authorization</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Customers click "Connect Instagram" and authenticate directly on Meta's official login dialog. Facebook Pages and Instagram accounts are discovered automatically.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl glass-panel-hover space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">AES-256 Token Encryption</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                60-day long-lived access tokens are stored securely in PostgreSQL using strong industry-standard encryption. OAuth state is validated to prevent CSRF.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl glass-panel-hover space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Meta App Review Ready</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Single platform-owned Meta App model. Your customers never create a developer app, copy App IDs, or configure webhooks. We manage all Meta infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-pink-400">Simple Workflow</h2>
            <p className="text-3xl font-extrabold text-white">How Instagram Connection Works</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="glass-panel p-6 rounded-2xl space-y-4 relative">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Create Account</h3>
              <p className="text-sm text-zinc-400">
                Sign up or log into your protected account dashboard on our platform.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-4 relative">
              <div className="w-8 h-8 rounded-full bg-pink-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Click "Connect Instagram"</h3>
              <p className="text-sm text-zinc-400">
                Redirect to Meta's official authorization page and select your Facebook Page & Instagram account.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-4 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Connected!</h3>
              <p className="text-sm text-zinc-400">
                Return to your dashboard. Your Instagram account is now verified and connected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-zinc-900/20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">Questions & Answers</h2>
            <p className="text-3xl font-extrabold text-white">Frequently Asked Questions</p>
          </div>

          <div className="space-y-4">
            <div className="glass-panel p-6 rounded-xl space-y-2">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                Do customers need a Meta Developer account?
              </h3>
              <p className="text-sm text-zinc-400 pl-6 leading-relaxed">
                No! Our platform owns the single Meta App. Your customers simply click Connect, log in with Facebook, and grant permission.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl space-y-2">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                What account type is required for Instagram connection?
              </h3>
              <p className="text-sm text-zinc-400 pl-6 leading-relaxed">
                Meta requires an Instagram Professional (Business or Creator) account linked to a Facebook Page.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl space-y-2">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                How are tokens stored and secured?
              </h3>
              <p className="text-sm text-zinc-400 pl-6 leading-relaxed">
                Access tokens are automatically exchanged for 60-day long-lived tokens and encrypted using AES-256-GCM before being saved into PostgreSQL.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
