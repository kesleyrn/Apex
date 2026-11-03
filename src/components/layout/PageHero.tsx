import { Container } from "@/components/layout/Container";

/** Full-width cover with a dark overlay. If the image file is missing, the dark gradient still renders. */
export function PageHero({ title, subtitle, image }: { title: string; subtitle: string; image: string }) {
  return (
    <section
      className="relative isolate flex min-h-[46vh] items-center bg-charcoal bg-cover bg-center"
      style={{ backgroundImage: `url(${image}), linear-gradient(135deg, #333333 0%, #1f1f1f 100%)` }}
    >
      <div className="absolute inset-0 -z-10 bg-black/55" aria-hidden />
      <Container className="py-20">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 text-base text-white/85 sm:text-lg">{subtitle}</p>
        </div>
      </Container>
    </section>
  );
}
