"use client";

import { useRef } from "react";
import { ImagePlus, Replace, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { validateImageFile } from "@/lib/storage-shared";
import type { PickedImage } from "./image-types";

type Props = { label: string; value: PickedImage | null; onChange: (v: PickedImage | null) => void; hint?: string; error?: string | null };

export function ImagePicker({ label, value, onChange, hint, error }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const { notify } = useToast();

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const problem = validateImageFile(file);
    if (problem) return notify("error", problem);
    if (value?.file) URL.revokeObjectURL(value.url);
    onChange({ id: crypto.randomUUID(), url: URL.createObjectURL(file), path: null, file });
  }

  function remove() {
    if (value?.file) URL.revokeObjectURL(value.url);
    onChange(null);
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={pick} aria-label={label} />
      {value ? (
        <div className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value.url} alt={`${label} preview`} className="aspect-square w-full rounded-md border border-line object-cover" />
          {value.file && <p className="text-xs text-charcoal-soft">Preview only. It uploads when you save.</p>}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => input.current?.click()}><Replace className="h-4 w-4" aria-hidden /> Replace</Button>
            <Button size="sm" variant="ghost" onClick={remove}><Trash2 className="h-4 w-4" aria-hidden /> Remove</Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-charcoal/30 text-sm text-charcoal-soft transition-colors hover:border-brand hover:text-brand"
        >
          <ImagePlus className="h-6 w-6" aria-hidden />
          Choose an image
        </button>
      )}
      {hint && !error && <p className="text-xs text-charcoal-soft">{hint}</p>}
      {error && <p role="alert" className="text-xs font-medium text-brand">{error}</p>}
    </div>
  );
}
