export const BUCKET = "product-images";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return `${file.name}: only JPG, PNG or WebP images are allowed.`;
  if (file.size > MAX_IMAGE_BYTES) return `${file.name}: image is larger than 5 MB.`;
  return null;
}

export function storagePrefix(): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
}

/** Storage path for one of our public image URLs, or null for anything else. */
export function pathFromPublicUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const prefix = storagePrefix();
  return url.startsWith(prefix) ? decodeURIComponent(url.slice(prefix.length)) : null;
}
