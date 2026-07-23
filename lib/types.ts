export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  original_price: number | null;
  selling_price: number;
  seller_phone: string;
  images: string[];
  in_stock: boolean;
  featured: boolean;
  created_at: string;
};

export type DeliveryLocation = {
  id: string;
  name: string;
  active: boolean;
  sort_order: number;
};

export type CartItem = {
  product_id: string;
  name: string;
  selling_price: number;
  image: string;
  seller_phone: string;
  qty: number;
};

export type Order = {
  id: string;
  buyer_name: string;
  buyer_phone: string;
  delivery_location: string;
  payment_option: "preorder" | "pay_on_delivery";
  contact_method: "whatsapp" | "call";
  items: CartItem[];
  total: number;
  payment_made: boolean;
  delivered: boolean;
  notes: string | null;
  created_at: string;
};
