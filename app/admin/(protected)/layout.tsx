"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [checking,   setChecking]   = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
    async function check() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) { if (active) router.replace("/admin/login"); return; }
      const { data: profile } = await supabase
        .from("admin_profiles").select("id").eq("id", user.id).maybeSingle();
      if (!active) return;
      if (!profile) { router.replace("/admin/login"); return; }
      setAuthorized(true);
      setChecking(false);
    }
    check();
    return () => { active = false; };
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (checking || !authorized) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-ivory/50">
        <div className="coin-badge h-12 w-12 animate-pulseGlow rounded-full" />
        <p className="text-sm">Checking access…</p>
      </div>
    );
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Orders",   icon: "📋" },
    { href: "/admin/products",  label: "Products", icon: "🛍️" },
  ];

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-[57px] z-40 border-b border-gold-600/15 bg-emerald-950/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Brand + nav */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/" className="mr-3 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
              <Image src="/icons/icon-192.png" alt="" width={22} height={22} className="rounded-full" />
              <span className="hidden text-xs uppercase tracking-widest text-ivory/60 sm:inline">Store</span>
            </Link>
            <div className="h-4 w-px bg-gold-600/20" />
            <div className="ml-3 flex gap-1 sm:gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 sm:px-4 ${
                    pathname?.startsWith(item.href)
                      ? "bg-gold-600 text-emerald-950 shadow-[0_0_12px_rgba(201,162,39,0.3)]"
                      : "text-ivory/60 hover:bg-emerald-800/60 hover:text-ivory"
                  }`}
                >
                  <span className="text-xs">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 rounded-full border border-red-400/20 px-3 py-1.5 text-xs text-red-400/70 transition-all hover:border-red-400/50 hover:bg-red-950/20 hover:text-red-300"
          >
            <span>↩</span>
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>

      {/* Page content */}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}
