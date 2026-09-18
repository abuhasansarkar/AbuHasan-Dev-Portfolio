"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
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

class SceneErrorBoundary extends Component<
  { children: ReactNode; resetKey?: number },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[hero-scene] falling back to static visual:", error);
  }
  componentDidUpdate(prev: { resetKey?: number }) {
    // Allow callers to reset the boundary (e.g. after WebGL context restore).
    if (prev.resetKey !== this.props.resetKey && this.state.failed) {
      this.setState({ failed: false });
    }
  }
  render() {
    return this.state.failed ? <SceneFallback /> : this.props.children;
  }
}

/** Decides between the WebGL scene and the static fallback, and lazy-loads three.js off the critical path. */
export function HeroSceneLoader() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [contextLost, setContextLost] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    setWebgl(supportsWebGL());
  }, []);

  const sceneActive = webgl === true && !reduced && isMobile !== undefined;

  // Handle WebGL context loss: show the static fallback immediately and
  // remount a fresh scene once the browser signals the context was restored.
  useEffect(() => {
    if (!sceneActive) return;
    const el = containerRef.current;
    if (!el) return;

    const onContextLost = (e: Event) => {
      // Prevent the browser's default "context lost" handling so React can
      // swap to the fallback without throwing.
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
      setSceneKey((k) => k + 1); // remount R3F canvas with a live context
    };

    el.addEventListener("webglcontextlost", onContextLost);
    el.addEventListener("webglcontextrestored", onContextRestored);
    return () => {
      el.removeEventListener("webglcontextlost", onContextLost);
      el.removeEventListener("webglcontextrestored", onContextRestored);
    };
  }, [sceneActive]);

  if (webgl === null || reduced === undefined || isMobile === undefined) return <SceneFallback />;
  if (!webgl || reduced) return <SceneFallback />;

  return (
    <div ref={containerRef} className="contents">
      <SceneErrorBoundary resetKey={sceneKey}>
        {contextLost ? <SceneFallback /> : <HeroScene key={sceneKey} simplified={isMobile} />}
      </SceneErrorBoundary>
    </div>
  );
}
