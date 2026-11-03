import type { Database } from "./database";

type Tables = Database["public"]["Tables"];

export type Category = Tables["categories"]["Row"];
export type CategoryInsert = Tables["categories"]["Insert"];
export type Product = Tables["products"]["Row"];
export type ProductInsert = Tables["products"]["Insert"];
export type ProductUpdate = Tables["products"]["Update"];
export type AdminProfile = Tables["admin_profiles"]["Row"];

export type ProductStatus = Database["public"]["Enums"]["product_status"];
export type Availability = Database["public"]["Enums"]["availability_status"];

/** One extra product image. `path` is the storage path, used when deleting. */
export type GalleryImage = { url: string; path: string };

export type ProductWithCategory = Product & {
  category: Pick<Category, "id" | "name" | "slug"> | null;
};

export type DashboardStats = {
  total_products: number;
  total_categories: number;
  published_products: number;
  draft_products: number;
  out_of_stock: number;
};

export type ActionResult = { ok: true } | { ok: false; error: string };

/** The fields a product card needs. */
export type ProductCardData = Pick<Product, "id" | "slug" | "name" | "product_code" | "price" | "image_url" | "availability"> & {
  category: Pick<Category, "name" | "slug"> | null;
};
