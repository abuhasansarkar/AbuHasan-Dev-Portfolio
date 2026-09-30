import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || undefined;

const baseOptions = {
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // sample 10% of transactions to keep quota use low
  beforeSend(event: Sentry.ErrorEvent) {
    // Never ship session cookies / auth headers to a third party.
    if (event.request) {
      delete event.request.headers;
      delete event.request.cookies;
    }
    return event;
  },
};

/**
 * Next.js instrumentation hook (runs once per server/edge runtime boot).
 * Sentry stays fully disabled until SENTRY_DSN (or NEXT_PUBLIC_SENTRY_DSN) is set.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({ ...baseOptions, serverName: "portfolio-node" });
  } else if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({ ...baseOptions, serverName: "portfolio-edge" });
  }
}

/**
 * Captures errors from Route Handlers and Server Actions (Next.js 15.2+).
 * Without a DSN this is a no-op.
 */
export const onRequestError = Sentry.captureRequestError;
