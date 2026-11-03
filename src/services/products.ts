import { cache } from "react";
import { PAGE_SIZE, type SortValue } from "@/lib/constants";
import { createPublicClient } from "@/lib/supabase/public";
import { escapeLike } from "@/lib/utils";
import type { ProductCardData, ProductWithCategory } from "@/types";

const CARD_COLUMNS = "id, slug, name, product_code, price, image_url, availability, category:categories(name, slug)";

function logError(scope: string, e: unknown) {
  console.error(`[products:${scope}]`, e instanceof Error ? e.message : e);
}

/** Latest published products, newest first. */
export async function getNewArrivals(limit = 8): Promise<ProductCardData[]> {
  try {
    const { data, error } = await createPublicClient()
      .from("products").select(CARD_COLUMNS).eq("status", "published").order("created_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as ProductCardData[];
  } catch (e) {
    logError("new-arrivals", e);
    return [];
  }
}

/** Published products an administrator marked as featured. */
export async function getFeaturedProducts(limit = 4): Promise<ProductCardData[]> {
  try {
    const { data, error } = await createPublicClient()
      .from("products").select(CARD_COLUMNS).eq("status", "published").eq("is_featured", true).order("created_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as ProductCardData[];
  } catch (e) {
    logError("featured", e);
    return [];
  }
}

export type ShopQuery = { categoryId?: string; q?: string; sort: SortValue; page: number };

/** One page of published products with filtering, search, sorting and a total count. Runs entirely in the database. */
export async function getShopProducts(opts: ShopQuery): Promise<{ products: ProductCardData[]; total: number; failed: boolean }> {
  try {
    let query = createPublicClient().from("products").select(CARD_COLUMNS, { count: "exact" }).eq("status", "published");
    if (opts.categoryId) query = query.eq("category_id", opts.categoryId);
    if (opts.q) query = query.ilike("name", `%${escapeLike(opts.q)}%`);

    switch (opts.sort) {
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
      case "price-asc":
        query = query.order("price", { ascending: true, nullsFirst: false }).order("created_at", { ascending: false });
        break;
      case "price-desc":
        query = query.order("price", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const from = (opts.page - 1) * PAGE_SIZE;
    const { data, count, error } = await query.order("id").range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    return { products: (data ?? []) as unknown as ProductCardData[], total: count ?? 0, failed: false };
  } catch (e) {
    logError("shop", e);
    return { products: [], total: 0, failed: true };
  }
}

/** A single published product by its URL slug. Cached per request so metadata and page share one query. */
export const getProductBySlug = cache(async (slug: string): Promise<ProductWithCategory | null> => {
  try {
    const { data, error } = await createPublicClient()
      .from("products").select("*, category:categories(id, name, slug)").eq("slug", slug).eq("status", "published").maybeSingle();
    if (error) throw error;
    return (data as unknown as ProductWithCategory | null) ?? null;
  } catch (e) {
    logError("by-slug", e);
    return null;
  }
});

/** Other published products in the same category. */
export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4): Promise<ProductCardData[]> {
  try {
    const { data, error } = await createPublicClient()
      .from("products").select(CARD_COLUMNS).eq("status", "published").eq("category_id", categoryId).neq("id", excludeId)
      .order("created_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as ProductCardData[];
  } catch (e) {
    logError("related", e);
    return [];
  }
}
