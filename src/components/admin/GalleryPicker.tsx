"use client";

import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { validateImageFile } from "@/lib/storage-shared";
import type { PickedImage } from "./image-types";

const MAX = 8;

export function GalleryPicker({ value, onChange }: { value: PickedImage[]; onChange: (v: PickedImage[]) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const { notify } = useToast();

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    const added: PickedImage[] = [];
    for (const file of files) {
      if (value.length + added.length >= MAX) {
        notify("error", `You can add up to ${MAX} additional images.`);
        break;
      }
      const problem = validateImageFile(file);
      if (problem) {
        notify("error", problem);
        continue;
      }
      added.push({ id: crypto.randomUUID(), url: URL.createObjectURL(file), path: null, file });
    }
    if (added.length) onChange([...value, ...added]);
  }

  function remove(img: PickedImage) {
    if (img.file) URL.revokeObjectURL(img.url);
    onChange(value.filter((v) => v.id !== img.id));
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Additional images <span className="font-normal text-charcoal-soft">({value.length}/{MAX})</span></p>
      <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={pick} aria-label="Additional images" />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
        {value.map((img) => (
          <div key={img.id} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="Additional product preview" className="aspect-square w-full rounded-md border border-line object-cover" />
            <button
              type="button"
              onClick={() => remove(img)}
              aria-label="Remove image"
              className="absolute -right-1.5 -top-1.5 rounded-full bg-charcoal p-1 text-white hover:bg-brand"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {value.length < MAX && (
          <button
            type="button"
            onClick={() => input.current?.click()}
            aria-label="Add images"
            className="flex aspect-square items-center justify-center rounded-md border border-dashed border-charcoal/30 text-charcoal-soft transition-colors hover:border-brand hover:text-brand"
          >
            <ImagePlus className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
