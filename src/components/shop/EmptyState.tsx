import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";

export function EmptyState({ filtered, failed }: { filtered: boolean; failed: boolean }) {
  return (
    <div className="rounded-lg border border-dashed border-line px-6 py-16 text-center">
      <SearchX className="mx-auto h-10 w-10 text-charcoal-soft" aria-hidden />
      <h2 className="mt-4 text-lg font-semibold">
        {failed ? "We could not load the products" : filtered ? "No products match your search" : "No products yet"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-charcoal-soft">
        {failed
          ? "Please refresh the page in a moment."
          : filtered
            ? "Try a different word, another category, or clear the filters."
            : "New products are coming soon. You can also message us on WhatsApp."}
      </p>
      {filtered && <Link href="/shop" className={`${buttonStyles("outline", "md")} mt-6`}>Clear filters</Link>}
    </div>
  );
}
