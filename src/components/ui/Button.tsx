import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";
const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  outline: "border border-charcoal/25 text-charcoal hover:border-brand hover:text-brand",
  ghost: "text-charcoal hover:bg-brand-soft hover:text-brand",
  light: "bg-white text-charcoal hover:bg-brand-soft",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

export function buttonStyles(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode };
type AsLink = CommonProps & { href: string; external?: boolean };
type AsButton = CommonProps & Omit<React.ComponentProps<"button">, keyof CommonProps> & { href?: undefined };

export function Button(props: AsLink | AsButton) {
  const { variant, size, className, children } = props;
  const styles = buttonStyles(variant, size, className);

  if (props.href !== undefined) {
    return props.external ? (
      <a href={props.href} target="_blank" rel="noopener noreferrer" className={styles}>
        {children}
      </a>
    ) : (
      <Link href={props.href} className={styles}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...rest } = props;
  return (
    <button type="button" className={styles} {...rest}>
      {children}
    </button>
  );
}
