"use client";

import { useSyncExternalStore } from "react";

/** Synchronously checks media query on client and safely defaults on server. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const media = window.matchMedia(query);
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    () => (typeof window !== "undefined" ? window.matchMedia(query).matches : false),
    () => false,
  );
}

export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const useHasFinePointer = () => useMediaQuery("(pointer: fine)");
