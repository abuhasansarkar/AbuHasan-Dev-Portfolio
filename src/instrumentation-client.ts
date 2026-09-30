import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || undefined;

Sentry.init({
  dsn,
  enabled: Boolean(dsn) && process.env.NODE_ENV === "production",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event: Sentry.ErrorEvent) {
    if (event.request) {
      delete event.request.headers;
      delete event.request.cookies;
    }
    return event;
  },
});
