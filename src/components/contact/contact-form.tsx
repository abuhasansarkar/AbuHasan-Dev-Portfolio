"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, RotateCcw, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Magnetic } from "@/components/animations/magnetic";
import { contactFormSchema, fieldErrorsFromZod, type ContactFieldErrors } from "@/lib/validation/contact";
import type { SiteSettings } from "@/lib/settings/schema";
import { cn } from "@/lib/utils";

const initial: ContactState = { status: "idle" };

export function ContactForm({ contact }: { contact: SiteSettings["contact"] }) {
  const [state, action, pending] = useActionState(submitContact, initial);
  const [clientErrors, setClientErrors] = useState<ContactFieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = { ...clientErrors, ...(state.errors ?? {}) };

  useEffect(() => {
    if (state.status === "success") {
      setSubmitted(true);
      formRef.current?.reset();
      toast.success("Message sent", { description: state.message });
    } else if (state.status === "error" && !state.errors) {
      toast.error("Could not send", { description: state.message });
    }
  }, [state]);

  const validateClient = (e: React.FormEvent<HTMLFormElement>) => {
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const parsed = contactFormSchema.safeParse(data);
    if (!parsed.success) {
      e.preventDefault();
      const errs = fieldErrorsFromZod(parsed.error);
      setClientErrors(errs);
      const first = Object.keys(errs)[0];
      if (first) e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setClientErrors({});
  };

  if (submitted && state.status === "success") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-success/30 bg-success/5 p-10 text-center" role="status">
        <CheckCircle2 className="size-12 text-success" aria-hidden />
        <p className="mt-6 font-display text-2xl font-semibold tracking-tight">Message received</p>
        <p className="mt-3 max-w-sm text-muted-foreground">{state.message}</p>
        <Button type="button" variant="outline" className="mt-8" onClick={() => setSubmitted(false)}>
          <RotateCcw aria-hidden />
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} onSubmit={validateClient} noValidate className="flex flex-col gap-6" aria-describedby={state.status === "error" && !state.errors ? "form-error" : undefined}>
      {/* Honeypot */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors.name}>
          <Input id="name" name="name" autoComplete="name" placeholder="Your name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
        </Field>
        <Field label="Project type" name="projectType" error={errors.projectType}>
          <Select id="projectType" name="projectType" defaultValue="" required aria-invalid={Boolean(errors.projectType)} aria-describedby={errors.projectType ? "projectType-error" : undefined}>
            <option value="" disabled>
              Choose one
            </option>
            {contact.projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Budget range" name="budget" error={errors.budget}>
          <Select id="budget" name="budget" defaultValue="" required aria-invalid={Boolean(errors.budget)} aria-describedby={errors.budget ? "budget-error" : undefined}>
            <option value="" disabled>
              Choose one
            </option>
            {contact.budgetRanges.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Project description" name="message" error={errors.message} hint="What are you building, fixing or improving? Links welcome.">
        <Textarea id="message" name="message" rows={6} placeholder="Tell me about the project, the goal and the timeline." required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : "message-hint"} />
      </Field>

      {state.status === "error" && !state.errors && (
        <p id="form-error" role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Magnetic>
          <Button type="submit" size="lg" variant="accent" disabled={pending} data-cursor="cta" className="min-w-56">
            {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
            {pending ? "Sending…" : contact.buttonLabel}
            {!pending && <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden />}
          </Button>
        </Magnetic>
        {contact.responseTime && <p className="text-sm text-muted-foreground">{contact.responseTime}</p>}
      </div>
    </form>
  );
}

function Field({ label, name, error, hint, children }: { label: string; name: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-hint`} className={cn("text-xs text-muted-foreground")}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
