"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
};

/** Animates a number from 0 to `value` when it scrolls into view. */
export function Counter({ value, prefix = "", suffix = "", duration = 1.8, className, decimals = 0 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced === undefined) return;
    const format = (n: number) => `${prefix}${n.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}${suffix}`;

    if (reduced) {
      el.textContent = format(value);
      return;
    }

    const state = { n: 0 };
    el.textContent = format(0);
    const ctx = gsap.context(() => {
      gsap.to(state, {
        n: value,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = format(state.n);
        },
      });
    });
    return () => ctx.revert();
  }, [value, prefix, suffix, duration, decimals, reduced]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
