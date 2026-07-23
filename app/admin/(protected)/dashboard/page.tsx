"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/types";
import { formatGHS } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<"all" | "pending" | "delivered">("all");

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as Order[]) || []);
    setLoading(false);
  }

  async function toggleField(order: Order, field: "payment_made" | "delivered") {
    const newValue = !order[field];
    setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, [field]: newValue } : o));
    await supabase.from("orders").update({ [field]: newValue }).eq("id", order.id);
  }

  const filtered = orders.filter((o) => {
    if (filter === "pending")   return !o.delivered;
    if (filter === "delivered") return o.delivered;
    return true;
  });

  const stats = {
    total:     orders.length,
    pending:   orders.filter((o) => !o.delivered).length,
    delivered: orders.filter((o) => o.delivered).length,
    revenue:   orders.filter((o) => o.payment_made).reduce((s, o) => s + o.total, 0),
  };

  return (
    <div>
      <h1 className="mb-5 font-display text-2xl text-ivory sm:text-3xl">Orders</h1>

      {/* Stats strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total",     value: stats.total,              color: "text-ivory" },
          { label: "Pending",   value: stats.pending,            color: "text-gold-400" },
          { label: "Delivered", value: stats.delivered,          color: "text-emerald-400" },
          { label: "Revenue",   value: formatGHS(stats.revenue), color: "text-gold-300" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-gold-600/15 bg-emerald-900/30 p-4">
            <p className="text-[10px] uppercase tracking-widest text-ivory/40">{s.label}</p>
            <p className={`mt-1 font-display text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="mb-5 flex gap-2">
        {(["all", "pending", "delivered"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all duration-200 ${
              filter === f
                ? "bg-gold-600 text-emerald-950 shadow-[0_0_10px_rgba(201,162,39,0.3)]"
                : "border border-gold-600/25 text-ivory/60 hover:border-gold-500 hover:text-ivory"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-emerald-900/40" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gold-600/15 bg-emerald-900/30 p-12 text-center">
          <p className="text-3xl">📭</p>
          <p className="mt-3 text-ivory/50">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="glass-panel rounded-2xl p-4 sm:p-5">
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display text-base text-ivory sm:text-lg">
                    {order.buyer_name}
                  </p>
                  <p className="mt-0.5 text-xs text-ivory/40">
                    #{order.id.slice(0, 8).toUpperCase()} · {new Date(order.created_at).toLocaleDateString()} · {order.buyer_phone}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  order.delivered
                    ? "bg-emerald-800/50 text-emerald-300"
                    : "bg-gold-600/15 text-gold-300"
                }`}>
                  {formatGHS(order.total)}
                </span>
              </div>

              {/* Items */}
              <ul className="mt-3 space-y-1 text-sm text-ivory/65">
                {order.items.map((it, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{it.name} × {it.qty}</span>
                    <span className="text-ivory/40">{formatGHS(it.selling_price * it.qty)}</span>
                  </li>
                ))}
              </ul>

              {/* Meta */}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ivory/50">
                <span>📍 {order.delivery_location}</span>
                <span>💳 {order.payment_option === "preorder" ? "Preorder" : "Pay on delivery"}</span>
                <span>{order.contact_method === "whatsapp" ? "💬 WhatsApp" : "📞 Call"}</span>
              </div>

              {order.notes && (
                <p className="mt-2 text-xs italic text-ivory/40">Note: {order.notes}</p>
              )}

              {/* Toggles */}
              <div className="mt-4 flex flex-wrap gap-4 border-t border-gold-600/10 pt-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-ivory/70">
                  <input
                    type="checkbox"
                    checked={order.payment_made}
                    onChange={() => toggleField(order, "payment_made")}
                    className="h-4 w-4 accent-gold-600 cursor-pointer"
                  />
                  Payment received
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-ivory/70">
                  <input
                    type="checkbox"
                    checked={order.delivered}
                    onChange={() => toggleField(order, "delivered")}
                    className="h-4 w-4 accent-emerald-400 cursor-pointer"
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
