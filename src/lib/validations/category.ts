import { z } from "zod";
import { storagePrefix } from "@/lib/storage-shared";

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, "Enter the category name").max(60, "Name is too long"),
  code_prefix: z
    .string()
    .trim()
    .refine((v) => v === "" || /^[A-Za-z]{2,4}$/.test(v), "Use 2–4 letters, or leave blank"),
  is_active: z.boolean(),
});
export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const categoryPayloadSchema = categoryFormSchema.extend({
  image_url: z.string().url().refine((u) => u.startsWith(storagePrefix())).nullable(),
});
export type CategoryPayload = z.infer<typeof categoryPayloadSchema>;
