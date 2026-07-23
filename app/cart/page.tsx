"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatGHS } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-32 text-center sm:px-6 animate-fadeUp">
        <div className="coin-badge mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full text-4xl">
          🛍️
        </div>
        <h1 className="font-display text-3xl text-ivory">Your bag is empty</h1>
        <p className="mt-3 text-ivory/50">
          Discover something beautiful in the collection.
        </p>
        <Link
          href="/"
          className="btn-gold mt-8 inline-block rounded-full px-8 py-3.5 font-semibold text-emerald-950"
        >
          Browse the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 animate-fadeUp">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ivory">Your Bag</h1>
        <span className="rounded-full border border-gold-600/30 bg-gold-600/10 px-3 py-1 text-sm text-gold-400">
          {items.reduce((s, i) => s + i.qty, 0)} item{items.reduce((s, i) => s + i.qty, 0) !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Items */}
      <div className="glass-panel divide-y divide-gold-600/10 rounded-2xl">
        {items.map((item, idx) => (
          <div
            key={item.product_id}
            className="flex items-center gap-4 p-4 sm:p-5 animate-fadeUp"
            style={{ animationDelay: `${idx * 0.06}s` }}
          >
            <Link href={`/product/${item.product_id}`}>
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gold-600/15 transition-transform hover:scale-105">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <p className="truncate font-display text-sm text-ivory sm:text-base">{item.name}</p>
              <p className="mt-0.5 text-sm font-semibold text-gold-400">{formatGHS(item.selling_price)}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center overflow-hidden rounded-full border border-gold-600/25 bg-emerald-900/40">
                  <button
                    onClick={() => updateQty(item.product_id, item.qty - 1)}
                    className="w-8 py-1.5 text-center text-sm text-ivory hover:bg-gold-600/20"
                  >−</button>
                  <span className="w-7 text-center text-sm font-semibold text-ivory">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.product_id, item.qty + 1)}
                    className="w-8 py-1.5 text-center text-sm text-ivory hover:bg-gold-600/20"
                  >+</button>
                </div>
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="text-xs text-ivory/30 underline underline-offset-2 transition-colors hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="shrink-0 font-semibold text-ivory">
              {formatGHS(item.selling_price * item.qty)}
            </p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-5 flex items-center justify-between rounded-2xl border border-gold-500/20 bg-gold-600/5 px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-ivory/50">Total</p>
          <p className="font-display text-2xl text-gold-400">{formatGHS(total)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-xs text-ivory/40">No card needed</p>
          <p className="text-xs text-gold-500">✓ Free delivery</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="flex-1 rounded-full border border-gold-600/40 px-6 py-3.5 text-center text-sm font-semibold text-ivory/70 transition-colors hover:border-gold-500 hover:text-gold-400"
        >
          ← Continue Shopping
        </Link>
        <Link
          href="/checkout"
          className="btn-gold flex-1 rounded-full px-6 py-3.5 text-center font-semibold text-emerald-950"
        >
          Proceed to Order →
        </Link>
      </div>
    </div>
  );
}
