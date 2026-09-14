"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { SceneFallback } from "./scene-fallback";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false, loading: () => <SceneFallback /> });

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[hero-scene] falling back to static visual:", error);
  }
  render() {
    return this.state.failed ? <SceneFallback /> : this.props.children;
  }
}

/** Decides between the WebGL scene and the static fallback, and lazy-loads three.js off the critical path. */
export function HeroSceneLoader() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    setWebgl(supportsWebGL());
  }, []);

  if (webgl === null || reduced === undefined || isMobile === undefined) return <SceneFallback />;
  if (!webgl || reduced) return <SceneFallback />;

  return (
    <SceneErrorBoundary>
      <HeroScene simplified={isMobile} />
    </SceneErrorBoundary>
  );
}
