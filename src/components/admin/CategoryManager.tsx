"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { createCategory, deleteCategory, updateCategory } from "@/actions/categories";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Field, Input } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { pathFromPublicUrl } from "@/lib/storage-shared";
import { removeImages, uploadImage } from "@/lib/storage";
import { categoryFormSchema, type CategoryFormValues } from "@/lib/validations/category";
import type { Category } from "@/types";
import { ImagePicker } from "./ImagePicker";
import type { PickedImage } from "./image-types";

export type CategoryRow = Category & { product_count: number };

function CategoryForm({ category, onDone }: { category: CategoryRow | null; onDone: () => void }) {
  const { notify } = useToast();
  const [categoryId] = useState(() => category?.id ?? crypto.randomUUID());
  const [image, setImage] = useState<PickedImage | null>(
    category?.image_url ? { id: "img", url: category.image_url, path: pathFromPublicUrl(category.image_url), file: null } : null,
  );

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: category?.name ?? "", code_prefix: category?.code_prefix ?? "", is_active: category?.is_active ?? true },
  });

  const onSubmit = handleSubmit(async (values) => {
    let uploadedPath: string | null = null;
    try {
      let imageUrl: string | null = null;
      if (image?.file) {
        const up = await uploadImage(image.file, `categories/${categoryId}`);
        uploadedPath = up.path;
        imageUrl = up.url;
      } else if (image) {
        imageUrl = image.url;
      }

      const payload = { ...values, image_url: imageUrl };
      const result = category ? await updateCategory(categoryId, payload) : await createCategory(categoryId, payload);
      if (!result.ok) {
        if (uploadedPath) await removeImages([uploadedPath]);
        notify("error", result.error);
        return;
      }

      const oldPath = pathFromPublicUrl(category?.image_url);
      if (oldPath && oldPath !== (uploadedPath ?? pathFromPublicUrl(imageUrl))) await removeImages([oldPath]);
      notify("success", category ? "Category updated." : "Category added.");
      reset({ name: "", code_prefix: "", is_active: true });
      setImage(null);
      onDone();
    } catch (e) {
      if (uploadedPath) await removeImages([uploadedPath]);
      notify("error", e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-lg border border-line bg-white p-5">
      <h2 className="text-base font-semibold">{category ? `Edit “${category.name}”` : "Add a category"}</h2>
      <Field label="Category name" htmlFor="cat-name" error={errors.name?.message}>
        <Input id="cat-name" aria-invalid={!!errors.name} {...register("name")} />
      </Field>
      <Field label="Code prefix" htmlFor="cat-prefix" error={errors.code_prefix?.message} hint="2–4 letters used in product codes (e.g. BED). Leave blank to choose automatically.">
        <Input id="cat-prefix" className="uppercase" {...register("code_prefix")} />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="h-4 w-4 accent-brand" {...register("is_active")} />
        Active (visible on the website)
      </label>
      <ImagePicker label="Category image (optional)" value={image} onChange={setImage} />
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Saving…</> : category ? "Save changes" : "Add category"}
        </Button>
        {category && <Button variant="outline" onClick={onDone}>Cancel</Button>}
      </div>
    </form>
  );
}

export function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const { notify } = useToast();
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [deleting, setDeleting] = useState<CategoryRow | null>(null);
  const [pending, startTransition] = useTransition();

  function remove() {
    if (!deleting) return;
    const target = deleting;
    startTransition(async () => {
      const r = await deleteCategory(target.id);
      setDeleting(null);
      notify(r.ok ? "success" : "error", r.ok ? "Category deleted." : r.error);
    });
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-charcoal-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {c.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.image_url} alt="" className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <span className="h-10 w-10 rounded bg-line" aria-hidden />
                    )}
                    <span className="font-medium">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-charcoal-soft">{c.code_prefix}</td>
                <td className="px-4 py-3">{c.product_count}</td>
                <td className="px-4 py-3"><Badge tone={c.is_active ? "brand" : "muted"}>{c.is_active ? "Active" : "Hidden"}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button type="button" onClick={() => setEditing(c)} aria-label={`Edit ${c.name}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-charcoal-soft hover:bg-brand-soft hover:text-brand">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(c)}
                      disabled={c.product_count > 0}
                      aria-label={`Delete ${c.name}`}
                      title={c.product_count > 0 ? "Move or delete this category's products first" : "Delete"}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-charcoal-soft hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-charcoal-soft"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CategoryForm key={editing?.id ?? "new"} category={editing} onDone={() => setEditing(null)} />

      <ConfirmDialog
        open={!!deleting}
        title="Delete this category?"
        message={`“${deleting?.name ?? ""}” will be removed. Categories that contain products cannot be deleted.`}
        pending={pending}
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
