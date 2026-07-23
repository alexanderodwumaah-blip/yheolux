"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/types";
import { formatGHS } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "delivered">(
    "all"
  );

  async function loadOrders() {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders((data as Order[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function toggleField(
    order: Order,
    field: "payment_made" | "delivered"
  ) {
    const newValue = !order[field];
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, [field]: newValue } : o))
    );
    await supabase
      .from("orders")
      .update({ [field]: newValue })
      .eq("id", order.id);
  }

  const filtered = orders.filter((o) => {
    if (filter === "pending") return !o.delivered;
    if (filter === "delivered") return o.delivered;
    return true;
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-ivory">Orders</h1>
        <div className="flex gap-2 text-sm">
          {(["all", "pending", "delivered"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 capitalize transition-colors ${
                filter === f
                  ? "bg-gold-500 text-emerald-950"
                  : "border border-gold-500/30 text-ivory/70 hover:border-gold-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-ivory/50">Loading orders…</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-gold-500/15 bg-emerald-950/50 p-10 text-center text-ivory/60">
          No orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-gold-500/15 bg-emerald-950/50 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg text-ivory">
                    {order.buyer_name}{" "}
                    <span className="text-sm font-normal text-ivory/40">
                      · {order.buyer_phone}
                    </span>
                  </p>
                  <p className="text-xs text-ivory/40">
                    #{order.id.slice(0, 8).toUpperCase()} ·{" "}
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="rounded-full bg-gold-500/10 px-3 py-1 text-sm text-gold-300">
                  {formatGHS(order.total)}
                </span>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-ivory/70">
                {order.items.map((it, i) => (
                  <li key={i}>
                    {it.name} × {it.qty} — {formatGHS(it.selling_price * it.qty)}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ivory/60">
                <span>📍 {order.delivery_location}</span>
                <span>
                  💳{" "}
                  {order.payment_option === "preorder"
                    ? "Preorder"
                    : "Pay on delivery"}
                </span>
                <span>
                  {order.contact_method === "whatsapp" ? "💬 WhatsApp" : "📞 Call"}
                </span>
              </div>

              {order.notes && (
                <p className="mt-2 text-sm italic text-ivory/50">
                  Note: {order.notes}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <label className="flex items-center gap-2 text-sm text-ivory/80">
                  <input
                    type="checkbox"
                    checked={order.payment_made}
                    onChange={() => toggleField(order, "payment_made")}
                    className="h-4 w-4 accent-gold-500"
                  />
                  Payment made
                </label>
                <label className="flex items-center gap-2 text-sm text-ivory/80">
                  <input
                    type="checkbox"
                    checked={order.delivered}
                    onChange={() => toggleField(order, "delivered")}
                    className="h-4 w-4 accent-gold-500"
                  />
                  Delivered
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
