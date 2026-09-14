"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  /** Seconds for one loop */
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  /** Lean the strip in response to scroll velocity, then settle */
  reactive?: boolean;
};

/** CSS-driven infinite marquee. Content is duplicated for a seamless loop. Respects reduced motion via global CSS. */
export function Marquee({ children, className, speed = 40, reverse = false, pauseOnHover = true, reactive = false }: MarqueeProps) {
  const reduced = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);

  // Skew lives on the outer wrapper — the inner track's transform is owned by the CSS keyframe animation.
  useIsomorphicLayoutEffect(() => {
    const el = outerRef.current;
    if (!el || !reactive || reduced !== false) return;
    const ctx = gsap.context(() => {
      const skewTo = gsap.quickTo(el, "skewY", { duration: 0.5, ease: "power3.out" });
      const clamp = gsap.utils.clamp(-1.5, 1.5);
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          skewTo(clamp(self.getVelocity() / -400));
          gsap.delayedCall(0.2, () => skewTo(0));
        },
      });
    });
    return () => ctx.revert();
  }, [reactive, reduced]);

  return (
    <div ref={outerRef} className={cn("group/marquee relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]", className)}>
      <div
        className={cn("flex w-max shrink-0 items-center animate-marquee", reverse && "[animation-direction:reverse]", pauseOnHover && !reduced && "group-hover/marquee:[animation-play-state:paused]")}
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
