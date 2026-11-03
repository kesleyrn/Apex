"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { clampQuantity } from "@/lib/whatsapp";

export function QuantitySelector({ value, onChange, id = "quantity" }: { value: number; onChange: (n: number) => void; id?: string }) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);

  const btn = "flex h-11 w-11 items-center justify-center hover:bg-brand-soft hover:text-brand disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit";
  return (
    <div className="inline-flex items-center overflow-hidden rounded-md border border-line">
      <button type="button" className={btn} aria-label="Decrease quantity" disabled={value <= 1} onClick={() => onChange(clampQuantity(value - 1))}>
        <Minus className="h-4 w-4" />
      </button>
      <input
        id={id}
        inputMode="numeric"
        aria-label="Quantity"
        value={text}
        className="h-11 w-14 border-x border-line text-center text-sm font-medium focus:outline-none"
        onChange={(e) => {
          const cleaned = e.target.value.replace(/\D/g, "").slice(0, 2);
          setText(cleaned);
          if (cleaned) onChange(clampQuantity(Number(cleaned)));
        }}
        onBlur={() => setText(String(value))}
      />
      <button type="button" className={btn} aria-label="Increase quantity" disabled={value >= 99} onClick={() => onChange(clampQuantity(value + 1))}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
