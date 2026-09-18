"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, Loader2, RotateCcw, TriangleAlert, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Magnetic } from "@/components/animations/magnetic";
import { contactFormSchema, fieldErrorsFromZod, type ContactFieldErrors } from "@/lib/validation/contact";
import type { SiteSettings } from "@/lib/settings/schema";

const initial: ContactState = { status: "idle" };

const defaultServices = [
  "Full-Stack Web Development",
  "WordPress & WooCommerce Development",
  "Next.js & React Application",
  "Landing Page & UI/UX Design",
  "Speed & Core Web Vitals Optimization",
  "Custom API & Integration",
  "Technical Consultation",
];

export function ContactForm({ contact }: { contact: SiteSettings["contact"] }) {
  const [state, action, pending] = useActionState(submitContact, initial);
  const [clientErrors, setClientErrors] = useState<ContactFieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = { ...clientErrors, ...(state.errors ?? {}) };

  const services = contact.projectTypes?.length ? contact.projectTypes : defaultServices;

  useEffect(() => {
    if (state.status === "success") {
      setSubmitted(true);
      formRef.current?.reset();
      toast.success("Message sent successfully", { description: state.message });
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
      <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-success/30 bg-success/5 p-8 text-center" role="status">
        <div className="flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="size-8" aria-hidden />
        </div>
        <p className="mt-5 font-display text-2xl font-bold tracking-tight">Message Received!</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{state.message}</p>
        <button
          type="button"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-secondary"
          onClick={() => setSubmitted(false)}
        >
          <RotateCcw className="size-4" aria-hidden />
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} onSubmit={validateClient} noValidate className="flex flex-col gap-5" aria-describedby={state.status === "error" && !state.errors ? "form-error" : undefined}>
      {/* Honeypot */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Full Name */}
      <Field label="Full Name *" name="name" error={errors.name}>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="e.g. Sarah Jenkins"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="h-12 rounded-xl border border-border/70 bg-secondary/40 px-4 text-sm placeholder:text-muted-foreground/60 transition-all duration-200 focus-visible:bg-background focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_hsl(var(--ring)/0.2)]"
        />
      </Field>

      {/* Email */}
      <Field label="Email Address *" name="email" error={errors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="e.g. sarah@company.com"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="h-12 rounded-xl border border-border/70 bg-secondary/40 px-4 text-sm placeholder:text-muted-foreground/60 transition-all duration-200 focus-visible:bg-background focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_hsl(var(--ring)/0.2)]"
        />
      </Field>

      {/* Row: Company Name & Service Required */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company Name (optional)" name="company" error={errors.company}>
          <Input
            id="company"
            name="company"
            placeholder="e.g. Acme Corp"
            className="h-12 rounded-xl border border-border/70 bg-secondary/40 px-4 text-sm placeholder:text-muted-foreground/60 transition-all duration-200 focus-visible:bg-background focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_hsl(var(--ring)/0.2)]"
          />
        </Field>

        <Field label="Service Required *" name="projectType" error={errors.projectType}>
          <div className="relative">
            <select
              id="projectType"
              name="projectType"
              defaultValue=""
              required
              aria-invalid={Boolean(errors.projectType)}
              aria-describedby={errors.projectType ? "projectType-error" : undefined}
              className="h-12 w-full appearance-none rounded-xl border border-border/70 bg-secondary/40 px-4 pr-10 text-sm text-foreground transition-all duration-200 focus-visible:bg-background focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:shadow-[0_0_0_3px_hsl(var(--ring)/0.2)]"
            >
              <option value="" disabled className="text-muted-foreground">
                Select service...
              </option>
              {services.map((item) => (
                <option key={item} value={item} className="bg-background text-foreground py-1">
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
          </div>
        </Field>
      </div>

      {/* Project Details */}
      <Field label="Project Details *" name="message" error={errors.message}>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us about your project goals, scope, and timeline..."
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="min-h-[120px] resize-y rounded-xl border border-border/70 bg-secondary/40 p-4 text-sm placeholder:text-muted-foreground/60 transition-all duration-200 focus-visible:bg-background focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_hsl(var(--ring)/0.2)]"
        />
      </Field>

      {state.status === "error" && !state.errors && (
        <p id="form-error" role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {state.message}
        </p>
      )}

      {/* Submit Button */}
      <div className="flex items-center justify-end pt-2">
        <Magnetic strength={0.3}>
          <button
            type="submit"
            disabled={pending}
            data-cursor="cta"
            className="group/btn inline-flex items-center gap-3 rounded-full border border-accent/40 bg-accent py-2 pl-2 pr-6 text-sm font-semibold text-accent-foreground shadow-[0_4px_20px_-3px_hsl(var(--accent)/0.5)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_30px_-4px_hsl(var(--accent)/0.6)] disabled:opacity-60"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-accent-foreground/20 text-accent-foreground shadow-xs transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-12">
              {pending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <ArrowUpRight className="size-4 stroke-[2.5]" aria-hidden />
              )}
            </span>
            <span>{pending ? "Sending..." : "Send Message"}</span>
          </button>
        </Magnetic>
      </div>
    </form>
  );
}

function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="group/field flex flex-col gap-1.5">
      <Label htmlFor={name} className="text-xs font-semibold text-foreground/85">
        {label}
      </Label>
      {children}
      {error && (
        <p id={`${name}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
