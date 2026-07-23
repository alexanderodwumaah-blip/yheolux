"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatGHS } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="text-5xl">🛍️</p>
        <h1 className="mt-4 font-display text-2xl text-ivory">
          Your bag is empty
        </h1>
        <p className="mt-2 text-ivory/60">
          Browse the collection and add something you love.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-gold-500 px-6 py-3 font-semibold text-emerald-950 transition-transform hover:scale-105"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 animate-fadeUp">
      <h1 className="font-display text-3xl text-ivory">Your Bag</h1>

      <div className="mt-8 divide-y divide-gold-500/10 rounded-2xl border border-gold-500/15 bg-emerald-950/50">
        {items.map((item) => (
          <div
            key={item.product_id}
            className="flex items-center gap-4 p-4 sm:p-5"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-emerald-900">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-display text-ivory">{item.name}</p>
              <p className="text-sm text-gold-300">
                {formatGHS(item.selling_price)}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center overflow-hidden rounded-full border border-gold-500/30">
                  <button
                    onClick={() => updateQty(item.product_id, item.qty - 1)}
                    className="px-2.5 py-1 text-ivory hover:bg-emerald-800"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm text-ivory">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item.product_id, item.qty + 1)}
                    className="px-2.5 py-1 text-ivory hover:bg-emerald-800"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="text-xs text-ivory/40 underline hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="font-semibold text-ivory">
              {formatGHS(item.selling_price * item.qty)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-gold-500/15 bg-emerald-950/50 px-5 py-4">
        <span className="text-ivory/70">Total</span>
        <span className="font-display text-xl text-gold-300">
          {formatGHS(total)}
        </span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block rounded-full bg-gold-500 px-6 py-3 text-center font-semibold text-emerald-950 shadow-lg transition-transform hover:scale-105"
      >
        Proceed to Order
      </Link>
    </div>
  );
}
