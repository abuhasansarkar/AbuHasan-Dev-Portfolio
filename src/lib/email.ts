import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

/**
 * Gmail SMTP email client configuration with Nodemailer.
 *
 * For Gmail SMTP:
 * 1. Enable 2-Step Verification in your Google Account.
 * 2. Generate an App Password at: https://myaccount.google.com/apppasswords
 * 3. Set GMAIL_USER (your Gmail address, e.g. abuhasansarkar2@gmail.com)
 * 4. Set GMAIL_APP_PASSWORD (the 16-character app password)
 *
 * Backward-compatible fallbacks for SMTP_USER/SMTP_PASS and BREVO_SENDER_EMAIL are included.
 */
const gmailUser =
  process.env.GMAIL_USER ||
  process.env.SMTP_USER ||
  process.env.BREVO_SENDER_EMAIL ||
  "";

const gmailPass =
  process.env.GMAIL_APP_PASSWORD ||
  process.env.SMTP_PASS ||
  process.env.GMAIL_PASS ||
  "";

const senderName =
  process.env.SMTP_SENDER_NAME ||
  process.env.BREVO_SENDER_NAME ||
  "AbuHasan Portfolio";

const receiverEmail =
  process.env.NOTIFICATION_RECEIVER_EMAIL ||
  gmailUser ||
  "abuhasansarkar2@gmail.com";

let transporter: Transporter | null = null;

function getEmailTransporter(): Transporter | null {
  if (!gmailUser || !gmailPass) {
    console.warn(
      "[email] Gmail SMTP not configured (missing GMAIL_USER or GMAIL_APP_PASSWORD / SMTP_PASS) - email notifications disabled"
    );
    return null;
  }

  if (!transporter) {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const secure = process.env.SMTP_SECURE === "true" || port === 465;

    if (host) {
      transporter = nodemailer.createTransport({
        host,
        port: port ?? 587,
        secure: secure ?? false,
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });
    }
  }

  return transporter;
}

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  projectLink?: string;
  message: string;
}

function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ).replace(/\/$/, "");
}

/**
 * Send contact form notification email to admin via Gmail SMTP (Nodemailer)
 */
export async function sendContactNotification(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  const transport = getEmailTransporter();

  if (!transport) {
    return { success: false, error: "Email transporter not configured" };
  }

  try {
    const siteUrl = getSiteUrl();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #92400e;">New Contact Form Submission</h1>
          <p style="margin: 8px 0 0; font-size: 14px; color: #b45309;">From your portfolio website</p>
        </div>
        
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-top: none; padding: 30px; border-radius: 0 0 12px 12px;">
          <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h2 style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #374151;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #6b7280; width: 120px;">Name:</td>
                <td style="padding: 8px 0; color: #1f2937;">${escapeHtml(data.name)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Email:</td>
                <td style="padding: 8px 0; color: #1f2937;"><a href="mailto:${escapeHtml(data.email)}" style="color: #2563eb; text-decoration: none;">${escapeHtml(data.email)}</a></td>
              </tr>
              ${data.company ? `
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Company:</td>
                <td style="padding: 8px 0; color: #1f2937;">${escapeHtml(data.company)}</td>
              </tr>
              ` : ""}
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Service:</td>
                <td style="padding: 8px 0; color: #1f2937;">${escapeHtml(data.projectType)}</td>
              </tr>
              ${data.budget ? `
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Budget:</td>
                <td style="padding: 8px 0; color: #1f2937;">${escapeHtml(data.budget)}</td>
              </tr>
              ` : ""}
              ${data.timeline ? `
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Timeline:</td>
                <td style="padding: 8px 0; color: #1f2937;">${escapeHtml(data.timeline)}</td>
              </tr>
              ` : ""}
              ${data.projectLink ? `
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Project Link:</td>
                <td style="padding: 8px 0; color: #1f2937;"><a href="${escapeHtml(data.projectLink)}" style="color: #2563eb; text-decoration: none;">${escapeHtml(data.projectLink)}</a></td>
              </tr>
              ` : ""}
            </table>
          </div>

          <div style="background: #f9fafb; border-radius: 8px; padding: 20px;">
            <h2 style="margin: 0 0 12px; font-size: 16px; font-weight: 600; color: #374151;">Message</h2>
            <div style="white-space: pre-wrap; color: #1f2937; font-size: 14px;">${escapeHtml(data.message)}</div>
          </div>

          <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <a href="${siteUrl}/admin/submissions" 
               style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
              View in Admin Dashboard
            </a>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
          <p>This email was sent from your portfolio contact form.</p>
          <p>Reply directly to this email to respond to ${escapeHtml(data.name)}.</p>
        </div>
      </body>
      </html>
    `;

    const textContent = `
New Contact Form Submission

Contact Details:
- Name: ${data.name}
- Email: ${data.email}
${data.company ? `- Company: ${data.company}` : ""}
- Service: ${data.projectType}
${data.budget ? `- Budget: ${data.budget}` : ""}
${data.timeline ? `- Timeline: ${data.timeline}` : ""}
${data.projectLink ? `- Project Link: ${data.projectLink}` : ""}

Message:
${data.message}

---
View in Admin Dashboard: ${siteUrl}/admin/submissions
Reply directly to this email to respond to ${data.name}.
    `.trim();

    await transport.sendMail({
      from: `"${senderName}" <${gmailUser}>`,
      to: receiverEmail,
      replyTo: `"${data.name}" <${data.email}>`,
      subject: `New Contact: ${data.name} - ${data.projectType}`,
      text: textContent,
      html: htmlContent,
    });

    console.log("[email] Contact notification sent successfully via Gmail SMTP");
    return { success: true };
  } catch (error) {
    console.error("[email] Failed to send contact notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send auto-reply confirmation to the person who submitted the form via Gmail SMTP (Nodemailer)
 */
export async function sendContactAutoReply(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  const transport = getEmailTransporter();

  if (!transport) {
    return { success: false, error: "Email transporter not configured" };
  }

  try {
    const siteUrl = getSiteUrl();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1e40af;">Thanks for reaching out!</h1>
          <p style="margin: 8px 0 0; font-size: 14px; color: #1e40af;">I've received your message and will get back to you soon.</p>
        </div>
        
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-top: none; padding: 30px; border-radius: 0 0 12px 12px;">
          <p style="font-size: 16px; color: #374151;">Hi ${escapeHtml(data.name)},</p>
          
          <p style="font-size: 14px; color: #4b5563;">Thank you for contacting me through my portfolio. I've received your inquiry about <strong>${escapeHtml(data.projectType)}</strong> and will review it carefully.</p>
          
          <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #374151;">What happens next?</h3>
            <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #4b5563;">
              <li>I'll review your project details within one business day</li>
              <li>I'll reply to this email with my thoughts and next steps</li>
              <li>If we're a good fit, we can schedule a quick discovery call</li>
            </ul>
          </div>

          <p style="font-size: 14px; color: #4b5563;">In the meantime, feel free to check out my <a href="${siteUrl}/#work" style="color: #2563eb;">recent work</a> or <a href="${siteUrl}/#blog" style="color: #2563eb;">blog articles</a>.</p>

          <p style="font-size: 14px; color: #4b5563;">Best regards,<br><strong>Abu Hasan Sarkar</strong><br>Full-Stack Web Developer & WordPress Specialist</p>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
          <p>This is an automated confirmation. Please don't reply to this email directly.</p>
          <p>If you have urgent questions, email me at <a href="mailto:${escapeHtml(receiverEmail)}" style="color: #2563eb;">${escapeHtml(receiverEmail)}</a></p>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Thanks for reaching out, ${data.name}!

I've received your inquiry about ${data.projectType} and will review it carefully.

What happens next?
- I'll review your project details within one business day
- I'll reply to this email with my thoughts and next steps
- If we're a good fit, we can schedule a quick discovery call

In the meantime, feel free to check out my work at ${siteUrl}/#work

Best regards,
Abu Hasan Sarkar
Full-Stack Web Developer & WordPress Specialist

---
This is an automated confirmation. Please don't reply to this email directly.
If you have urgent questions, email me at ${receiverEmail}
    `.trim();

    await transport.sendMail({
      from: `"${senderName}" <${gmailUser}>`,
      to: `"${data.name}" <${data.email}>`,
      replyTo: receiverEmail,
      subject: `Thanks for contacting me, ${data.name}!`,
      text: textContent,
      html: htmlContent,
    });

    console.log("[email] Auto-reply sent successfully via Gmail SMTP");
    return { success: true };
  } catch (error) {
    console.error("[email] Failed to send auto-reply:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}