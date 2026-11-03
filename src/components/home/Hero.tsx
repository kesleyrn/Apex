import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { HERO_IMAGE } from "@/lib/constants";

export function Hero() {
  return (
    <section
      className="relative isolate flex min-h-[78vh] items-center bg-charcoal bg-cover bg-center"
      // If the image file is missing, the dark gradient below still renders.
      style={{ backgroundImage: `url(${HERO_IMAGE}), linear-gradient(135deg, #333333 0%, #1f1f1f 100%)` }}
    >
      <div className="absolute inset-0 -z-10 bg-black/55" aria-hidden />
      <Container className="py-24">
        <div className="max-w-2xl text-white">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">A Touch of Class</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Transform Your Space with Comfort and Elegance.
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/85 sm:text-lg">
            Discover quality home furnishing essentials designed to bring comfort, beauty and a touch of class into your everyday living.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/shop" size="lg">Explore Our Collection</Button>
            <Button href="/contact" size="lg" variant="light">Contact Us</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
