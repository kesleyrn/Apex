"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signIn, {});
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      {state.error && <p role="alert" className="rounded-md bg-brand-soft px-3 py-2 text-sm font-medium text-brand-dark">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Signing in…</> : "Sign in"}
      </Button>
    </form>
  );
}
