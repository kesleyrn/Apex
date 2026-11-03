"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Field, Select } from "@/components/ui/Field";
import { buttonStyles } from "@/components/ui/Button";
import { orderUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { QuantitySelector } from "./QuantitySelector";

type Props = { name: string; code: string; category: string; price: number | null; sizes: string[]; colors: string[]; inStock: boolean };

export function ProductPurchasePanel({ name, code, category, price, sizes, colors, inStock }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  const missing = [sizes.length > 0 && !size && "a size", colors.length > 0 && !color && "a colour"].filter(Boolean) as string[];
  const ready = missing.length === 0;
  const href = orderUrl({ name, code, category, quantity, price, size: size || null, color: color || null });
  const btn = cn(buttonStyles("primary", "lg"), "w-full");

  return (
    <div className="space-y-5">
      {sizes.length > 0 && (
        <Field label="Size" htmlFor="size">
          <Select id="size" value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">Select a size</option>
            {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
      )}
      {colors.length > 0 && (
        <Field label="Colour" htmlFor="color">
          <Select id="color" value={color} onChange={(e) => setColor(e.target.value)}>
            <option value="">Select a colour</option>
            {colors.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
      )}

      <div>
        <label htmlFor="quantity" className="mb-1.5 block text-sm font-medium">Quantity</label>
        <QuantitySelector value={quantity} onChange={setQuantity} />
      </div>

      {!inStock && (
        <p className="rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-dark">
          This item is currently out of stock. You can still message us to ask when it will be available.
        </p>
      )}

      {ready ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={btn}>
          <MessageCircle className="h-5 w-5" aria-hidden /> Order via WhatsApp
        </a>
      ) : (
        <>
          <button type="button" disabled className={btn}>
            <MessageCircle className="h-5 w-5" aria-hidden /> Order via WhatsApp
          </button>
          <p role="status" className="text-sm text-charcoal-soft">Please choose {missing.join(" and ")} to continue.</p>
        </>
      )}
      <p className="text-xs text-charcoal-soft">
        WhatsApp opens with your order message ready to review. Your order is only placed once you send it and we confirm availability.
      </p>
    </div>
  );
}
