import { z } from "zod";
import { storagePrefix } from "@/lib/storage-shared";

const status = z.enum(["draft", "published"]);
const availability = z.enum(["in_stock", "out_of_stock"]);

/** What the form collects (all text inputs stay strings). */
export const productFormSchema = z.object({
  name: z.string().trim().min(2, "Enter the product name").max(150, "Name is too long"),
  product_code: z
    .string()
    .trim()
    .refine((v) => v === "" || /^[A-Za-z0-9][A-Za-z0-9-]{2,29}$/.test(v), "Use 3–30 letters, numbers or hyphens, or leave blank"),
  category_id: z.string().uuid("Choose a category"),
  description: z.string().trim().max(5000, "Description is too long"),
  price: z
    .string()
    .trim()
    .refine((v) => v === "" || (/^\d{1,10}(\.\d{1,2})?$/.test(v) && Number(v) >= 0), "Enter a valid price in RWF, numbers only"),
  availability,
  status,
  is_featured: z.boolean(),
  sizes: z.string().trim().max(300, "Too long"),
  colors: z.string().trim().max(300, "Too long"),
});
export type ProductFormValues = z.infer<typeof productFormSchema>;

const imageUrl = z.string().url().refine((u) => u.startsWith(storagePrefix()), "Image must come from product storage");
const listItem = z.string().trim().min(1).max(40);

/** What the server action accepts. Re-validated on the server, never trusted from the browser. */
export const productPayloadSchema = z.object({
  name: z.string().trim().min(2).max(150),
  product_code: z.string().trim().refine((v) => v === "" || /^[A-Za-z0-9][A-Za-z0-9-]{2,29}$/.test(v), "Invalid product code"),
  category_id: z.string().uuid("Choose a category"),
  description: z.string().trim().max(5000),
  price: z.number().min(0).max(1_000_000_000).nullable(),
  availability,
  status,
  is_featured: z.boolean(),
  sizes: z.array(listItem).max(20),
  colors: z.array(listItem).max(20),
  image_url: imageUrl.nullable(),
  gallery: z.array(z.object({ url: imageUrl, path: z.string().min(1).max(300) })).max(8),
});
export type ProductPayload = z.infer<typeof productPayloadSchema>;
