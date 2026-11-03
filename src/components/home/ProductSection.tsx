import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import type { ProductCardData } from "@/types";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  products: ProductCardData[];
  emptyMessage?: string;
  className?: string;
};

export function ProductSection({ id, eyebrow, title, products, emptyMessage, className }: Props) {
  if (products.length === 0 && !emptyMessage) return null;
  return (
    <section className={className ?? "py-20 sm:py-24"} aria-labelledby={id}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} href="/shop" />
        <span id={id} className="sr-only">{title}</span>
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="rounded-lg border border-dashed border-line px-6 py-12 text-center text-charcoal-soft">{emptyMessage}</p>
        )}
      </Container>
    </section>
  );
}
