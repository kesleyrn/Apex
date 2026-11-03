import Link from "next/link";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { BUSINESS, DEFAULT_CATEGORIES, NAV_LINKS } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export function Footer() {
  const h = "mb-4 text-sm font-semibold uppercase tracking-wider text-white";
  const a = "text-sm text-white/70 transition-colors hover:text-white";
  return (
    <footer className="mt-24 bg-charcoal text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xl font-bold tracking-wide">APEX</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Furnishing Rwanda</p>
          <p className="mt-4 text-sm text-white/70">{BUSINESS.tagline}. Quality home furnishing essentials by {BUSINESS.company}.</p>
          <div className="mt-5 flex gap-3">
            <a href={BUSINESS.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full border border-white/20 p-2 hover:border-brand hover:bg-brand"><Instagram className="h-4 w-4" /></a>
            <a href={BUSINESS.facebook.url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full border border-white/20 p-2 hover:border-brand hover:bg-brand"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>

        <nav aria-label="Footer">
          <h2 className={h}>Explore</h2>
          <ul className="space-y-2.5">{NAV_LINKS.map((l) => <li key={l.href}><Link href={l.href} className={a}>{l.label}</Link></li>)}</ul>
        </nav>

        <nav aria-label="Categories">
          <h2 className={h}>Categories</h2>
          <ul className="space-y-2.5">
            {DEFAULT_CATEGORIES.map((c) => <li key={c}><Link href={`/shop?category=${slugify(c)}`} className={a}>{c}</Link></li>)}
          </ul>
        </nav>

        <div>
          <h2 className={h}>Visit or contact us</h2>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{BUSINESS.address}</li>
            <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /><a href={`tel:${BUSINESS.phoneTel}`} className="hover:text-white">{BUSINESS.phoneDisplay}</a></li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /><a href={`mailto:${BUSINESS.email}`} className="hover:text-white">{BUSINESS.email}</a></li>
            <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{BUSINESS.hours.days}, {BUSINESS.hours.open} to {BUSINESS.hours.close}</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-wrap items-center justify-between gap-2 py-5 text-xs text-white/50">
          <p>© {new Date().getFullYear()} {BUSINESS.name}. Operated by {BUSINESS.company}.</p>
          <Link href="/admin/login" className="hover:text-white">Admin</Link>
        </Container>
      </div>
    </footer>
  );
}
