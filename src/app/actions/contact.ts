"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { CONTACT_RATE_LIMIT, rateLimit } from "@/lib/auth/rate-limit";
import { contactFormSchema, fieldErrorsFromZod, type ContactFieldErrors } from "@/lib/validation/contact";
import { sendContactNotification, sendContactAutoReply } from "@/lib/email";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: ContactFieldErrors;
};

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
    projectType: String(formData.get("projectType") || formData.get("service") || ""),
    budget: String(formData.get("budget") || "Flexible / Discussion"),
    timeline: String(formData.get("timeline") || "Flexible"),
    projectLink: String(formData.get("projectLink") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields.", errors: fieldErrorsFromZod(parsed.error) };
  }

  // Honeypot filled → silently accept without storing
  if (parsed.data.website) return { status: "success", message: "Thanks! Your message has been received." };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const limit = await rateLimit(`contact:${ip}`, CONTACT_RATE_LIMIT);
  if (!limit.ok) {
    return { status: "error", message: `Too many messages from this connection. Please try again in about ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.` };
  }

  try {
    const metaParts = [];
    if (parsed.data.company) metaParts.push(`Company: ${parsed.data.company}`);
    if (parsed.data.timeline) metaParts.push(`Timeline: ${parsed.data.timeline}`);
    if (parsed.data.projectLink) metaParts.push(`Project Link: ${parsed.data.projectLink}`);

    const formattedMessage = metaParts.length > 0
      ? `[${metaParts.join(" | ")}]\n\n${parsed.data.message}`
      : parsed.data.message;

    await prisma.contactSubmission.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        projectType: parsed.data.projectType,
        budget: parsed.data.budget ?? "Flexible / Discussion",
        message: formattedMessage,
        userAgent: h.get("user-agent")?.slice(0, 255) ?? null,
      },
    });

    // Send email notifications (non-blocking - don't fail the request if email fails)
    const emailData = {
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company || undefined,
      projectType: parsed.data.projectType,
      budget: parsed.data.budget,
      timeline: parsed.data.timeline,
      projectLink: parsed.data.projectLink || undefined,
      message: parsed.data.message,
    };

    // Fire and forget - don't await to avoid slowing down the response
    sendContactNotification(emailData).catch((err) => 
      console.error("[contact] Failed to send notification email:", err)
    );
    sendContactAutoReply(emailData).catch((err) => 
      console.error("[contact] Failed to send auto-reply email:", err)
    );

    return { status: "success", message: "Thanks! Your message has been received. I usually reply within one business day." };
  } catch (err) {
    console.error("[contact] failed to store submission:", err instanceof Error ? err.message : err);
    return { status: "error", message: "Something went wrong while sending your message. Please try again in a moment." };
  }
}
