"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import { formatGHS } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-2xl text-ivory sm:text-3xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="btn-gold flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-emerald-950 sm:px-5 sm:py-2.5"
        >
          <span>+</span>
          <span>New</span>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-emerald-900/40" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-gold-600/15 bg-emerald-900/30 p-12 text-center">
          <p className="text-3xl">📦</p>
          <p className="mt-3 text-ivory/50">No products yet.</p>
          <Link href="/admin/products/new" className="mt-4 inline-block text-sm text-gold-500 underline">
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="glass-panel flex items-center gap-3 rounded-2xl p-3 sm:gap-4 sm:p-4">
              {/* Thumbnail */}
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gold-600/15 sm:h-16 sm:w-16">
                <Image
                  src={p.images[0] || "/icons/icon-512.png"}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="truncate font-display text-sm text-ivory sm:text-base">{p.name}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-ivory/40">{p.category}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    p.in_stock ? "bg-emerald-800/50 text-emerald-300" : "bg-red-950/40 text-red-300"
                  }`}>
                    {p.in_stock ? "In stock" : "Out of stock"}
                  </span>
                  {p.featured && (
                    <span className="rounded-full bg-gold-600/15 px-2 py-0.5 text-[10px] text-gold-400">★ Featured</span>
                  )}
                </div>
              </div>

              {/* Price */}
              <span className="shrink-0 text-sm font-semibold text-gold-400">{formatGHS(p.selling_price)}</span>

              {/* Actions */}
              <div className="flex shrink-0 gap-1.5">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="rounded-full border border-gold-600/30 px-3 py-1.5 text-xs text-ivory/70 transition-colors hover:border-gold-500 hover:text-gold-300"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="rounded-full border border-red-400/25 px-3 py-1.5 text-xs text-red-400/70 transition-colors hover:bg-red-950/30 hover:text-red-300"
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
