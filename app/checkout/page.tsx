"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/lib/cart-context";
import { DeliveryLocation } from "@/lib/types";
import {
  buildOrderMessage,
  formatGHS,
  telLink,
  whatsappLink,
} from "@/lib/utils";

type PaymentOption = "preorder" | "pay_on_delivery";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();

  const [locations, setLocations] = useState<DeliveryLocation[]>([]);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [paymentOption, setPaymentOption] = useState<PaymentOption>(
    "pay_on_delivery"
  );
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState<"whatsapp" | "call" | null>(
    null
  );
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    supabase
      .from("delivery_locations")
      .select("*")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => {
        const locs = (data as DeliveryLocation[]) || [];
        setLocations(locs);
        if (locs[0]) setDeliveryLocation(locs[0].name);
      });
  }, []);

  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <p className="text-ivory/70">Your bag is empty.</p>
        <Link href="/" className="mt-4 inline-block text-gold-400 underline">
          Back to shop
        </Link>
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
          items: items,
          total,
          notes: notes.trim() || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const sellerPhone =
        items[0]?.seller_phone ||
        process.env.NEXT_PUBLIC_DEFAULT_SELLER_PHONE ||
        "";
      const message = buildOrderMessage({
        buyerName: buyerName.trim(),
        items,
        deliveryLocation,
        paymentOption,
        total,
        orderId: data?.id,
      });

      setPlaced(true);
      clear();

      if (method === "whatsapp") {
        window.open(whatsappLink(sellerPhone, message), "_blank");
      } else {
        window.location.href = telLink(sellerPhone);
      }
    } catch (err: any) {
      setError(
        err?.message ||
          "Something went wrong placing your order. Please try again."
      );
    } finally {
      setSubmitting(null);
    }
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6 animate-fadeUp">
        <div className="coin-badge mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl">
          ✓
        </div>
        <h1 className="mt-6 font-display text-2xl text-ivory">
          Order received!
        </h1>
        <p className="mt-2 text-ivory/60">
          We&apos;ve sent you to confirm with the seller. If nothing opened,
          use the button below.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-gold-500 px-6 py-3 font-semibold text-emerald-950 transition-transform hover:scale-105"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 animate-fadeUp">
      <h1 className="font-display text-3xl text-ivory">
        Complete Your Order
      </h1>
      <p className="mt-2 text-ivory/60">
        No card needed. Confirm the details below, then reach the seller on
        WhatsApp or by phone.
      </p>

      <div className="mt-8 rounded-2xl border border-gold-500/15 bg-emerald-950/50 p-5">
        <h2 className="text-sm uppercase tracking-widest text-gold-400">
          Order Summary
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-ivory/80">
          {items.map((item) => (
            <li key={item.product_id} className="flex justify-between">
              <span>
                {item.name} × {item.qty}
              </span>
              <span>{formatGHS(item.selling_price * item.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="gold-divider my-3" />
        <div className="flex justify-between font-semibold text-gold-300">
          <span>Total</span>
          <span>{formatGHS(total)}</span>
        </div>
      </div>

      <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="mb-1 block text-sm text-ivory/70">
            Full name
          </label>
          <input
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="w-full rounded-lg border border-gold-500/30 bg-emerald-950/60 px-4 py-2.5 text-ivory placeholder:text-ivory/30 focus:border-gold-400"
            placeholder="e.g. Ama Serwaa"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ivory/70">
            Phone number
          </label>
          <input
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
            className="w-full rounded-lg border border-gold-500/30 bg-emerald-950/60 px-4 py-2.5 text-ivory placeholder:text-ivory/30 focus:border-gold-400"
            placeholder="e.g. 024 123 4567"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ivory/70">
            Pickup / delivery point
          </label>
          <select
            value={deliveryLocation}
            onChange={(e) => setDeliveryLocation(e.target.value)}
            className="w-full rounded-lg border border-gold-500/30 bg-emerald-950/60 px-4 py-2.5 text-ivory focus:border-gold-400"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-ivory/40">No delivery fee.</p>
        </div>

        <div>
          <span className="mb-2 block text-sm text-ivory/70">
            Payment preference
          </span>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { value: "pay_on_delivery", label: "Pay on Delivery" },
                { value: "preorder", label: "Preorder (Pay Before)" },
              ] as { value: PaymentOption; label: string }[]
            ).map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setPaymentOption(opt.value)}
                className={`rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                  paymentOption === opt.value
                    ? "border-gold-400 bg-gold-500/10 text-gold-300"
                    : "border-gold-500/20 text-ivory/60 hover:border-gold-500/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-ivory/70">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gold-500/30 bg-emerald-950/60 px-4 py-2.5 text-ivory placeholder:text-ivory/30 focus:border-gold-400"
            placeholder="Anything the seller should know"
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => placeOrder("whatsapp")}
            disabled={!!submitting}
            className="rounded-full bg-gold-500 px-6 py-3 font-semibold text-emerald-950 shadow-lg transition-transform hover:scale-105 disabled:opacity-60"
          >
            {submitting === "whatsapp" ? "Placing…" : "Order via WhatsApp"}
          </button>
          <button
            type="button"
            onClick={() => placeOrder("call")}
            disabled={!!submitting}
            className="rounded-full border border-gold-500/50 px-6 py-3 font-semibold text-gold-300 transition-colors hover:bg-gold-500/10 disabled:opacity-60"
          >
            {submitting === "call" ? "Placing…" : "Call Seller"}
          </button>
        </div>
      </form>
    </div>
  );
}
