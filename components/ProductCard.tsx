import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatGHS } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    product.original_price && product.original_price > product.selling_price;
  const image = product.images[0] || "/icons/icon-512.png";

  return (
    <Link
      href={`/product/${product.id}`}
      className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-gold-500/15 bg-emerald-950/60"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-emerald-900">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-950">
            Sale
          </span>
        )}
        {!product.in_stock && (
          <span className="absolute inset-0 flex items-center justify-center bg-emerald-950/70 text-sm uppercase tracking-widest text-ivory">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs uppercase tracking-widest text-gold-400/80">
          {product.main_category} · {product.category}
        </span>
        <h3 className="font-display text-base leading-snug text-ivory">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className="text-lg font-semibold text-gold-300">
            {formatGHS(product.selling_price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-ivory/40 line-through">
              {formatGHS(product.original_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
