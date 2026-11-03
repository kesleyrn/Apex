import { Container } from "@/components/layout/Container";
import { BUSINESS } from "@/lib/constants";

export function Welcome() {
  return (
    <section className="py-20 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand">Welcome</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Welcome to {BUSINESS.name}</h2>
          <p className="mt-5 text-charcoal-soft">
            {BUSINESS.name}, part of {BUSINESS.company}, brings you carefully chosen furnishing essentials for every room in your home,
            from soft bedsheets and plush towels to elegant décor.
          </p>
          <p className="mt-4 text-charcoal-soft">
            We are committed to quality, comfort and elegant living, so that coming home always feels special.
          </p>
        </div>
        <div className="rounded-lg bg-[#F7F5F2] p-10 text-center sm:p-14">
          <p className="text-sm uppercase tracking-[0.3em] text-charcoal-soft">Our promise</p>
          <p className="mt-4 text-3xl font-semibold text-charcoal sm:text-4xl">A Touch of <span className="text-brand">Class</span></p>
          <div className="mx-auto mt-6 h-px w-16 bg-brand" aria-hidden />
        </div>
      </Container>
    </section>
  );
}
