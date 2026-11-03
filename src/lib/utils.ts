import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "RWF 25,000", or null when no price is set. */
export function formatRWF(amount: number | null | undefined): string | null {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return null;
  return `RWF ${new Intl.NumberFormat("en-US").format(amount)}`;
}

/** URL-safe slug. Strips accents, so "Décor" becomes "decor". */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Escapes % _ \ so user input is matched literally inside ILIKE. */
export function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}
