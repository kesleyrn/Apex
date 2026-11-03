"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-[#F4F2EF]">
        {current ? (
          <Image src={current} alt={name} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-charcoal-soft"><ImageOff className="h-10 w-10" aria-hidden /></span>
        )}
      </div>
      {images.length > 1 && (
        <ul className="grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === index}
                className={cn("relative block aspect-square w-full overflow-hidden rounded-md border-2", i === index ? "border-brand" : "border-transparent hover:border-line")}
              >
                <Image src={src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
