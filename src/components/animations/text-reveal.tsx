"use client";

import { useMemo, useRef, type ElementType } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Words (punctuation-insensitive) to render in the accent color */
  highlight?: string[];
  /** Words to render muted */
  muted?: string[];
  delay?: number;
  stagger?: number;
  start?: string;
  /** Animate immediately instead of on scroll */
  immediate?: boolean;
  id?: string;
};

const clean = (w: string) => w.replace(/[^\p{L}\p{N}']/gu, "").toLowerCase();

/**
 * Word-by-word masked reveal. Use "\n" in `text` to force line breaks.
 * Renders real text (aria-friendly) with each word in an overflow-hidden mask.
 */
export function TextReveal({ text, as: Tag = "h2", className, highlight = [], muted = [], delay = 0, stagger = 0.045, start = "top 85%", immediate = false, id }: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const lines = useMemo(() => text.split("\n").map((l) => l.trim().split(/\s+/)), [text]);
  const hi = useMemo(() => new Set(highlight.map(clean)), [highlight]);
  const mu = useMemo(() => new Set(muted.map(clean)), [muted]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>("[data-word]");

    if (reduced) {
      gsap.set(el, { autoAlpha: 1 });
      gsap.set(words, { yPercent: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { autoAlpha: 1 });
      gsap.fromTo(
        words,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger,
          delay,
          ...(immediate ? {} : { scrollTrigger: { trigger: el, start, once: true } }),
        },
      );
    });
    return () => ctx.revert();
  }, [reduced, text, delay, stagger, start, immediate]);

  const Component = Tag as React.ComponentType<{
    ref?: React.Ref<HTMLElement | null>;
    id?: string;
    className?: string;
    children?: React.ReactNode;
    "data-reveal"?: boolean;
    "aria-label"?: string;
  }>;
  return (
    <Component ref={ref} id={id} data-reveal className={cn("clip-lines", className)} aria-label={text.replace(/\n/g, " ")}>
      {lines.map((words, li) => (
        <span key={li} className="line block" aria-hidden>
          {words.map((w, wi) => {
            const c = clean(w);
            return (
              <span key={wi} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
                <span data-word className={cn("inline-block will-change-transform", hi.has(c) && "text-accent", mu.has(c) && "text-muted-foreground")}>
                  {w}
                </span>
                {wi < words.length - 1 ? "\u00a0" : ""}
              </span>
            );
          })}
        </span>
      ))}
    </Component>
  );
}
