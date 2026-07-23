"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
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
      setError(
        "This account isn't an admin yet. Ask an existing admin to add you in Supabase (see supabase/schema.sql)."
      );
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 sm:px-6 animate-fadeUp">
      <h1 className="text-center font-display text-3xl text-ivory">
        Admin Login
      </h1>
      <p className="mt-2 text-center text-sm text-ivory/50">
        YHEOLUX Dashboard
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
          placeholder="Password"
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
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ivory/50">
        New admin?{" "}
        <Link href="/admin/signup" className="text-gold-400 underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
