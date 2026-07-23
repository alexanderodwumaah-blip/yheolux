"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import ImageUploader from "@/components/ImageUploader";

type Props = {
  initial?: Partial<Product>;
  productId?: string;
};

export default function ProductForm({ initial, productId }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name || "");
  const [category, setCategory] = useState(initial?.category || "General");
  const [description, setDescription] = useState(initial?.description || "");
  const [originalPrice, setOriginalPrice] = useState(
    initial?.original_price?.toString() || ""
  );
  const [sellingPrice, setSellingPrice] = useState(
    initial?.selling_price?.toString() || ""
  );
  const [sellerPhone, setSellerPhone] = useState(initial?.seller_phone || "");
  const [images, setImages] = useState<string[]>(initial?.images || []);
  const [inStock, setInStock] = useState(initial?.in_stock ?? true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !sellingPrice || !sellerPhone.trim()) {
      setError("Name, selling price, and seller phone are required.");
      return;
    }

    setSaving(true);
    const payload = {
      name: name.trim(),
      category: category.trim() || "General",
      description: description.trim(),
      original_price: originalPrice ? Number(originalPrice) : null,
      selling_price: Number(sellingPrice),
      seller_phone: sellerPhone.trim(),
      images,
      in_stock: inStock,
      featured,
    };

    const query = productId
      ? supabase.from("products").update(payload).eq("id", productId)
      : supabase.from("products").insert(payload);

    const { error: saveError } = await query;
    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }
    router.push("/admin/products");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm text-ivory/70">
          Product name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gold-500/30 bg-emerald-950/60 px-4 py-2.5 text-ivory focus:border-gold-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-ivory/70">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-gold-500/30 bg-emerald-950/60 px-4 py-2.5 text-ivory focus:border-gold-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-ivory/70">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-gold-500/30 bg-emerald-950/60 px-4 py-2.5 text-ivory focus:border-gold-400"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-ivory/70">
            Original price{" "}
            <span className="text-ivory/40">(optional, shown struck-through)</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="w-full rounded-lg border border-gold-500/30 bg-emerald-950/60 px-4 py-2.5 text-ivory focus:border-gold-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ivory/70">
            Selling price (GHS)
          </label>
          <input
            type="number"
            step="0.01"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            className="w-full rounded-lg border border-gold-500/30 bg-emerald-950/60 px-4 py-2.5 text-ivory focus:border-gold-400"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-ivory/70">
          Seller phone (WhatsApp / call number for this product's orders)
        </label>
        <input
          value={sellerPhone}
          onChange={(e) => setSellerPhone(e.target.value)}
          placeholder="233241234567"
          className="w-full rounded-lg border border-gold-500/30 bg-emerald-950/60 px-4 py-2.5 text-ivory focus:border-gold-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-ivory/70">
          Product photos
        </label>
        <ImageUploader images={images} onChange={setImages} max={4} />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-ivory/80">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="h-4 w-4 accent-gold-500"
          />
          In stock
        </label>
        <label className="flex items-center gap-2 text-sm text-ivory/80">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 accent-gold-500"
          />
          Featured
        </label>
      </div>

      {error && (
        <p className="rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-gold-500 px-6 py-3 font-semibold text-emerald-950 shadow-lg transition-transform hover:scale-105 disabled:opacity-60"
      >
        {saving ? "Saving…" : productId ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}
