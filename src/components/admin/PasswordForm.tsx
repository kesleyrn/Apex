"use client";

import { useActionState } from "react";
import { changePassword } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, {});
  return (
    <form action={action} className="max-w-sm space-y-5">
      <Field label="New password" htmlFor="password" hint="At least 8 characters.">
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
      </Field>
      <Field label="Confirm new password" htmlFor="confirm">
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required />
      </Field>
      {state.error && <p role="alert" className="text-sm font-medium text-brand">{state.error}</p>}
      {state.success && <p role="status" className="text-sm font-medium text-emerald-700">{state.success}</p>}
      <Button type="submit" disabled={pending}>{pending ? "Updating…" : "Change password"}</Button>
    </form>
  );
}
