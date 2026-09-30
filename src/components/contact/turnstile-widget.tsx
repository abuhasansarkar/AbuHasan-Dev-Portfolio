"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

function getTurnstile(): TurnstileApi | undefined {
  return (window as unknown as { turnstile?: TurnstileApi }).turnstile;
}

/**
 * Cloudflare Turnstile challenge widget.
 *
 * Renders nothing unless a site key is provided (NEXT_PUBLIC_TURNSTILE_SITE_KEY); the
 * server verifies the resulting token with TURNSTILE_SECRET_KEY (see src/lib/turnstile.ts).
 * The token is submitted as the hidden `turnstileToken` form field.
 */
export function TurnstileWidget({
  siteKey,
  onTokenChange,
}: {
  siteKey: string;
  onTokenChange: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!scriptReady || !containerRef.current || widgetIdRef.current) return;
    const turnstile = getTurnstile();
    if (!turnstile) return;

    widgetIdRef.current = turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "auto",
      size: "normal",
      callback: (token: string) => onTokenChange(token),
      "expired-callback": () => onTokenChange(""),
      "error-callback": () => onTokenChange(""),
    });

    const widgetId = widgetIdRef.current;
    return () => {
      try {
        getTurnstile()?.remove(widgetId);
      } catch {
        // widget already gone – nothing to clean up
      }
      widgetIdRef.current = null;
    };
  }, [scriptReady, siteKey, onTokenChange]);

  return (
    <div className="flex flex-col gap-2">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} data-sitekey={siteKey} />
      <p className="text-xs text-muted-foreground">Protected by Cloudflare Turnstile.</p>
    </div>
  );
}
