"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    // Only instantiate on client
    if (typeof window === "undefined") return;

    // Respect the OS-level reduced-motion preference (WCAG 2.3.3), touch screens (mobile
    // already has hardware-accelerated 120Hz smooth scrolling), and the admin dashboard.
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    if (prefersReducedMotion || isTouchDevice || window.location.pathname.startsWith("/admin")) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential out
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    setLenisInstance(lenis);

    // Sync Lenis scroll updates with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame to GSAP's ticker for zero-jitter rendering
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);

    // Refresh ScrollTrigger once everything (fonts, images, 3D Canvas) is ready
    const handleRefresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", handleRefresh);
    const timeout = setTimeout(handleRefresh, 600);

    // Also refresh after a longer delay for slow-loading fonts/images
    const longTimeout = setTimeout(handleRefresh, 2000);

    // Intercept internal hash links for butter-smooth scroll.
    // Supports both "#section" and root-absolute "/#section" (used by navLinks
    // so the same anchors work from /work/[slug] and /blog/[slug]).
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || target.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      let selector: string | null = null;
      if (href.startsWith("#") && href.length > 1) {
        selector = href;
      } else if (href.startsWith("/#") && href.length > 2 && window.location.pathname === "/") {
        // Same-page root-absolute anchor: smooth-scroll instead of a full navigation.
        selector = href.slice(1);
      }
      if (!selector) return;

      let targetEl: Element | null = null;
      try {
        targetEl = document.querySelector(selector);
      } catch {
        return; // malformed selector (e.g. hash deep-links like #project=slug)
      }
      if (targetEl) {
        e.preventDefault();
        lenis.scrollTo(targetEl as HTMLElement, { offset: -30, duration: 1.4 });
      }
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("load", handleRefresh);
      clearTimeout(timeout);
      clearTimeout(longTimeout);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return <LenisContext.Provider value={lenisInstance}>{children}</LenisContext.Provider>;
}
