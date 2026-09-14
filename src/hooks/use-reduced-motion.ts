"use client";

import { useMediaQuery } from "./use-media-query";

/** True when the OS asks for reduced motion. Undefined before mount. */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
