"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabase.from("subscribers").insert({ email });
    if (error) {
      setStatus("error");
      setMessage(
        error.code === "23505"
          ? "That email is already subscribed."
          : "Something went wrong. Please try again."
      );
      return;
    }
    setStatus("done");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6 animate-fadeUp">
      <p className="text-xs uppercase tracking-widest text-gold-400">
        Stay Updated
      </p>
      <h1 className="mt-2 font-display text-3xl text-ivory">
        Be first to know
      </h1>
      <p className="mt-3 text-ivory/60">
        Get a note whenever new signature pieces land in the shop.
      </p>

      {status === "done" ? (
        <p className="mt-8 rounded-xl border border-gold-500/30 bg-gold-500/10 px-5 py-4 text-gold-300">
          You&apos;re on the list! 🎉
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-full border border-gold-500/30 bg-emerald-950/60 px-5 py-3 text-center text-ivory placeholder:text-ivory/30 focus:border-gold-400"
          />
          {status === "error" && (
            <p className="text-sm text-red-300">{message}</p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-gold-500 px-6 py-3 font-semibold text-emerald-950 shadow-lg transition-transform hover:scale-105 disabled:opacity-60"
          >
            {status === "loading" ? "Subscribing…" : "Notify Me"}
          </button>
        </form>
      )}
    </div>
  );
}
