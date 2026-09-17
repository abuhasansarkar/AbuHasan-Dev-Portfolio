import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address").max(160),
  company: z.string().trim().max(120, "Company name is too long").optional().or(z.literal("")),
  projectType: z.string().trim().min(1, "Please choose a service").max(80),
  budget: z.string().trim().max(80).optional().default("Flexible / Discussion"),
  message: z.string().trim().min(10, "Please tell us a little more about your project (at least 10 characters)").max(3000, "Please keep it under 3000 characters"),
  /** Honeypot: must stay empty. Hidden from humans. */
  website: z.string().max(0).optional().or(z.literal("")),
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
