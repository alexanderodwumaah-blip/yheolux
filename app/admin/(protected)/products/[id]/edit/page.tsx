"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setProduct(data as Product);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-ivory/50">Loading…</p>;
  if (!product) return <p className="text-ivory/50">Product not found.</p>;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ivory">
        Edit Product
      </h1>
      <ProductForm initial={product} productId={product.id} />
    </div>
  );
}
