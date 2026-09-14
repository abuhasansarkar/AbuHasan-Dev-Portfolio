import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Minimal browser chrome around a screenshot so demo images read as real websites. */
export function BrowserFrame({ children, url, className, accent }: { children: ReactNode; url?: string; className?: string; accent?: string | null }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]", className)}>
      <div className="flex h-9 items-center gap-2 border-b border-border bg-secondary/60 px-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full" style={{ background: accent ?? "hsl(var(--accent))" }} />
        </span>
        <span className="mx-auto flex h-5 w-1/2 items-center justify-center rounded-md bg-background/70 px-2 text-[10px] text-muted-foreground">
          <span className="truncate">{url || "https://…"}</span>
        </span>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
