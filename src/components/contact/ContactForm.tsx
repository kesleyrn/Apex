"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle } from "lucide-react";
import { Button, buttonStyles } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { contactUrl } from "@/lib/whatsapp";

export function ContactForm() {
  const [opened, setOpened] = useState<{ url: string; blocked: boolean } | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { fullName: "", phone: "", email: "", subject: "", message: "" },
  });

  const onSubmit = handleSubmit((values) => {
    const url = contactUrl(values);
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    setOpened({ url, blocked: !win });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
          <Input id="fullName" autoComplete="name" aria-invalid={!!errors.fullName} {...register("fullName")} />
        </Field>
        <Field label="Phone number" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" autoComplete="tel" placeholder="+250 7XX XXX XXX" aria-invalid={!!errors.phone} {...register("phone")} />
        </Field>
      </div>
      <Field label="Email address" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
      </Field>
      <Field label="Subject" htmlFor="subject" error={errors.subject?.message}>
        <Input id="subject" aria-invalid={!!errors.subject} {...register("subject")} />
      </Field>
      <Field label="Message" htmlFor="message" error={errors.message?.message}>
        <Textarea id="message" rows={6} aria-invalid={!!errors.message} {...register("message")} />
      </Field>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
        <MessageCircle className="h-5 w-5" aria-hidden /> Send via WhatsApp
      </Button>

      {opened && (
        <div role="status" className="rounded-md border border-line bg-[#F7F5F2] p-4 text-sm">
          <p className="font-medium">
            {opened.blocked ? "Your browser blocked the WhatsApp window." : "WhatsApp should now be open with your message ready."}
          </p>
          <p className="mt-1 text-charcoal-soft">
            Your enquiry is only sent when you press send inside WhatsApp. If nothing opened, use the button below.
          </p>
          <a href={opened.url} target="_blank" rel="noopener noreferrer" className={`${buttonStyles("outline", "sm")} mt-3`}>
            Open WhatsApp
          </a>
        </div>
      )}
    </form>
  );
}
