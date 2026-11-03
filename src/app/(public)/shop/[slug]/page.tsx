import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductPurchasePanel } from "@/components/products/ProductPurchasePanel";
import { Badge } from "@/components/ui/Badge";
import { BUSINESS } from "@/lib/constants";
import { parseGallery } from "@/lib/gallery";
import { formatRWF } from "@/lib/utils";
import { getProductBySlug, getRelatedProducts } from "@/services/products";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  const description = product.description.replace(/\s+/g, " ").slice(0, 155) || `${product.name} from ${BUSINESS.name}. Order on WhatsApp.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: { title: product.name, description, type: "website", images: product.image_url ? [{ url: product.image_url }] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const images = [product.image_url, ...parseGallery(product.gallery).map((g) => g.url)].filter((u): u is string => Boolean(u));
  const related = product.category ? await getRelatedProducts(product.category.id, product.id, 4) : [];
  const price = formatRWF(product.price);
  const inStock = product.availability === "in_stock";
  const categoryName = product.category?.name ?? "Home furnishing";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.product_code,
    description: product.description || undefined,
    image: images.length ? images : undefined,
    category: categoryName,
    brand: { "@type": "Brand", name: BUSINESS.name },
    ...(product.price !== null && {
      offers: {
        "@type": "Offer",
        priceCurrency: "RWF",
        price: product.price,
        availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    }),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Container className="py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-charcoal-soft">
          <Link href="/" className="hover:text-brand">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <Link href="/shop" className="hover:text-brand">Shop</Link>
          {product.category && (
            <>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-brand">{product.category.name}</Link>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span aria-current="page" className="text-charcoal">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={images} name={product.name} />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">{categoryName}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{product.name}</h1>
            <p className="mt-2 text-sm text-charcoal-soft">Product ID: <span className="font-medium text-charcoal">{product.product_code}</span></p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <p className="text-2xl font-semibold">{price ?? <span className="text-lg font-medium text-charcoal-soft">Price on request</span>}</p>
              <Badge tone={inStock ? "neutral" : "muted"}>{inStock ? "In stock" : "Out of stock"}</Badge>
            </div>

            {product.description && (
              <div className="mt-6 border-t border-line pt-6">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider">Description</h2>
                <p className="whitespace-pre-line text-charcoal-soft">{product.description}</p>
              </div>
            )}

            <div className="mt-8 border-t border-line pt-6">
              <ProductPurchasePanel
                name={product.name}
                code={product.product_code}
                category={categoryName}
                price={product.price}
                sizes={product.sizes}
                colors={product.colors}
                inStock={inStock}
              />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20" aria-labelledby="related-heading">
            <h2 id="related-heading" className="mb-8 text-2xl font-semibold tracking-tight">You may also like</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </Container>
    </main>
  );
}
