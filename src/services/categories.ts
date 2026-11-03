import { DEFAULT_CATEGORIES } from "@/lib/constants";
import { createPublicClient } from "@/lib/supabase/public";
import type { Category } from "@/types";

/** Active categories, in the business's preferred order (default seven first, then any added later). */
export async function getActiveCategories(): Promise<Pick<Category, "id" | "name" | "slug" | "image_url">[]> {
  try {
    const { data, error } = await createPublicClient().from("categories").select("id, name, slug, image_url").eq("is_active", true);
    if (error) throw new Error(error.message);
    const order = (name: string) => {
      const i = (DEFAULT_CATEGORIES as readonly string[]).indexOf(name);
      return i === -1 ? DEFAULT_CATEGORIES.length : i;
    };
    return (data ?? []).sort((a, b) => order(a.name) - order(b.name) || a.name.localeCompare(b.name));
  } catch (e) {
    console.error("[categories] could not load:", e instanceof Error ? e.message : e);
    return [];
  }
}
