"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/lib/cart-context";
import { DeliveryLocation } from "@/lib/types";
import { buildOrderMessage, formatGHS, telLink, whatsappLink } from "@/lib/utils";

type PaymentOption = "preorder" | "pay_on_delivery";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();

  const [locations, setLocations]             = useState<DeliveryLocation[]>([]);
  const [buyerName, setBuyerName]             = useState("");
  const [buyerPhone, setBuyerPhone]           = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [paymentOption, setPaymentOption]     = useState<PaymentOption>("pay_on_delivery");
  const [notes, setNotes]                     = useState("");
  const [submitting, setSubmitting]           = useState<"whatsapp" | "call" | null>(null);
  const [error, setError]                     = useState("");
  const [placed, setPlaced]                   = useState(false);
  const [orderId, setOrderId]                 = useState("");

  useEffect(() => {
    supabase.from("delivery_locations").select("*").eq("active", true).order("sort_order")
      .then(({ data }) => {
        const locs = (data as DeliveryLocation[]) || [];
        setLocations(locs);
        if (locs[0]) setDeliveryLocation(locs[0].name);
      });
  }, []);

  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-32 text-center sm:px-6 animate-fadeUp">
        <p className="text-4xl">🛍️</p>
        <p className="mt-4 text-ivory/60">Your bag is empty.</p>
        <Link href="/" className="mt-4 inline-block text-gold-500 underline">Back to shop</Link>
      </div>
    );
  }

  async function placeOrder(method: "whatsapp" | "call") {
    setError("");
    if (!buyerName.trim() || !buyerPhone.trim() || !deliveryLocation) {
      setError("Please fill in your name, phone number, and pickup point.");
      return;
    }
    setSubmitting(method);
    try {
      const { data, error: insertError } = await supabase
        .from("orders")
        .insert({
          buyer_name: buyerName.trim(),
          buyer_phone: buyerPhone.trim(),
          delivery_location: deliveryLocation,
          payment_option: paymentOption,
          contact_method: method,
          items,
          total,
          notes: notes.trim() || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const sellerPhone =
        items[0]?.seller_phone ||
        process.env.NEXT_PUBLIC_DEFAULT_SELLER_PHONE || "";

      const message = buildOrderMessage({
        buyerName: buyerName.trim(),
        items,
        deliveryLocation,
        paymentOption,
        total,
        orderId: data?.id,
      });

      setOrderId(data?.id?.slice(0, 8).toUpperCase() || "");
      setPlaced(true);
      clear();

      if (method === "whatsapp") {
        window.open(whatsappLink(sellerPhone, message), "_blank");
      } else {
        window.location.href = telLink(sellerPhone);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong placing your order.";
      setError(msg);
    } finally {
      setSubmitting(null);
    }
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6 animate-scaleIn">
        <div className="coin-badge animate-pulseGlow mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl">
          ✓
        </div>
        <h1 className="mt-6 font-display text-3xl text-ivory">Order Placed!</h1>
        <p className="mt-2 text-sm text-gold-500">Ref: #{orderId}</p>
        <p className="mt-4 text-ivory/60">
          You&apos;ve been redirected to confirm with the seller. If nothing
          opened, tap below.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link href="/" className="btn-gold rounded-full px-8 py-3.5 font-semibold text-emerald-950">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 animate-fadeUp">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-gold-500">Final Step</p>
        <h1 className="mt-1 font-display text-3xl text-ivory">Complete Your Order</h1>
        <p className="mt-2 text-sm text-ivory/50">
          No card needed — confirm with the seller on WhatsApp or by phone.
        </p>
      </div>

      {/* Order summary */}
      <div className="glass-panel mb-8 rounded-2xl p-5">
        <p className="mb-3 text-xs uppercase tracking-widest text-gold-500">Order Summary</p>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.product_id} className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gold-600/15">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm text-ivory">{item.name}</p>
                <p className="text-xs text-ivory/50">× {item.qty}</p>
              </div>
              <span className="text-sm font-semibold text-gold-400">
                {formatGHS(item.selling_price * item.qty)}
              </span>
            </div>
          ))}
        </div>
        <div className="gold-divider my-4" />
        <div className="flex justify-between">
          <span className="font-semibold text-ivory/70">Total</span>
          <span className="font-display text-xl font-semibold text-gold-400">{formatGHS(total)}</span>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-ivory/50">
              Full Name *
            </label>
            <input
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="e.g. Ama Serwaa"
              className="w-full rounded-xl border border-gold-600/25 bg-emerald-900/40 px-4 py-3 text-ivory placeholder:text-ivory/25 focus:border-gold-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-ivory/50">
              Phone Number *
            </label>
            <input
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              placeholder="024 123 4567"
              className="w-full rounded-xl border border-gold-600/25 bg-emerald-900/40 px-4 py-3 text-ivory placeholder:text-ivory/25 focus:border-gold-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-ivory/50">
            Pickup / Delivery Point *
          </label>
          <select
            value={deliveryLocation}
            onChange={(e) => setDeliveryLocation(e.target.value)}
            className="w-full rounded-xl border border-gold-600/25 bg-emerald-900/40 px-4 py-3 text-ivory focus:border-gold-500 focus:outline-none transition-colors"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.name}>{loc.name}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gold-500/70">✓ No delivery fee</p>
        </div>

        {/* Payment */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-wider text-ivory/50">
            Payment Preference
          </label>
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: "pay_on_delivery", label: "Pay on Delivery", icon: "📦" },
              { value: "preorder",        label: "Pay Before",      icon: "💳" },
            ] as { value: PaymentOption; label: string; icon: string }[]).map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setPaymentOption(opt.value)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                  paymentOption === opt.value
                    ? "border-gold-500 bg-gold-600/15 text-gold-300 shadow-[0_0_12px_rgba(201,162,39,0.15)]"
                    : "border-gold-600/20 text-ivory/50 hover:border-gold-600/40 hover:text-ivory/70"
                }`}
              >
                <span>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-ivory/50">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Anything the seller should know…"
            className="w-full rounded-xl border border-gold-600/25 bg-emerald-900/40 px-4 py-3 text-ivory placeholder:text-ivory/25 focus:border-gold-500 focus:outline-none transition-colors"
          />
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-950/20 px-4 py-3">
            <span className="text-red-400">⚠</span>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Submit */}
        <div className="grid gap-3 pt-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => placeOrder("whatsapp")}
            disabled={!!submitting}
            className="btn-gold flex items-center justify-center gap-2 rounded-full py-4 font-semibold text-emerald-950 disabled:opacity-60"
          >
            <span className="text-lg">💬</span>
            {submitting === "whatsapp" ? "Placing…" : "Order via WhatsApp"}
          </button>
          <button
            type="button"
            onClick={() => placeOrder("call")}
            disabled={!!submitting}
            className="flex items-center justify-center gap-2 rounded-full border border-gold-600/50 py-4 font-semibold text-gold-400 transition-colors hover:bg-gold-600/10 disabled:opacity-60"
          >
            <span className="text-lg">📞</span>
            {submitting === "call" ? "Placing…" : "Call Seller"}
          </button>
        </div>
      </form>
    </div>
  );
}
