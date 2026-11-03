import { BadgeCheck, BedDouble, Headset, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";

const POINTS = [
  { icon: BadgeCheck, title: "Quality", text: "Products chosen for their materials, finish and lasting value." },
  { icon: BedDouble, title: "Comfort", text: "Soft, restful essentials that make every day at home feel better." },
  { icon: Sparkles, title: "Elegance", text: "Refined designs that bring a premium look to any room." },
  { icon: Headset, title: "Customer Service", text: "Friendly help on WhatsApp, from choosing to ordering." },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Why choose us" title="Furnishing made simple and special" align="center" />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-lg border border-line p-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-charcoal-soft">{text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
