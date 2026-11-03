import { Clock, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BUSINESS, MAP_QUERY } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const link = "font-medium hover:text-brand";

export function ContactInfo() {
  const rows = [
    { icon: MapPin, label: "Address", body: (
      <>
        {BUSINESS.address}
        <br />
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`} target="_blank" rel="noopener noreferrer" className="text-sm text-brand hover:underline">
          Open in Google Maps
        </a>
      </>
    ) },
    { icon: Phone, label: "Telephone", body: <a href={`tel:${BUSINESS.phoneTel}`} className={link}>{BUSINESS.phoneDisplay}</a> },
    { icon: MessageCircle, label: "WhatsApp", body: <a href={buildWhatsAppUrl("Hello Apex Furnishing Rwanda,")} target="_blank" rel="noopener noreferrer" className={link}>{BUSINESS.phoneDisplay}</a> },
    { icon: Mail, label: "Email", body: <a href={`mailto:${BUSINESS.email}`} className={link}>{BUSINESS.email}</a> },
    { icon: Clock, label: "Business hours", body: <>{BUSINESS.hours.days}, {BUSINESS.hours.open} to {BUSINESS.hours.close}</> },
  ];

  return (
    <div className="rounded-lg border border-line bg-white p-6 sm:p-8">
      <h2 className="text-xl font-semibold">{BUSINESS.name}</h2>
      <p className="text-sm text-charcoal-soft">{BUSINESS.company}</p>

      <dl className="mt-6 space-y-5">
        {rows.map(({ icon: Icon, label, body }) => (
          <div key={label} className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"><Icon className="h-4 w-4" aria-hidden /></span>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-charcoal-soft">{label}</dt>
              <dd className="mt-0.5 text-sm">{body}</dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex gap-3 border-t border-line pt-6">
        <a href={BUSINESS.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium hover:text-brand">
          <Instagram className="h-4 w-4" aria-hidden /> @{BUSINESS.instagram.handle}
        </a>
      </div>
      <a href={BUSINESS.facebook.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-medium hover:text-brand">
        <Facebook className="h-4 w-4" aria-hidden /> {BUSINESS.facebook.name}
      </a>
    </div>
  );
}
