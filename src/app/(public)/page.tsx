import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CtaBanner } from "@/components/home/CtaBanner";
import { Hero } from "@/components/home/Hero";
import { ProductSection } from "@/components/home/ProductSection";
import { Welcome } from "@/components/home/Welcome";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { HOME_NEW_ARRIVALS_COUNT } from "@/lib/constants";
import { getActiveCategories } from "@/services/categories";
import { getFeaturedProducts, getNewArrivals } from "@/services/products";

// Cached for a minute. Saving in the admin dashboard refreshes it immediately.
export const revalidate = 60;

export default async function HomePage() {
  const [categories, newArrivals, featured] = await Promise.all([
    getActiveCategories(),
    getNewArrivals(HOME_NEW_ARRIVALS_COUNT),
    getFeaturedProducts(4),
  ]);

  return (
    <main>
      <Hero />
      <Welcome />
      <CategoryGrid categories={categories} />
      <ProductSection
        id="new-arrivals"
        eyebrow="Just in"
        title="New Arrivals"
        products={newArrivals}
        emptyMessage="New products are on their way. Check back soon, or message us on WhatsApp."
      />
      <ProductSection id="featured" eyebrow="Our picks" title="Featured Products" products={featured} className="bg-[#F7F5F2] py-20 sm:py-24" />
      <WhyChooseUs />
      <CtaBanner />
    </main>
  );
}
