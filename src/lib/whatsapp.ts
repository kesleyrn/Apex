import { BUSINESS } from "./constants";
import { formatRWF } from "./utils";

export type OrderDetails = {
  name: string;
  code: string;
  category: string;
  quantity: number;
  price?: number | null;
  size?: string | null;
  color?: string | null;
};

export type ContactDetails = {
  fullName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

/** Official wa.me format with a safely encoded message. */
export function buildWhatsAppUrl(message: string, phone: string = BUSINESS.whatsappNumber): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(99, Math.max(1, Math.floor(value)));
}

export function buildOrderMessage(d: OrderDetails): string {
  const price = formatRWF(d.price);
  const lines = [
    `Hello ${BUSINESS.name},`,
    "",
    "I would like to place an order for the following product:",
    "",
    `Product: ${d.name}`,
    `Product ID: ${d.code}`,
    `Category: ${d.category}`,
    `Quantity: ${clampQuantity(d.quantity)}`,
    ...(d.size ? [`Size: ${d.size}`] : []),
    ...(d.color ? [`Colour: ${d.color}`] : []),
    ...(price ? [`Price: ${price}`] : []),
    "",
    "Please confirm availability and provide further ordering information.",
    "",
    "Thank you.",
  ];
  return lines.join("\n");
}

export function buildContactMessage(d: ContactDetails): string {
  return [
    `Hello ${BUSINESS.name},`,
    "",
    "I would like to make an enquiry.",
    "",
    `Name: ${d.fullName}`,
    `Phone: ${d.phone}`,
    `Email: ${d.email}`,
    `Subject: ${d.subject}`,
    "",
    "Message:",
    d.message,
    "",
    "Thank you.",
  ].join("\n");
}

export const orderUrl = (d: OrderDetails) => buildWhatsAppUrl(buildOrderMessage(d));
export const contactUrl = (d: ContactDetails) => buildWhatsAppUrl(buildContactMessage(d));
