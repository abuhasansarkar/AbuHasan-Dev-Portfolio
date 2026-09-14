"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Seconds */
  delay?: number;
  /** Pixels to travel upward */
  y?: number;
  /** Stagger direct children instead of animating the wrapper */
  stagger?: number;
  /** ScrollTrigger start */
  start?: string;
  duration?: number;
  scale?: number;
};

/** Fade-up reveal on scroll. Wrap any block. Set `stagger` to animate children one by one. */
export function Reveal({ children, className, as: Tag = "div", delay = 0, y = 32, stagger, start = "top 88%", duration = 1, scale }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced === undefined) return;

    if (reduced) {
      gsap.set(stagger !== undefined ? [el, ...Array.from(el.children)] : el, { autoAlpha: 1, clearProps: "transform" });
      return;
    }

    const targets = stagger !== undefined ? Array.from(el.children) : el;
    const ctx = gsap.context(() => {
      if (stagger !== undefined) gsap.set(el, { autoAlpha: 1 });
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y, scale: scale ?? 1 },
        { autoAlpha: 1, y: 0, scale: 1, duration, delay, stagger, ease: "power3.out", scrollTrigger: { trigger: el, start, once: true } },
      );
    });
    return () => ctx.revert();
  }, [reduced, delay, y, stagger, start, duration, scale]);

  const Component = Tag as React.ComponentType<{
    ref?: React.Ref<HTMLElement | null>;
    className?: string;
    children?: ReactNode;
    "data-reveal"?: boolean;
  }>;
  return (
    <Component ref={ref} data-reveal className={cn(className)}>
      {children}
    </Component>
  );
}
