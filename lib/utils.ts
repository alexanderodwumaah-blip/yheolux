import { CartItem } from "./types";

export function formatGHS(amount: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Strip everything but digits — WhatsApp/tel links need a bare number. */
export function cleanPhone(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

export function buildOrderMessage(opts: {
  buyerName: string;
  items: CartItem[];
  deliveryLocation: string;
  paymentOption: "preorder" | "pay_on_delivery";
  total: number;
  orderId?: string;
}): string {
  const { buyerName, items, deliveryLocation, paymentOption, total, orderId } = opts;
  const lines = [
    `Hello! I'd like to place an order on YHEOLUX.`,
    ``,
    `Name: ${buyerName}`,
    orderId ? `Order Ref: ${orderId.slice(0, 8).toUpperCase()}` : undefined,
    ``,
    `Items:`,
    ...items.map(
      (it) => `- ${it.name} x${it.qty} — ${formatGHS(it.selling_price * it.qty)}`
    ),
    ``,
    `Total: ${formatGHS(total)}`,
    `Delivery / Pickup: ${deliveryLocation}`,
    `Payment: ${paymentOption === "preorder" ? "Preorder (pay before receiving)" : "Pay on delivery"}`,
    ``,
    `Please confirm and share payment details. Thank you!`,
  ].filter(Boolean);
  return lines.join("\n");
}

export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(message)}`;
}

export function telLink(phone: string): string {
  return `tel:+${cleanPhone(phone)}`;
}
