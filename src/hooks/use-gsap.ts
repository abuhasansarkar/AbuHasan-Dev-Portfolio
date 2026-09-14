"use client";

import { useRef, type DependencyList, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

/**
 * Runs GSAP code inside a scoped context that is reverted on unmount / dependency change.
 * Returns a ref to attach to the scope element; selectors inside `callback` are scoped to it.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  callback: (ctx: gsap.Context, scope: T) => void,
  deps: DependencyList = [],
): RefObject<T | null> {
  const scope = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;
    const ctx = gsap.context((self) => callback(self, el), el);
    return () => ctx.revert();
  }, deps);

  return scope;
}
