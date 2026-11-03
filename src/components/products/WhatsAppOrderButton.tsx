import { MessageCircle } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { orderUrl, type OrderDetails } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** Opens WhatsApp with a prefilled order message. The customer reviews and sends it themselves. */
export function WhatsAppOrderButton({
  details, size = "sm", variant = "primary", className, label = "Order via WhatsApp",
}: {
  details: OrderDetails;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline";
  className?: string;
  label?: string;
}) {
  return (
    <a href={orderUrl(details)} target="_blank" rel="noopener noreferrer" className={cn(buttonStyles(variant, size), className)}>
      <MessageCircle className="h-4 w-4" aria-hidden /> {label}
    </a>
  );
}
