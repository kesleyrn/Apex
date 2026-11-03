"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, X } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { buttonStyles } from "@/components/ui/Button";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const whatsapp = buildWhatsAppUrl("Hello Apex Furnishing Rwanda,");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="leading-none" aria-label="Apex Furnishing Rwanda, home">
          <span className="block text-xl font-bold tracking-wide">APEX</span>
          <span className="block text-[9px] uppercase tracking-[0.3em] text-charcoal-soft">Furnishing Rwanda</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={cn("text-sm font-medium transition-colors hover:text-brand", isActive(l.href) ? "text-brand" : "text-charcoal")}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={cn(buttonStyles("primary", "sm"), "hidden sm:inline-flex")}>
            <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
          </a>
          <button
            type="button"
            className="rounded-md p-2 hover:bg-brand-soft md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-line bg-white md:hidden">
          <Container className="flex flex-col py-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn("rounded-md px-3 py-3 text-base font-medium hover:bg-brand-soft", isActive(l.href) ? "text-brand" : "text-charcoal")}
              >
                {l.label}
              </Link>
            ))}
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={cn(buttonStyles("primary", "md"), "mt-3")}>
              <MessageCircle className="h-4 w-4" aria-hidden /> Chat on WhatsApp
            </a>
          </Container>
        </nav>
      )}
    </header>
  );
}
