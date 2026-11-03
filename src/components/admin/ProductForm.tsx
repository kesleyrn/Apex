"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { createProduct, updateProduct } from "@/actions/products";
import { Button, buttonStyles } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { parseGallery } from "@/lib/gallery";
import { pathFromPublicUrl } from "@/lib/storage-shared";
import { removeImages, uploadImage } from "@/lib/storage";
import { productFormSchema, type ProductFormValues } from "@/lib/validations/product";
import type { GalleryImage, Product } from "@/types";
import { GalleryPicker } from "./GalleryPicker";
import { ImagePicker } from "./ImagePicker";
import type { PickedImage } from "./image-types";

const toList = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

export function ProductForm({ categories, product }: { categories: { id: string; name: string }[]; product?: Product }) {
  const router = useRouter();
  const { notify } = useToast();
  const [productId] = useState(() => product?.id ?? crypto.randomUUID());
  const initialGallery = parseGallery(product?.gallery);

  const [main, setMain] = useState<PickedImage | null>(
    product?.image_url ? { id: "main", url: product.image_url, path: pathFromPublicUrl(product.image_url), file: null } : null,
  );
  const [gallery, setGallery] = useState<PickedImage[]>(
    initialGallery.map((g) => ({ id: g.path, url: g.url, path: g.path, file: null })),
  );
  const [imageError, setImageError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      product_code: product?.product_code ?? "",
      category_id: product?.category_id ?? "",
      description: product?.description ?? "",
      price: product?.price != null ? String(product.price) : "",
      availability: product?.availability ?? "in_stock",
      status: product?.status ?? "draft",
      is_featured: product?.is_featured ?? false,
      sizes: product?.sizes.join(", ") ?? "",
      colors: product?.colors.join(", ") ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setImageError(null);
    if (values.status === "published" && !main) {
      setImageError("Add a main image before publishing.");
      return;
    }

    const uploaded: string[] = [];
    try {
      let mainFinal: GalleryImage | null = null;
      if (main) {
        if (main.file) {
          mainFinal = await uploadImage(main.file, `products/${productId}`);
          uploaded.push(mainFinal.path);
        } else {
          mainFinal = { url: main.url, path: main.path ?? "" };
        }
      }
      const galleryFinal: GalleryImage[] = [];
      for (const g of gallery) {
        if (g.file) {
          const up = await uploadImage(g.file, `products/${productId}`);
          uploaded.push(up.path);
          galleryFinal.push(up);
        } else {
          galleryFinal.push({ url: g.url, path: g.path ?? "" });
        }
      }

      const payload = {
        name: values.name,
        product_code: values.product_code,
        category_id: values.category_id,
        description: values.description,
        price: values.price === "" ? null : Number(values.price),
        availability: values.availability,
        status: values.status,
        is_featured: values.is_featured,
        sizes: toList(values.sizes),
        colors: toList(values.colors),
        image_url: mainFinal?.url ?? null,
        gallery: galleryFinal,
      };

      const result = product ? await updateProduct(productId, payload) : await createProduct(productId, payload);
      if (!result.ok) {
        await removeImages(uploaded); // do not leave orphan files behind
        notify("error", result.error);
        return;
      }

      // Saved. Now delete images that were replaced or removed.
      const keep = new Set([mainFinal?.path, ...galleryFinal.map((g) => g.path)]);
      const old = [pathFromPublicUrl(product?.image_url), ...initialGallery.map((g) => g.path)].filter(
        (p): p is string => !!p && !keep.has(p),
      );
      await removeImages(old);

      notify("success", product ? "Product updated." : "Product added.");
      router.push("/admin/dashboard/products");
      router.refresh();
    } catch (e) {
      await removeImages(uploaded);
      notify("error", e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-5 rounded-lg border border-line bg-white p-5 sm:p-6">
        <Field label="Product name" htmlFor="name" error={errors.name?.message}>
          <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category" htmlFor="category_id" error={errors.category_id?.message}>
            <Select id="category_id" aria-invalid={!!errors.category_id} {...register("category_id")}>
              <option value="">Choose a category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
          <Field label="Product code" htmlFor="product_code" error={errors.product_code?.message} hint="Leave blank to generate one automatically, e.g. APX-BED-0001.">
            <Input id="product_code" aria-invalid={!!errors.product_code} {...register("product_code")} />
          </Field>
        </div>

        <Field label="Description" htmlFor="description" error={errors.description?.message}>
          <Textarea id="description" rows={6} {...register("description")} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Price (RWF)" htmlFor="price" error={errors.price?.message} hint="Leave blank if the price is given on request.">
            <Input id="price" inputMode="decimal" placeholder="e.g. 45000" aria-invalid={!!errors.price} {...register("price")} />
          </Field>
          <Field label="Availability" htmlFor="availability">
            <Select id="availability" {...register("availability")}>
              <option value="in_stock">In stock</option>
              <option value="out_of_stock">Out of stock</option>
            </Select>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Sizes (optional)" htmlFor="sizes" error={errors.sizes?.message} hint="Separate with commas, e.g. Single, Double, Queen">
            <Input id="sizes" {...register("sizes")} />
          </Field>
          <Field label="Colours (optional)" htmlFor="colors" error={errors.colors?.message} hint="Separate with commas, e.g. White, Grey">
            <Input id="colors" {...register("colors")} />
          </Field>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="space-y-5 rounded-lg border border-line bg-white p-5">
          <Field label="Product status" htmlFor="status">
            <Select id="status" {...register("status")}>
              <option value="draft">Draft (hidden from the website)</option>
              <option value="published">Published (visible)</option>
            </Select>
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-brand" {...register("is_featured")} />
            Show as a featured product
          </label>
        </div>

        <div className="space-y-6 rounded-lg border border-line bg-white p-5">
          <ImagePicker label="Main image" value={main} onChange={setMain} error={imageError} hint="JPG, PNG or WebP, up to 5 MB." />
          <GalleryPicker value={gallery} onChange={setGallery} />
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Saving…</> : product ? "Save changes" : "Add product"}
          </Button>
          <Link href="/admin/dashboard/products" className={buttonStyles("outline")}>Cancel</Link>
        </div>
      </aside>
    </form>
  );
}
