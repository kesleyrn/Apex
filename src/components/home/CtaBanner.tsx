import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type Props = { title?: string; text?: string; primaryLabel?: string; primaryHref?: string };

export function CtaBanner({
  title = "Give Your Home a Touch of Class.",
  text = "Browse the collection, then order in minutes on WhatsApp.",
  primaryLabel = "Shop the Collection",
  primaryHref = "/shop",
}: Props) {
  return (
    <section className="bg-charcoal py-20 text-white">
      <Container className="text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/75">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={primaryHref} size="lg">{primaryLabel}</Button>
          <Button href={buildWhatsAppUrl("Hello Apex Furnishing Rwanda,")} external size="lg" variant="light">
            <MessageCircle className="h-4 w-4" aria-hidden /> Chat on WhatsApp
          </Button>
        </div>
      </Container>
    </section>
  );
}
