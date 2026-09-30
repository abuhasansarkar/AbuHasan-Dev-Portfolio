import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address").max(160),
  company: z.string().trim().max(120, "Company name is too long").optional().or(z.literal("")),
  projectType: z.string().trim().min(1, "Please choose a service").max(80),
  budget: z.string().trim().max(80).optional().default("Flexible / Discussion"),
  timeline: z.string().trim().max(80).optional().default("Flexible"),
  projectLink: z.string().trim().max(250).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please tell us a little more about your project (at least 10 characters)").max(3000, "Please keep it under 3000 characters"),
  /**
   * Cloudflare Turnstile token. Optional here (the challenge only renders when
   * configured); the server action decides whether a missing token is acceptable.
   */
  turnstileToken: z.string().max(4096).optional(),
  /**
   * Honeypot: hidden from humans, must stay empty. Deliberately accepts any
   * value here so bots that fill it do NOT get a validation error – the server
   * action silently discards submissions where this field is filled.
   */
  website: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type ContactFieldErrors = Partial<Record<keyof ContactFormInput, string>>;

export function fieldErrorsFromZod(error: z.ZodError): ContactFieldErrors {
  const out: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ContactFormInput | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
