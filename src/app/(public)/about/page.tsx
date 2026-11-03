import type { Metadata } from "next";
import { BadgeCheck, Eye, HeartHandshake, ShieldCheck, Sparkles, Target, TrendingUp } from "lucide-react";
import { CtaBanner } from "@/components/home/CtaBanner";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ABOUT_IMAGE, BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description: `${BUSINESS.name}, operating under ${BUSINESS.company}, offers quality furnishing products that bring comfort and elegance into every home.`,
};

const VALUES = [
  { icon: BadgeCheck, title: "Quality", text: "We select products for their materials, finish and lasting value." },
  { icon: HeartHandshake, title: "Customer Satisfaction", text: "Every customer deserves helpful, friendly and honest service." },
  { icon: Sparkles, title: "Elegance", text: "Refined designs that give every room a premium feel." },
  { icon: ShieldCheck, title: "Reliability", text: "We do what we say, so you can order with confidence." },
  { icon: TrendingUp, title: "Continuous Improvement", text: "We keep growing our range and service to serve you better." },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero title="About Apex Furnishing Rwanda." subtitle="Discover our passion for comfort, quality and elegant living." image={ABOUT_IMAGE} />

      <section className="py-20 sm:py-24" aria-labelledby="who-heading">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand">Who we are</p>
            <h2 id="who-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">A furnishing business built on comfort</h2>
          </div>
          <div className="space-y-4 text-charcoal-soft">
            <p>
              {BUSINESS.name} is a furnishing business operating under {BUSINESS.company}. We offer bedsheets, pillows, duvets, towels,
              décor, robes and bed covers for homes across Rwanda.
            </p>
            <p>
              Our focus is simple: provide quality furnishing products that enhance the comfort and beauty of the home, so every room feels
              welcoming and well finished.
            </p>
            <p>You can visit us at CHIC Complex in Kigali, or browse online and order directly on WhatsApp.</p>
          </div>
        </Container>
      </section>

      <section className="bg-[#F7F5F2] py-20 sm:py-24">
        <Container className="grid gap-6 md:grid-cols-2">
          {[
            { icon: Target, label: "Our Mission", text: "To provide quality furnishing solutions that enhance everyday comfort and bring elegance into every home." },
            { icon: Eye, label: "Our Vision", text: "To become a trusted destination for home furnishing products in Rwanda, recognised for quality, variety and excellent customer service." },
          ].map(({ icon: Icon, label, text }) => (
            <article key={label} className="rounded-lg bg-white p-8 sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand"><Icon className="h-5 w-5" aria-hidden /></span>
              <h2 className="mt-5 text-xl font-semibold">{label}</h2>
              <p className="mt-3 text-charcoal-soft">{text}</p>
            </article>
          ))}
        </Container>
      </section>

      <section className="py-20 sm:py-24" aria-labelledby="values-heading">
        <Container>
          <SectionHeading eyebrow="What guides us" title="Our Core Values" align="center" />
          <h2 id="values-heading" className="sr-only">Core values</h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-lg border border-line p-6 text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand"><Icon className="h-5 w-5" aria-hidden /></span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-charcoal-soft">{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBanner title="Discover Pieces You Will Love." text="Explore our collection of quality home furnishing essentials." primaryLabel="Explore Our Collection" />
    </main>
  );
}
