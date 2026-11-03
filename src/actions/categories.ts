"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdmin } from "@/lib/auth";
import { friendlyDbError } from "@/lib/errors";
import { BUCKET } from "@/lib/storage-shared";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { categoryPayloadSchema } from "@/lib/validations/category";
import type { ActionResult } from "@/types";

const idSchema = z.string().uuid();
const fail = (error: string): ActionResult => ({ ok: false, error });
const refresh = () => revalidatePath("/", "layout");

function prefixFrom(name: string) {
  return name.normalize("NFD").replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase();
}

export async function createCategory(id: string, input: unknown): Promise<ActionResult> {
  if (!(await getAdmin())) return fail("Please sign in again.");
  const parsedId = idSchema.safeParse(id);
  const parsed = categoryPayloadSchema.safeParse(input);
  if (!parsedId.success || !parsed.success) return fail(parsed.success ? "Invalid category." : parsed.error.issues[0]?.message ?? "Check the form.");
  const c = parsed.data;

  const supabase = await createClient();
  const base = slugify(c.name) || "category";
  const { data: rows } = await supabase.from("categories").select("slug").like("slug", `${base}%`);
  const taken = new Set((rows ?? []).map((r) => r.slug));
  let slug = base;
  for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`;

  const { error } = await supabase.from("categories").insert({
    id: parsedId.data,
    name: c.name,
    slug,
    code_prefix: (c.code_prefix || prefixFrom(c.name)).toUpperCase(),
    is_active: c.is_active,
    image_url: c.image_url,
  });
  if (error) return fail(friendlyDbError(error));
  refresh();
  return { ok: true };
}

export async function updateCategory(id: string, input: unknown): Promise<ActionResult> {
  if (!(await getAdmin())) return fail("Please sign in again.");
  const parsedId = idSchema.safeParse(id);
  const parsed = categoryPayloadSchema.safeParse(input);
  if (!parsedId.success || !parsed.success) return fail(parsed.success ? "Invalid category." : parsed.error.issues[0]?.message ?? "Check the form.");
  const c = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .update({
      name: c.name,
      ...(c.code_prefix ? { code_prefix: c.code_prefix.toUpperCase() } : {}),
      is_active: c.is_active,
      image_url: c.image_url,
    })
    .eq("id", parsedId.data)
    .select("id");
  if (error) return fail(friendlyDbError(error));
  if (!data || data.length === 0) return fail("Category not found.");
  refresh();
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  if (!(await getAdmin())) return fail("Please sign in again.");
  if (!idSchema.safeParse(id).success) return fail("Invalid request.");
  const supabase = await createClient();

  const { count } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("category_id", id);
  if (count && count > 0) return fail(`This category has ${count} product${count === 1 ? "" : "s"}. Move or delete them first.`);

  const { data, error } = await supabase.from("categories").delete().eq("id", id).select("id");
  if (error) return fail(friendlyDbError(error)); // the database also blocks this
  if (!data || data.length === 0) return fail("Category not found.");

  const folder = `categories/${id}`;
  const { data: files } = await supabase.storage.from(BUCKET).list(folder);
  if (files && files.length > 0) await supabase.storage.from(BUCKET).remove(files.map((f) => `${folder}/${f.name}`));
  refresh();
  return { ok: true };
}
