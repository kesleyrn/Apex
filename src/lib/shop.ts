import { SORT_OPTIONS, type SortValue } from "@/lib/constants";

export type ShopParams = { category?: string; q: string; sort: SortValue; page: number };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Reads and sanitises the shop URL. Anything invalid falls back to a safe default. */
export function parseShopParams(sp: Record<string, string | string[] | undefined>): ShopParams {
  const category = first(sp.category) ?? "";
  const sort = first(sp.sort) ?? "";
  return {
    category: /^[a-z0-9]+(-[a-z0-9]+)*$/.test(category) ? category : undefined,
    q: (first(sp.q) ?? "").trim().slice(0, 100),
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortValue) : "newest",
    page: Math.min(1000, Math.max(1, Number.parseInt(first(sp.page) ?? "1", 10) || 1)),
  };
}

/** Builds a shop URL. Defaults are left out and page is only included when above 1. */
export function shopHref(p: Partial<ShopParams>): string {
  const params = new URLSearchParams();
  if (p.category) params.set("category", p.category);
  if (p.q) params.set("q", p.q);
  if (p.sort && p.sort !== "newest") params.set("sort", p.sort);
  if (p.page && p.page > 1) params.set("page", String(p.page));
  const s = params.toString();
  return `/shop${s ? `?${s}` : ""}`;
}
