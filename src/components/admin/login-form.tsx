"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { SubmitButton } from "@/components/admin/submit-button";
import { FormError, FormField } from "@/components/admin/form-field";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/admin/action-state";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState(login, initialActionState);

  return (
    <form action={action} className="flex flex-col gap-5">
      {next && <input type="hidden" name="next" value={next} />}
      <FormField label="Email" name="email">
        <Input id="email" name="email" type="email" autoComplete="username" required autoFocus />
      </FormField>
      <FormField label="Password" name="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </FormField>
      <FormError message={state.error} />
      <SubmitButton size="lg" className="mt-2 w-full" pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
