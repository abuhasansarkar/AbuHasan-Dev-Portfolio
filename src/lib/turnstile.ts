import "server-only";

/**
 * Cloudflare Turnstile verification for the public contact form.
 *
 * Disabled by default: when TURNSTILE_SECRET_KEY is missing the check is skipped and the
 * form keeps working exactly as before. Set both TURNSTILE_SECRET_KEY (server) and
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY (browser) to enable the challenge.
 */
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isTurnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstileToken(
  token: string | undefined,
  remoteIp?: string,
): Promise<{ ok: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true };

  if (!token) {
    return { ok: false, error: "Please complete the verification challenge and try again." };
  }

  try {
    // Cloudflare siteverify expects application/x-www-form-urlencoded (NOT JSON).
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      cache: "no-store",
    });

    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (data.success) return { ok: true };

    console.warn("[turnstile] verification rejected:", data["error-codes"]);
    return { ok: false, error: "Verification failed. Please refresh the page and try again." };
  } catch (err) {
    console.error("[turnstile] verification request failed:", err instanceof Error ? err.message : err);
    return { ok: false, error: "Verification is temporarily unavailable — please email me directly instead." };
  }
}
