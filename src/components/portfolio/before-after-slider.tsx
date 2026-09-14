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
    <div className="relative select-none overflow-hidden rounded-2xl border border-border bg-card" data-cursor="drag">
      <div className="relative aspect-[16/11] w-full sm:aspect-[16/10]">
        {/* After (full) */}
        <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-top" draggable={false} />
        {/* Before (clipped) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} aria-hidden>
          <Image src={before.src} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-top grayscale-[0.4]" draggable={false} />
        </div>

        {/* Labels */}
        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] backdrop-blur" style={{ opacity: pos > 12 ? 1 : 0, transition: "opacity .2s" }}>
          Before
        </span>
        <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-accent-foreground" style={{ opacity: pos < 88 ? 1 : 0, transition: "opacity .2s" }}>
          After
        </span>

        {/* Handle */}
        <div className="pointer-events-none absolute inset-y-0 w-px bg-foreground/90" style={{ left: `${pos}%` }} aria-hidden>
          <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-xl">
            <MoveHorizontal className="size-5" />
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
