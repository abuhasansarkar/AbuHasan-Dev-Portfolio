"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { SubmitButton } from "@/components/admin/submit-button";
import { FormError, FormField } from "@/components/admin/form-field";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/admin/action-state";
import { usePreventFormReset } from "@/lib/admin/use-prevent-form-reset";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState(login, initialActionState);
  const { formRef } = usePreventFormReset(state);
  const e = state.fieldErrors ?? {};

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-5">
      {next && <input type="hidden" name="next" value={next} />}
      <FormField label="Email" name="email" error={e.email}>
        <Input id="email" name="email" type="email" autoComplete="username" required autoFocus />
      </FormField>
      <FormField label="Password" name="password" error={e.password}>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </FormField>
      <FormError message={state.error} />
      <SubmitButton size="lg" className="mt-2 w-full" pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
