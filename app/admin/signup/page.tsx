"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const SECRET_CODE = "2026OLIVER";
type Step = "code" | "form";

export default function AdminSignupPage() {
  const [step, setStep]               = useState<Step>("code");
  const [secretInput, setSecretInput] = useState("");
  const [secretError, setSecretError] = useState("");

  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [done, setDone]           = useState(false);

  function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (secretInput.trim() === SECRET_CODE) {
      setSecretError("");
      setStep("form");
    } else {
      setSecretError("Incorrect access code.");
      setSecretInput("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Auto-insert admin profile — access is already gated by the secret code above
      const { error: profileError } = await supabase
        .from("admin_profiles")
        .insert({ id: data.user.id, full_name: fullName.trim() });

      if (profileError && profileError.code !== "23505") {
        // 23505 = unique_violation (already exists), safe to ignore
        setError("Account created but admin profile failed: " + profileError.message);
        setLoading(false);
        return;
      }
    }

    setDone(true);
    setLoading(false);
  }

  /* ── Success screen ── */
  if (done) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm animate-scaleIn text-center">
          <div className="coin-badge animate-pulseGlow mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-2xl">
            ✓
          </div>
          <h1 className="font-display text-2xl text-ivory">Admin account created!</h1>
          <p className="mt-3 text-sm text-ivory/55">
            You now have full dashboard access.
            {" "}Check your email to confirm your address if Supabase requires it, then sign in.
          </p>
          <Link
            href="/admin/login"
            className="btn-gold mt-7 inline-block rounded-full px-8 py-3.5 font-semibold text-emerald-950"
          >
            Go to Login →
          </Link>
        </div>
      </div>
    );
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
            <h1 className="font-display text-2xl text-ivory">Create Admin Account</h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-gold-500/70">Store Owner &amp; Team</p>
          </div>
        </div>

        {/* ── STEP 1: Secret code ── */}
        {step === "code" && (
          <div className="glass-panel rounded-2xl p-6">
            <div className="mb-5 text-center">
              <span className="text-3xl">🔐</span>
              <p className="mt-2 text-sm font-medium text-ivory/70">Enter Access Code</p>
              <p className="mt-1 text-xs text-ivory/40">
                Only authorised team members can create an admin account.
              </p>
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
                  text-center tracking-[0.3em] text-ivory placeholder:tracking-normal
                  placeholder:text-ivory/25 focus:border-gold-500 focus:outline-none transition-colors"
              />
              {secretError && (
                <p className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-950/20 px-4 py-2.5 text-sm text-red-300">
                  <span>⚠</span> {secretError}
                </p>
              )}
              <button type="submit" className="btn-gold w-full rounded-xl py-3.5 font-semibold text-emerald-950">
                Verify Code
              </button>
            </form>
            <p className="mt-5 text-center text-xs text-ivory/30">
              <Link href="/admin/login" className="hover:text-gold-400 transition-colors">
                Already have an account? Sign in →
              </Link>
            </p>
          </div>
        )}

        {/* ── STEP 2: Registration form ── */}
        {step === "form" && (
          <div className="glass-panel rounded-2xl p-6 animate-scaleIn">
            <div className="mb-5 text-center">
              <span className="text-3xl">✅</span>
              <p className="mt-2 text-sm font-medium text-ivory/70">Code verified — fill in your details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-ivory/50">Full Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alexander Dwumaah"
                  className="w-full rounded-xl border border-gold-600/25 bg-emerald-900/50 px-4 py-3.5
                    text-ivory placeholder:text-ivory/25 focus:border-gold-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-ivory/50">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full rounded-xl border border-gold-600/25 bg-emerald-900/50 px-4 py-3.5
                    text-ivory placeholder:text-ivory/25 focus:border-gold-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-ivory/50">
                  Password <span className="text-ivory/30 normal-case tracking-normal">(min 6 characters)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gold-600/25 bg-emerald-900/50 px-4 py-3.5 pr-14
                      text-ivory placeholder:text-ivory/25 focus:border-gold-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center
                      rounded-lg text-lg text-ivory/40 transition-all hover:bg-emerald-800/50 hover:text-ivory/80"
                  >
                    {showPw ? "🙈" : "👁️"}
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
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between text-xs text-ivory/30">
              <button onClick={() => setStep("code")} className="hover:text-gold-400 transition-colors">
                ← Change code
              </button>
              <Link href="/admin/login" className="hover:text-gold-400 transition-colors">
                Sign in instead →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
