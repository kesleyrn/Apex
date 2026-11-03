import type { Json } from "@/types/database";
import type { GalleryImage } from "@/types";

export function parseGallery(value: Json | undefined): GalleryImage[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((v) =>
    v && typeof v === "object" && !Array.isArray(v) && typeof v.url === "string" && typeof v.path === "string"
      ? [{ url: v.url, path: v.path }]
      : [],
  );
}
