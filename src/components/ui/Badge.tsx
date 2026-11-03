import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-charcoal/5 text-charcoal",
  brand: "bg-brand-soft text-brand-dark",
  muted: "bg-line text-charcoal-soft",
} as const;

export function Badge({
  tone = "neutral", className, ...props
}: React.ComponentProps<"span"> & { tone?: keyof typeof tones }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone], className)} {...props} />
  );
}
