import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({ page, totalPages, hrefFor }: { page: number; totalPages: number; hrefFor: (page: number) => string }) {
  if (totalPages <= 1) return null;

  const wanted = [...new Set([1, page - 1, page, page + 1, totalPages])].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const items: (number | "gap")[] = [];
  wanted.forEach((p, i) => {
    const prev = wanted[i - 1];
    if (prev !== undefined && p - prev > 1) items.push("gap");
    items.push(p);
  });

  const box = "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm";
  return (
    <nav aria-label="Pagination" className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={cn(box, "border-line hover:border-brand")} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : null}
      {items.map((it, i) =>
        it === "gap" ? (
          <span key={`g${i}`} className="px-1 text-charcoal-soft">…</span>
        ) : (
          <Link
            key={it}
            href={hrefFor(it)}
            aria-current={it === page ? "page" : undefined}
            className={cn(box, it === page ? "border-brand bg-brand text-white" : "border-line hover:border-brand")}
          >
            {it}
          </Link>
        ),
      )}
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={cn(box, "border-line hover:border-brand")} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </nav>
  );
}
