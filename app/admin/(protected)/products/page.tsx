"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import { formatGHS } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This can't be undone.")) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-ivory">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition-transform hover:scale-105"
        >
          + New Product
        </Link>
      </div>

      {loading ? (
        <p className="text-ivory/50">Loading…</p>
      ) : products.length === 0 ? (
        <p className="rounded-xl border border-gold-500/15 bg-emerald-950/50 p-10 text-center text-ivory/60">
          No products yet. Create your first one.
        </p>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-gold-500/15 bg-emerald-950/50 p-4"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-emerald-900">
                <Image
                  src={p.images[0] || "/icons/icon-512.png"}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-[180px]">
                <p className="font-display text-ivory">{p.name}</p>
                <p className="text-xs text-ivory/40">
                  {p.category} ·{" "}
                  {p.in_stock ? "In stock" : "Out of stock"}
                  {p.featured ? " · Featured" : ""}
                </p>
              </div>
              <span className="text-gold-300">
                {formatGHS(p.selling_price)}
              </span>
              <div className="flex gap-2">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="rounded-full border border-gold-500/30 px-4 py-1.5 text-sm text-ivory/80 hover:border-gold-400"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="rounded-full border border-red-400/30 px-4 py-1.5 text-sm text-red-300 hover:bg-red-950/30"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
