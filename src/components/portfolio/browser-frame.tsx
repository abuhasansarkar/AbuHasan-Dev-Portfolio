import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/** Minimal browser chrome around a screenshot so demo images read as real websites. */
export function BrowserFrame({ children, url, className, accent }: { children: ReactNode; url?: string; className?: string; accent?: string | null }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_25px_70px_-20px_rgba(0,0,0,0.5)] transition-shadow duration-500", className)}>
      <div className="flex h-9 items-center gap-2 border-b border-border/70 bg-secondary/70 backdrop-blur-md px-3.5">
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f56]/80 shadow-[0_0_4px_rgba(255,95,86,0.5)]" />
          <span className="size-2.5 rounded-full bg-[#ffbd2e]/80 shadow-[0_0_4px_rgba(255,189,46,0.5)]" />
          <span className="size-2.5 rounded-full bg-[#27c93f]/80 shadow-[0_0_4px_rgba(39,201,63,0.5)]" />
        </span>
        <span className="mx-auto flex h-5.5 w-3/5 max-w-xs items-center justify-center gap-1.5 rounded-full bg-background/80 px-3 text-[11px] font-mono text-muted-foreground shadow-xs border border-border/40">
          <Lock className="size-2.5 text-success shrink-0" aria-hidden />
          <span className="truncate">{url || "https://…"}</span>
        </span>
        <span className="size-2 rounded-full shrink-0" style={{ background: accent ?? "hsl(var(--accent))" }} title="Project Accent" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

