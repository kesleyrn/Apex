import { createClient } from "@/lib/supabase/client";
import { BUCKET } from "@/lib/storage-shared";
import type { GalleryImage } from "@/types";

/** Browser-side upload. Runs with the admin's session, so storage policies decide whether it is allowed. */
export async function uploadImage(file: File, folder: string): Promise<GalleryImage> {
  const supabase = createClient();
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(`Could not upload ${file.name}. ${error.message}`);
  return { url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl, path };
}

export async function removeImages(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  await createClient().storage.from(BUCKET).remove(paths);
}
