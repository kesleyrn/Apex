"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ open, title, message, confirmLabel = "Delete", pending, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      className="w-[calc(100%-2rem)] max-w-md rounded-lg p-0 shadow-xl backdrop:bg-charcoal/50"
    >
      <div className="space-y-3 p-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-charcoal-soft">{message}</p>
      </div>
      <div className="flex justify-end gap-2 border-t border-line px-6 py-4">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={pending}>Cancel</Button>
        <Button size="sm" onClick={onConfirm} disabled={pending}>{pending ? "Working…" : confirmLabel}</Button>
      </div>
    </dialog>
  );
}
