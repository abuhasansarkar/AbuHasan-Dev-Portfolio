"use client";

import { useState } from "react";
import { techGroups } from "@/lib/content/tech";
import { cn } from "@/lib/utils";

const RINGS = [
  { radius: 34, duration: 70 },
  { radius: 50, duration: 95 },
  { radius: 66, duration: 120 },
] as const;

/** Desktop visual: three counter-rotating rings of technology labels around a static core. */
export function TechOrbit({ name }: { name: string }) {
  const [hover, setHover] = useState<string | null>(null);
  const activeGroup = techGroups.find((g) => g.id === hover);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[720px] select-none" role="img" aria-label={`Technology orbit: ${techGroups.map((g) => g.items.join(", ")).join("; ")}`}>
      {/* Core */}
      <div className="absolute left-1/2 top-1/2 z-10 flex size-[28%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-border bg-card text-center shadow-[0_0_80px_-20px_hsl(var(--accent)/0.5)]">
        <span className="font-display text-lg font-semibold tracking-tight lg:text-xl">{name}</span>
        <span className="mt-1 px-4 text-[11px] leading-tight text-muted-foreground">{activeGroup ? activeGroup.label : "Design · Development · Conversion"}</span>
      </div>

      {techGroups.map((group, gi) => {
        const ring = RINGS[gi] ?? RINGS[2];
        const size = ring.radius * 2;
        const dim = hover !== null && hover !== group.id;
        return (
          <div
            key={group.id}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/70"
            style={{ width: `${size}%`, height: `${size}%` }}
          >
            <div
              className="absolute inset-0 animate-[spin_linear_infinite] motion-reduce:animate-none"
              style={{ animationDuration: `${ring.duration}s`, animationDirection: gi % 2 ? "reverse" : "normal", animationPlayState: hover ? "paused" : "running" }}
            >
              {group.items.map((item, i) => {
                const angle = (360 / group.items.length) * i;
                return (
                  <span
                    key={item}
                    className="absolute left-1/2 top-1/2"
                    style={{ transform: `rotate(${angle}deg) translate(${size / 2}cqw) rotate(${-angle}deg)` }}
                  >
                    <span
                      className="block animate-[spin_linear_infinite] motion-reduce:animate-none"
                      style={{ animationDuration: `${ring.duration}s`, animationDirection: gi % 2 ? "normal" : "reverse", animationPlayState: hover ? "paused" : "running" }}
                    >
                      <button
                        type="button"
                        onPointerEnter={() => setHover(group.id)}
                        onPointerLeave={() => setHover(null)}
                        onFocus={() => setHover(group.id)}
                        onBlur={() => setHover(null)}
                        className={cn(
                          "-translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium tracking-tight transition-all duration-300 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:text-sm",
                          dim && "opacity-30",
                        )}
                        aria-label={`${item} (${group.label})`}
                      >
                        {item}
                      </button>
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
