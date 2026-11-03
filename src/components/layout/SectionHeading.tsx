import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow, title, intro, href, hrefLabel = "View all", align = "left", className,
}: { eyebrow?: string; title: string; intro?: string; href?: string; hrefLabel?: string; align?: "left" | "center"; className?: string }) {
  return (
    <div className={cn("mb-10 flex flex-wrap items-end justify-between gap-4", align === "center" && "justify-center text-center", className)}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand">{eyebrow}</p>}
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {intro && <p className="mt-3 text-charcoal-soft">{intro}</p>}
      </div>
      {href && align === "left" && (
        <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
          {hrefLabel} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
