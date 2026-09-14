"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  "aria-hidden"?: boolean | "true" | "false";
  /** Pixels of total travel (half up, half down) across the scroll range */
  strength?: number;
  start?: string;
  end?: string;
};

/**
 * Scrubbed vertical drift tied to scroll position. Animates `y` on its own wrapper
 * only, so it never fights transforms on the children (hover scale, CSS tilt, etc.).
 */
export function Parallax({ children, className, as: Tag = "div", strength = 14, start = "top bottom", end = "bottom top", ...rest }: ParallaxProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced === undefined) return;
    if (reduced) {
      gsap.set(el, { y: 0, clearProps: "transform" });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { y: -strength }, { y: strength, ease: "none", scrollTrigger: { trigger: el, start, end, scrub: true } });
    });
    return () => ctx.revert();
  }, [reduced, strength, start, end]);

  const Component = Tag as React.ComponentType<Record<string, unknown>>;
  return (
    <Component ref={ref} className={cn(className)} {...rest}>
      {children}
    </Component>
  );
}
