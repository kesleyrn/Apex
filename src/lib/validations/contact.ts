import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{9,15}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email address").max(120),
  subject: z.string().trim().min(3, "Enter a subject").max(120),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

export type ContactInput = z.infer<typeof contactSchema>;
