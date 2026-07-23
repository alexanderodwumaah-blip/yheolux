"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const SECRET_CODE = "2026OLIVER";

type Step = "code" | "credentials";

export default function AdminLoginPage() {
  const router = useRouter();

  const [step, setStep]         = useState<Step>("code");
  const [secretInput, setSecretInput] = useState("");
  const [secretError, setSecretError] = useState("");

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPw, setShowPw]     = useState(false);

  function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (secretInput.trim() === SECRET_CODE) {
      setSecretError("");
      setStep("credentials");
    } else {
      setSecretError("Incorrect access code. Please try again.");
      setSecretInput("");
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      { email, password }
    );

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!profile) {
      setError("This account has no admin access. Contact the store owner.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-sm animate-fadeUp">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="coin-badge flex h-16 w-16 items-center justify-center rounded-full">
            <Image src="/icons/icon-192.png" alt="YHEOLUX" width={52} height={52} className="rounded-full" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl text-ivory">Admin Portal</h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-gold-500/70">YHEOLUX Dashboard</p>
          </div>
        </div>

        {/* ── STEP 1: Secret code ── */}
        {step === "code" && (
          <div className="glass-panel rounded-2xl p-6">
            <div className="mb-5 text-center">
              <span className="text-3xl">🔐</span>
              <p className="mt-2 text-sm font-medium text-ivory/70">Enter Access Code</p>
              <p className="mt-1 text-xs text-ivory/40">This portal is restricted. Enter your access code to continue.</p>
            </div>

            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <input
                type="password"
                required
                autoFocus
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                placeholder="••••••••••"
                className="w-full rounded-xl border border-gold-600/25 bg-emerald-900/50 px-4 py-3.5
                  text-center text-ivory tracking-[0.3em] placeholder:tracking-normal
                  placeholder:text-ivory/25 focus:border-gold-500 focus:outline-none transition-colors"
              />
              {secretError && (
                <p className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-950/20 px-4 py-2.5 text-sm text-red-300">
                  <span>⚠</span> {secretError}
                </p>
              )}
              <button
                type="submit"
                className="btn-gold w-full rounded-xl py-3.5 font-semibold text-emerald-950"
              >
                Verify Code
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-ivory/30">
              <Link href="/" className="hover:text-gold-400 transition-colors">← Back to shop</Link>
            </p>
          </div>
        )}

        {/* ── STEP 2: Email + password ── */}
        {step === "credentials" && (
          <div className="glass-panel rounded-2xl p-6 animate-scaleIn">
            <div className="mb-5 text-center">
              <span className="text-3xl">✅</span>
              <p className="mt-2 text-sm font-medium text-ivory/70">Code Verified — Sign In</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-ivory/50">Email</label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full rounded-xl border border-gold-600/25 bg-emerald-900/50 px-4 py-3.5
                    text-ivory placeholder:text-ivory/25 focus:border-gold-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-ivory/50">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gold-600/25 bg-emerald-900/50 px-4 py-3.5 pr-12
                      text-ivory placeholder:text-ivory/25 focus:border-gold-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory/80 transition-colors text-sm"
                    aria-label="Toggle password visibility"
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <p className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-950/20 px-4 py-2.5 text-sm text-red-300">
                  <span>⚠</span> {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full rounded-xl py-3.5 font-semibold text-emerald-950 disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between text-xs text-ivory/30">
              <button onClick={() => setStep("code")} className="hover:text-gold-400 transition-colors">
                ← Change code
              </button>
              <Link href="/admin/signup" className="hover:text-gold-400 transition-colors">
                Create account →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
