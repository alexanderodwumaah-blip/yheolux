"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
    async function check() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        if (active) router.replace("/admin/login");
        return;
      }
      const { data: profile } = await supabase
        .from("admin_profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
      if (!active) return;
      if (!profile) {
        router.replace("/admin/login");
        return;
      }
      setAuthorized(true);
      setChecking(false);
    }
    check();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (checking || !authorized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ivory/50">
        Checking access…
      </div>
    );
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Orders" },
    { href: "/admin/products", label: "Products" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gold-500/15 pb-4">
        <div className="flex gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname?.startsWith(item.href)
                  ? "bg-gold-500 text-emerald-950"
                  : "text-ivory/70 hover:bg-emerald-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-ivory/50 underline hover:text-red-300"
        >
          Sign out
        </button>
      </div>
      {children}
    </div>
  );
}
