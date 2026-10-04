"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { techGroups, type TechGroup } from "@/lib/content/tech";
import { cn } from "@/lib/utils";

/**
 * Per-ring geometry. Radii are stage-relative and must stay small enough that a chip (~10% of the
 * stage width) never leaves the stage — the previous version positioned chips with `cqw` resolved
 * against the *column* rather than the stage, so the outer ring escaped its own box and overlapped
 * the heading text. `duration` is seconds per revolution; `offset` staggers the angular start so
 * chips interleave instead of stacking up radially.
 */
const FALLBACK_RING = { radius: 21, duration: 60, offset: 30 };
const RING_CONFIG = [
  { radius: 41, duration: 100, offset: 22 },
  { radius: 31, duration: 78, offset: 0 },
  FALLBACK_RING,
];

/** The busiest ecosystem earns the outermost ring, so crowded labels always have room. */
function assignRings(groups: TechGroup[]) {
  return groups
    .map((group, order) => ({ group, order }))
    .sort((a, b) => b.group.items.length - a.group.items.length || a.order - b.order)
    .map(({ group }, ring) => ({ ...group, ring }));
}

/** Desktop visual: colour-coded, counter-rotating ecosystem rings around a core hub. */
export function TechOrbit({ name }: { name: string }) {
  const [hover, setHover] = useState<string | null>(null);
  const rings = useMemo(() => assignRings(techGroups), []);
  const active = rings.find((ring) => ring.id === hover);
  const paused = hover !== null;

  /**
   * `animate-spin` supplies the keyframes; these longhands tune direction, speed and pausing.
   *
   * Rings alternate direction so neighbouring orbits don't rotate in lockstep. A chip is a child
   * of its ring, so its own spin must be the EXACT inverse of that ring's (same duration, opposite
   * direction) for the two to cancel and the label to stay upright. Using the same direction for
   * both makes `ring + chip` add up (2θ) and the labels tumble through every angle.
   */
  const spin = (ring: number, duration: number, counter = false): CSSProperties => {
    const reverse = counter ? ring % 2 === 0 : ring % 2 === 1;
    return {
      animationDuration: `${duration}s`,
      animationDirection: reverse ? "reverse" : "normal",
      animationPlayState: paused ? "paused" : "running",
    };
  };

  return (
    <div className="flex flex-col items-center gap-7">
      <div
        role="group"
        aria-label={`Technology orbit. ${rings.map((r) => `${r.label}: ${r.items.join(", ")}`).join(". ")}`}
        /* `cqw` used below resolves against this element, so chip radii are stage-relative. */
        className="relative aspect-square w-full max-w-[620px] select-none [container-type:inline-size]"
      >
        {/* Ambient light behind the hub */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[80px]" />

        {/* Core hub */}
        <div className="absolute left-1/2 top-1/2 z-10 size-[18%] -translate-x-1/2 -translate-y-1/2">
          <div
            aria-hidden
            className="absolute inset-[-9%] rounded-full animate-spin motion-reduce:animate-none"
            style={{ animationDuration: "26s", background: "conic-gradient(from 0deg, transparent 0deg, hsl(var(--accent) / 0.42) 90deg, transparent 210deg)" }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full border border-border/70 bg-card/90 text-center backdrop-blur-xl shadow-[0_0_56px_-18px_hsl(var(--accent)/0.5)]">
            <span className="relative mb-1 flex size-2 items-center justify-center">
              <span className="radar-beacon size-1.5 rounded-full bg-accent" />
            </span>
            <span className="font-display text-sm font-bold tracking-tight text-foreground xl:text-base">{name}</span>
            <span className="mt-0.5 line-clamp-2 px-2 text-[9px] font-medium uppercase leading-tight tracking-[0.12em] text-muted-foreground">
              {active ? active.short : "Design · Code"}
            </span>
          </div>
        </div>

      {rings.map((group) => {
          const { radius, duration, offset } = RING_CONFIG[group.ring] ?? FALLBACK_RING;
          const dim = hover !== null && hover !== group.id;
          const step = 360 / group.items.length;

          return (
            <div
              key={group.id}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-500"
              style={{
                width: `${radius * 2}%`,
                height: `${radius * 2}%`,
                border: `1px solid hsl(${group.color} / ${dim ? 0.08 : 0.18})`,
                opacity: dim ? 0.5 : 1,
              }}
            >
              {/* Sweeping arc gives each ring a sense of direction */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-full animate-spin motion-reduce:animate-none"
                style={{
                  ...spin(group.ring, duration),
                  border: "1px solid transparent",
                  borderTopColor: `hsl(${group.color} / 0.75)`,
                  borderLeftColor: `hsl(${group.color} / 0.2)`,
                }}
              />

              {/* Chips ride the ring; the counter-spin keeps every label upright */}
              <div className="absolute inset-0 rounded-full animate-spin motion-reduce:animate-none" style={spin(group.ring, duration)}>
                {group.items.map((item, i) => {
                  const angle = offset + step * i;
                  return (
                    <span
                      key={item}
                      /* `w-max` makes this box hug the chip exactly, and `translate(-50%,-50%)` first
                         in the chain pins the chip's own centre onto the ring circle. Centring with
                         `-translate-*` on the inner button instead let line-box/baseline alignment
                         shift each label a few px off its ring. */
                      className="absolute left-1/2 top-1/2 block w-max"
                      style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translate(${radius}cqw) rotate(${-angle}deg)` }}
                    >
                      <span
                        /* `flex` so the counter-rotator's box is exactly the button's box, making the
                           spin pivot the chip's centre. */
                        className="flex w-max animate-spin motion-reduce:animate-none"
                        style={spin(group.ring, duration, true)}
                      >
                        <button
                          type="button"
                          onPointerEnter={() => setHover(group.id)}
                          onPointerLeave={() => setHover(null)}
                          onFocus={() => setHover(group.id)}
                          onBlur={() => setHover(null)}
                          aria-label={`${item} — ${group.label}`}
                          className={cn(
                            "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-[11px] font-medium tracking-tight text-foreground/85 shadow-xs backdrop-blur-md transition-all duration-300 xl:text-xs",
                            "hover:border-accent hover:bg-card hover:text-accent hover:scale-[1.07] hover:shadow-[0_0_16px_2px_hsl(var(--accent)/0.3)]",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            dim && "opacity-40",
                          )}
                        >
                          <span
                            aria-hidden
                            className="size-1.5 shrink-0 rounded-full transition-opacity duration-300"
                            style={{ background: `hsl(${group.color})`, opacity: dim ? 0.5 : 1 }}
                          />
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

      {/* Legend — hovering an ecosystem isolates its ring and chips */}
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Technology ecosystems">
        {rings.map((group) => {
          const on = hover === group.id;
          return (
            <li key={group.id}>
              <span
                onPointerEnter={() => setHover(group.id)}
                onPointerLeave={() => setHover(null)}
                className={cn(
                  "inline-flex cursor-default items-center gap-2 text-xs font-medium tracking-tight transition-colors duration-200",
                  on ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  aria-hidden
                  className="size-2 shrink-0 rounded-full transition-all duration-200"
                  style={{ background: `hsl(${group.color})`, boxShadow: on ? `0 0 10px 1px hsl(${group.color} / 0.7)` : undefined }}
                />
                {group.short}
                <span className="text-[10px] tabular-nums text-muted-foreground/60">{group.items.length}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
