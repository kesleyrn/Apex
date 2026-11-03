import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import { formatRWF } from "@/lib/utils";
import type { ProductCardData } from "@/types";
import { WhatsAppOrderButton } from "./WhatsAppOrderButton";

export function ProductCard({ product, priority = false }: { product: ProductCardData; priority?: boolean }) {
  const href = `/shop/${product.slug}`;
  const price = formatRWF(product.price);
  const inStock = product.availability === "in_stock";

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white transition-shadow hover:shadow-md">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden bg-[#F4F2EF]" aria-label={product.name}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-charcoal-soft"><ImageOff className="h-8 w-8" aria-hidden /></span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs font-medium uppercase tracking-wider text-brand">{product.category?.name ?? "Home furnishing"}</p>
          <Badge tone={inStock ? "neutral" : "muted"}>{inStock ? "In stock" : "Out of stock"}</Badge>
        </div>
        <h3 className="mt-2 line-clamp-2 min-h-[2.75rem] font-semibold leading-snug">
          <Link href={href} className="hover:text-brand">{product.name}</Link>
        </h3>
        <p className="mt-1 text-sm font-medium text-charcoal">{price ?? <span className="font-normal text-charcoal-soft">Price on request</span>}</p>

        <div className="mt-4 grid gap-2">
          <Link href={href} className={buttonStyles("outline", "sm")}>View Details</Link>
          <WhatsAppOrderButton
            details={{ name: product.name, code: product.product_code, category: product.category?.name ?? "Home furnishing", quantity: 1, price: product.price }}
          />
        </div>
      </div>
    </article>
  );
}
