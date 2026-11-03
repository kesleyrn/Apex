import Link from "next/link";
import { shopHref, type ShopParams } from "@/lib/shop";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

export function CategoryPills({ categories, active, params }: { categories: Pick<Category, "id" | "name" | "slug">[]; active?: string; params: ShopParams }) {
  const pill = "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors";
  const on = "border-brand bg-brand text-white";
  const off = "border-line hover:border-brand hover:text-brand";
  return (
    <nav aria-label="Product categories" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      <Link href={shopHref({ q: params.q, sort: params.sort })} aria-current={!active ? "page" : undefined} className={cn(pill, !active ? on : off)}>
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={shopHref({ category: c.slug, q: params.q, sort: params.sort })}
          aria-current={active === c.slug ? "page" : undefined}
          className={cn(pill, active === c.slug ? on : off)}
        >
          {c.name}
        </Link>
      ))}
    </nav>
  );
}
