"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import {
  CheckCircle2,
  AlertCircle,
  Building,
  Calendar,
  Unlink,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface ConnectedAccount {
  id: string;
  instagramUserId: string;
  username: string;
  name: string | null;
  profilePictureUrl: string | null;
  facebookPageId: string;
  facebookPageName: string;
  connectedAt: string;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const querySuccess = searchParams.get("success");
  const queryError = searchParams.get("error");

  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<ConnectedAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlinking, setUnlinking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(queryError);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();

        if (!sessionRes.ok || !sessionData.authenticated) {
          router.push("/login?error=Session expired. Please log in.");
          return;
        }

        setUser(sessionData.user);

        const accountRes = await fetch("/api/instagram/account");
        const accountData = await accountRes.json();

        if (accountRes.ok && accountData.account) {
          setAccount(accountData.account);
        } else {
          setAccount(null);
        }
      } catch (err) {
        setErrorMsg("Failed to load dashboard state. Please refresh.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  const handleConnectInstagram = () => {
    window.location.href = "/api/instagram/connect";
  };

  const handleUnlinkAccount = async () => {
    if (!confirm("Are you sure you want to unlink your Instagram account from this platform?")) {
      return;
    }

    setUnlinking(true);
    try {
      const res = await fetch("/api/instagram/unlink", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to unlink account");
      }

      setAccount(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to unlink account");
    } finally {
      setUnlinking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-400 gap-3">
        <RefreshCw className="w-5 h-5 animate-spin text-purple-400" />
        <span>Loading dashboard data from database...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Status Alerts */}
      {querySuccess === "instagram_connected" && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-semibold">Instagram Connected Successfully!</span>
            <p className="text-xs text-emerald-400/80">Your Meta OAuth authorization was processed and saved securely.</p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold">Connection Alert</span>
            <p className="text-xs text-rose-300/80">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* 1. Welcome Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Dashboard</span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400">{user?.email}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.name}!
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {account ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Instagram Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              Not Connected
            </span>
          )}
        </div>
      </div>

      {/* 2. Instagram Connection Section */}
      {account ? (
        /* Connected Instagram Account Info Card */
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl instagram-gradient-bg flex items-center justify-center shadow-lg">
                <InstagramIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Connected Instagram Account</h2>
                <p className="text-xs text-zinc-400">Official Meta OAuth Authorization Active</p>
              </div>
            </div>

            <button
              onClick={handleUnlinkAccount}
              disabled={unlinking}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition-colors disabled:opacity-50"
            >
              <Unlink className="w-3.5 h-3.5" />
              {unlinking ? "Unlinking..." : "Unlink Account"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/60 border border-white/5">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center text-purple-300 font-bold border border-white/10 shrink-0">
                {account.profilePictureUrl ? (
                  <img src={account.profilePictureUrl} alt={account.username} className="w-full h-full object-cover" />
                ) : (
                  account.username.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="space-y-0.5 overflow-hidden">
                <p className="text-xs text-zinc-400">Instagram Username</p>
                <p className="text-base font-bold text-white truncate flex items-center gap-1">
                  @{account.username}
                </p>
                {account.name && <p className="text-xs text-zinc-400 truncate">{account.name}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/60 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Building className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 overflow-hidden">
                <p className="text-xs text-zinc-400">Connected Facebook Page</p>
                <p className="text-base font-bold text-white truncate">{account.facebookPageName}</p>
                <p className="text-xs text-zinc-500 truncate">ID: {account.facebookPageId}</p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-zinc-500 border-t border-white/5">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              Connected on {new Date(account.connectedAt).toLocaleDateString(undefined, { dateStyle: "long" })}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              Meta Access Token Encrypted
            </span>
          </div>
        </div>
      ) : (
        /* Connect Instagram Prompt Card */
        <div className="glass-panel p-8 sm:p-12 rounded-2xl border border-white/10 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl instagram-gradient-bg mx-auto flex items-center justify-center shadow-xl shadow-purple-500/20">
            <InstagramIcon className="w-8 h-8 text-white" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-bold text-white">Connect Your Instagram Account</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Click below to authorize your Instagram Professional (Business or Creator) account using Meta's official OAuth flow.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleConnectInstagram}
              className="px-8 py-3.5 rounded-xl instagram-gradient-bg text-white font-semibold text-sm inline-flex items-center gap-2.5 hover:opacity-95 transition-all shadow-xl shadow-purple-500/25"
            >
              <InstagramIcon className="w-5 h-5 text-white" />
              Connect Instagram
            </button>
          </div>

          <div className="pt-4 max-w-lg mx-auto text-xs text-zinc-500 space-y-1">
            <p>✓ Requires an Instagram Professional account linked to a Facebook Page.</p>
            <p>✓ No developer App ID, access tokens, or secret keys needed.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10">
        <Suspense fallback={<div className="flex items-center justify-center py-20 text-zinc-400 gap-3"><RefreshCw className="w-5 h-5 animate-spin text-purple-400" /> Loading dashboard...</div>}>
          <DashboardContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
