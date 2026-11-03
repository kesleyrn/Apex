"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { deleteProduct, setProductStatus } from "@/actions/products";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import type { ProductStatus } from "@/types";

const iconBtn = "inline-flex h-8 w-8 items-center justify-center rounded-md text-charcoal-soft hover:bg-brand-soft hover:text-brand disabled:opacity-50";

export function ProductRowActions({ id, name, status }: { id: string; name: string; status: ProductStatus }) {
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function toggle() {
    const next: ProductStatus = status === "published" ? "draft" : "published";
    startTransition(async () => {
      const r = await setProductStatus(id, next);
      notify(r.ok ? "success" : "error", r.ok ? (next === "published" ? "Product published." : "Product unpublished.") : r.error);
    });
  }

  function remove() {
    startTransition(async () => {
      const r = await deleteProduct(id);
      setConfirming(false);
      notify(r.ok ? "success" : "error", r.ok ? "Product deleted." : r.error);
    });
  }

  return (
    <div className="flex justify-end gap-1">
      <Link href={`/admin/dashboard/products/${id}/edit`} className={iconBtn} aria-label={`Edit ${name}`} title="Edit">
        <Pencil className="h-4 w-4" />
      </Link>
      <button type="button" onClick={toggle} disabled={pending} className={iconBtn} aria-label={status === "published" ? `Unpublish ${name}` : `Publish ${name}`} title={status === "published" ? "Unpublish" : "Publish"}>
        {status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      <button type="button" onClick={() => setConfirming(true)} disabled={pending} className={iconBtn} aria-label={`Delete ${name}`} title="Delete">
        <Trash2 className="h-4 w-4" />
      </button>
      <ConfirmDialog
        open={confirming}
        title="Delete this product?"
        message={`“${name}” and its images will be permanently removed from the website. This cannot be undone.`}
        pending={pending}
        onConfirm={remove}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
