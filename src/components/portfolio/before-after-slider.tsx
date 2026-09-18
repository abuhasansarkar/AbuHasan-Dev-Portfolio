"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { MoveHorizontal } from "lucide-react";

type Props = {
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  initial?: number;
};

/**
 * Drag comparison slider. A transparent native range input covers the image so
 * pointer, touch and keyboard all work without custom gesture code.
 */
export function BeforeAfterSlider({ before, after, initial = 50 }: Props) {
  const [pos, setPos] = useState(initial);
  const id = useId();

  return (
    <div className="relative select-none overflow-hidden rounded-3xl border border-border/80 bg-card shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]" data-cursor="drag">
      <div className="relative aspect-[16/11] w-full sm:aspect-[16/10]">
        {/* After (full) */}
        <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-top" draggable={false} />
        {/* Before (clipped) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} aria-hidden>
          <Image src={before.src} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-top grayscale-[0.3]" draggable={false} />
        </div>

        {/* Labels */}
        <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-border/70 bg-background/90 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md shadow-md text-foreground" style={{ opacity: pos > 12 ? 1 : 0, transition: "opacity .2s" }}>
          Before
        </span>
        <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-[0_0_16px_hsl(var(--accent)/0.5)]" style={{ opacity: pos < 88 ? 1 : 0, transition: "opacity .2s" }}>
          After
        </span>

        {/* Handle */}
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-accent shadow-[0_0_12px_hsl(var(--accent))]" style={{ left: `${pos}%` }} aria-hidden>
          <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/95 text-foreground shadow-2xl backdrop-blur-md transition-transform duration-200 group-hover:scale-110">
            <MoveHorizontal className="size-5 text-accent" />
          </span>
        </div>

        {/* Control */}
        <label htmlFor={id} className="sr-only">
          Compare before and after. Use arrow keys to move the divider.
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-valuetext={`${Math.round(pos)}% before, ${Math.round(100 - pos)}% after`}
          className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-slider-thumb]:h-full [&::-webkit-slider-thumb]:w-12 [&::-webkit-slider-thumb]:appearance-none"
        />
      </div>
    </div>
  );
}
