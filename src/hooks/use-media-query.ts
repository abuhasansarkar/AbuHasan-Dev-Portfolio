"use client";

import { useEffect, useState } from "react";

/** Returns `undefined` until mounted so SSR and first client render match. */
export function useMediaQuery(query: string): boolean | undefined {
  const [matches, setMatches] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const useHasFinePointer = () => useMediaQuery("(pointer: fine)");
