"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "@/components/providers/smooth-scroll-provider";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Thin accent bar pinned to the top edge showing whole-page scroll progress. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const updateProgress = (progress: number) => {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    if (lenis) {
      const onScroll = ({ progress }: { progress: number }) => {
        updateProgress(progress);
      };
      lenis.on("scroll", onScroll);
      return () => {
        lenis.off("scroll", onScroll);
      };
    } else {
      const onNativeScroll = () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? Math.min(Math.max(window.scrollY / totalHeight, 0), 1) : 0;
        updateProgress(progress);
      };
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      return () => window.removeEventListener("scroll", onNativeScroll);
    }
  }, [lenis, reduced]);

  if (reduced) return null;

  return (
    <div
      ref={barRef}
      aria-hidden
      style={{ transform: "scaleX(0)" }}
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-accent transition-transform duration-75 will-change-transform"
    />
  );
}
