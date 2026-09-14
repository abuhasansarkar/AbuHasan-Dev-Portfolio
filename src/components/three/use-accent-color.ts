"use client";

import { useEffect, useState } from "react";

/** Reads `--accent` (HSL channels) from CSS so the 3D scene follows the theme. */
export function useCssColor(variable: string, fallback = "#ff7a1a") {
  const [color, setColor] = useState(fallback);

  useEffect(() => {
    const read = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
      if (!raw) return setColor(fallback);
      const [h, s, l] = raw.split(/\s+/);
      if (h && s && l) setColor(`hsl(${h}, ${s}, ${l})`);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [variable, fallback]);

  return color;
}
