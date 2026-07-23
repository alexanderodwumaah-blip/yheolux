"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminSignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Try to self-register a profile row. This will only succeed once an
    // admin approves them by inserting the row in Supabase (see schema.sql),
    // OR immediately if RLS allows self-insert (as configured in schema.sql).
    if (data.user) {
      await supabase
        .from("admin_profiles")
        .insert({ id: data.user.id, full_name: fullName })
        .select();
    }

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 text-center sm:px-6 animate-fadeUp">
        <h1 className="font-display text-2xl text-ivory">Account created</h1>
        <p className="mt-3 text-ivory/60">
          Check your email to confirm your address if required, then head to{" "}
          <Link href="/admin/login" className="text-gold-400 underline">
            Admin Login
          </Link>
          . If sign-in says you&apos;re not an admin yet, ask an existing
          admin to approve you in Supabase.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 sm:px-6 animate-fadeUp">
      <h1 className="text-center font-display text-3xl text-ivory">
        Create Admin Account
      </h1>
      <p className="mt-2 text-center text-sm text-ivory/50">
        For the store owner &amp; team
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          type="text"
          required
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border border-gold-500/30 bg-emerald-950/60 px-4 py-2.5 text-ivory placeholder:text-ivory/30 focus:border-gold-400"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gold-500/30 bg-emerald-950/60 px-4 py-2.5 text-ivory placeholder:text-ivory/30 focus:border-gold-400"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gold-500/30 bg-emerald-950/60 px-4 py-2.5 text-ivory placeholder:text-ivory/30 focus:border-gold-400"
        />
        {error && (
          <p className="rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gold-500 px-6 py-3 font-semibold text-emerald-950 shadow-lg transition-transform hover:scale-105 disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ivory/50">
        Already an admin?{" "}
        <Link href="/admin/login" className="text-gold-400 underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
