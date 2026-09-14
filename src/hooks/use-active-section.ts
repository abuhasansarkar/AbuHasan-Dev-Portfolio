"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section id is currently in the "reading zone" of the viewport.
 * Uses IntersectionObserver so it stays cheap and works with any scroll container.
 */
export function useActiveSection(ids: readonly string[], rootMargin = "-35% 0px -55% 0px") {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin, threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return active;
}
