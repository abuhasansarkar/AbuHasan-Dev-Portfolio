"use client";

import { useGsap } from "@/hooks/use-gsap";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Thin accent bar pinned to the top edge showing whole-page scroll progress. */
export function ScrollProgress() {
  const reduced = useReducedMotion();

  const scope = useGsap<HTMLDivElement>(
    (_, el) => {
      if (reduced !== false) return;
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
        },
      );
    },
    [reduced],
  );

  if (reduced !== false) return null;
  return <div ref={scope} aria-hidden className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-accent" />;
}
