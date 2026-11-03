import type { Metadata } from "next";
import { CtaBanner } from "@/components/home/CtaBanner";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { BUSINESS, CONTACT_IMAGE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Visit ${BUSINESS.name} at CHIC Complex, Kigali, or send an enquiry on WhatsApp. Open daily, ${BUSINESS.hours.open} to ${BUSINESS.hours.close}.`,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeGoodsStore",
  name: BUSINESS.name,
  parentOrganization: { "@type": "Organization", name: BUSINESS.company },
  telephone: BUSINESS.phoneTel,
  email: BUSINESS.email,
  address: { "@type": "PostalAddress", streetAddress: "Ave KN2, Nyarugenge, Shop D49, Ground Floor, CHIC Complex", addressLocality: "Kigali", addressCountry: "RW" },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "10:00", closes: "20:00" }],
  sameAs: [BUSINESS.instagram.url],
};

export default function ContactPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero title="Get in Touch with Us." subtitle="We are here to help you discover the perfect furnishing products for your home." image={CONTACT_IMAGE} />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-14">
          <ContactInfo />
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Send us an enquiry</h2>
            <p className="mb-8 mt-2 text-charcoal-soft">Fill in your details and we will open WhatsApp with your message ready to send.</p>
            <ContactForm />
          </div>
        </Container>
      </section>

      <section className="pb-16 sm:pb-20" aria-labelledby="map-heading">
        <Container>
          <h2 id="map-heading" className="mb-6 text-2xl font-semibold tracking-tight">Find us in Kigali</h2>
          <MapEmbed />
        </Container>
      </section>

      <CtaBanner title="We Would Love to Hear from You." text="Message us on WhatsApp or visit the shop at CHIC Complex." primaryLabel="Browse the Collection" />
    </main>
  );
}
