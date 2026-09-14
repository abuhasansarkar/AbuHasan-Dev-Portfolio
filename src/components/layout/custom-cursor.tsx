"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useHasFinePointer } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type CursorKind = "default" | "link" | "cta" | "project" | "drag" | "hidden";

const LABELS: Partial<Record<CursorKind, string>> = { project: "View", drag: "Drag" };

/**
 * Desktop-only custom cursor. Elements opt into variants with `data-cursor="cta|project|link|drag"`.
 * Native cursor is hidden via `html.has-custom-cursor` (see globals.css). Never rendered on touch devices.
 */
export function CustomCursor() {
  const fine = useHasFinePointer();
  const reduced = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<CursorKind>("hidden");
  const enabled = fine === true && reduced === false;

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const ringX = gsap.quickTo(ring, "x", { duration: 0.28, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.28, ease: "power3.out" });
    let rafId: number | null = null;

    const onMove = (e: PointerEvent) => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        gsap.set(dot, { x: e.clientX, y: e.clientY });
        ringX(e.clientX);
        ringY(e.clientY);
      });
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const el = target?.closest<HTMLElement>("[data-cursor], a, button, [role=button], input, textarea, select, label");
      if (!el) return setKind("default");
      const explicit = el.dataset.cursor as CursorKind | undefined;
      if (explicit) return setKind(explicit);
      if (el.matches("input, textarea, select")) return setKind("hidden");
      setKind("link");
    };

    const onLeave = () => setKind("hidden");
    const onEnter = () => setKind("default");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  const label = LABELS[kind];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block">
      <div ref={dotRef} className={cn("absolute left-0 top-0 size-1.5 rounded-full bg-foreground transition-opacity duration-200", (kind === "hidden" || label) && "opacity-0")} />
      <div
        ref={ringRef}
        data-kind={kind}
        className={cn(
          "absolute left-0 top-0 flex items-center justify-center rounded-full border border-foreground/60 text-[11px] font-medium uppercase tracking-[0.18em] text-background transition-[width,height,background-color,border-color,opacity] duration-300 ease-[var(--ease-out-expo)]",
          kind === "hidden" && "size-8 opacity-0",
          kind === "default" && "size-8 opacity-70",
          kind === "link" && "size-12 border-foreground/40 opacity-90",
          kind === "cta" && "size-16 border-accent bg-accent/25 opacity-100",
          kind === "project" && "size-24 border-transparent bg-foreground opacity-100",
          kind === "drag" && "size-20 border-transparent bg-foreground opacity-100",
        )}
      >
        {label}
      </div>
    </div>
  );
}
