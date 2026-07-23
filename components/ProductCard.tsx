import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatGHS } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    product.original_price && product.original_price > product.selling_price;
  const image = product.images[0] || "/icons/icon-512.png";
  const extraImages = product.images.slice(1, 3);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gold-600/15 bg-emerald-950/70
        transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40
        hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7),0_0_0_1px_rgba(201,162,39,0.3),0_0_40px_rgba(201,162,39,0.06)]"
    >
      {/* Main image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-emerald-900">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent
          opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="luxury-badge rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-950">
              Sale
            </span>
          )}
          {product.featured && (
            <span className="rounded-full border border-gold-500/50 bg-emerald-950/80 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-gold-400">
              ★ Featured
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {!product.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/75 backdrop-blur-sm">
            <span className="rounded-full border border-ivory/20 px-4 py-1.5 text-xs uppercase tracking-widest text-ivory/80">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover mini-gallery strip */}
        {extraImages.length > 0 && (
          <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 transition-all duration-500 group-hover:opacity-100
            translate-y-2 group-hover:translate-y-0">
            {extraImages.map((img, i) => (
              <div key={i} className="relative h-10 w-10 overflow-hidden rounded-lg border border-gold-500/50 shadow-lg">
                <Image src={img} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Quick view hint */}
        <div className="absolute bottom-3 left-3 opacity-0 transition-all duration-500 group-hover:opacity-100
          translate-y-2 group-hover:translate-y-0">
          <span className="rounded-full bg-gold-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-950">
            View Details →
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-[10px] uppercase tracking-widest text-gold-500/70">
          {product.category}
        </span>
        <h3 className="font-display text-sm leading-snug text-ivory sm:text-base">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center gap-2 pt-3">
          <span className="text-base font-semibold text-gold-400 sm:text-lg">
            {formatGHS(product.selling_price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-ivory/35 line-through sm:text-sm">
              {formatGHS(product.original_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
