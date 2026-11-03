import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import type { Category } from "@/types";

type Item = Pick<Category, "id" | "name" | "slug" | "image_url">;

export function CategoryGrid({ categories }: { categories: Item[] }) {
  if (categories.length === 0) return null;
  return (
    <section className="bg-[#F7F5F2] py-20 sm:py-24" aria-labelledby="categories-heading">
      <Container>
        <SectionHeading eyebrow="Shop by category" title="Find what your home needs" href="/shop" hrefLabel="Shop all" />
        <h2 id="categories-heading" className="sr-only">Product categories</h2>
        <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/shop?category=${c.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-lg bg-gradient-to-br from-white to-line"
              >
                {c.image_url && (
                  <Image
                    src={c.image_url}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                  <span className="block text-base font-semibold text-white">{c.name}</span>
                  <span className="text-xs text-white/80 group-hover:underline">Browse</span>
                </span>
                {!c.image_url && (
                  <span className="absolute inset-0 flex items-center justify-center text-5xl font-semibold text-charcoal/10" aria-hidden>
                    {c.name.charAt(0)}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
