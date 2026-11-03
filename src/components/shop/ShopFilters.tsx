"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { SORT_OPTIONS, type SortValue } from "@/lib/constants";

/** A plain GET form: submitting never includes `page`, so pagination resets whenever search or sort changes. */
export function ShopFilters({ q, sort, category }: { q: string; sort: SortValue; category?: string }) {
  return (
    <form action="/shop" method="get" role="search" className="flex flex-wrap gap-3">
      {category && <input type="hidden" name="category" value={category} />}
      <div className="relative min-w-56 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-soft" aria-hidden />
        <Input name="q" type="search" defaultValue={q} placeholder="Search products by name" aria-label="Search products" className="pl-9" />
      </div>
      <Select
        name="sort"
        defaultValue={sort}
        aria-label="Sort products"
        className="w-auto min-w-48"
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
      >
        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </Select>
      <Button type="submit">Search</Button>
    </form>
  );
}
