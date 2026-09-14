"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import type { Testimonial } from "@prisma/client";
import { Reveal } from "@/components/animations/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { EmptyState } from "@/components/layout/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 7000;

export function Testimonials({ testimonials, error }: { testimonials: Testimonial[]; error?: boolean }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const count = testimonials.length;

  const go = useCallback(
    (next: number, dir = 1) => {
      if (count === 0) return;
      setDirection(dir);
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count < 2 || paused || reduced) return;
    const t = setInterval(() => go(index + 1, 1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [count, paused, reduced, index, go]);

  const current = testimonials[index];

  return (
    <Section id="testimonials" aria-labelledby="testimonials-title" className="border-t border-border/70">
      <div className="container-x">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <SectionHeading id="testimonials-title" number="08" eyebrow="Client words" title="What it's like to work together." highlight={["together."]} titleClassName="lg:text-5xl" />
            {count > 1 && (
              <Reveal className="mt-10 flex items-center gap-3" delay={0.2}>
                <Button type="button" variant="outline" size="icon" aria-label="Previous testimonial" onClick={() => go(index - 1, -1)}>
                  <ArrowLeft />
                </Button>
                <Button type="button" variant="outline" size="icon" aria-label="Next testimonial" onClick={() => go(index + 1, 1)}>
                  <ArrowRight />
                </Button>
                <span className="ml-3 text-sm text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
              </Reveal>
            )}
          </div>

          <div className="col-span-12 lg:col-span-8">
            {count === 0 || !current ? (
              <EmptyState title={error ? "Testimonials are temporarily unavailable" : "No testimonials yet"} description={error ? "The database could not be reached." : "Add testimonials from the admin dashboard."} />
            ) : (
              <Reveal>
                <div
                  className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12 grain"
                  onPointerEnter={() => setPaused(true)}
                  onPointerLeave={() => setPaused(false)}
                  onFocusCapture={() => setPaused(true)}
                  onBlurCapture={() => setPaused(false)}
                  role="region"
                  aria-roledescription="carousel"
                  aria-label="Testimonials"
                  aria-live="polite"
                >
                  <Quote className="absolute right-8 top-8 size-16 text-foreground/[0.06]" aria-hidden />
                  <motion.div
                    drag={count > 1 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -60) go(index + 1, 1);
                      else if (info.offset.x > 60) go(index - 1, -1);
                    }}
                    className={cn("relative min-h-[320px]", count > 1 && "cursor-grab active:cursor-grabbing")}
                    data-cursor={count > 1 ? "drag" : undefined}
                  >
                    <AnimatePresence mode="wait" initial={false} custom={direction}>
                      <motion.figure
                        key={current.id}
                        custom={direction}
                        initial={{ opacity: 0, x: 40 * direction }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 * direction }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="flex h-full flex-col justify-between gap-10"
                      >
                        <blockquote className="font-display text-xl font-medium leading-snug tracking-tight text-foreground md:text-2xl lg:text-[1.7rem]">“{current.quote}”</blockquote>
                        <figcaption className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <Avatar name={current.name} src={current.avatar} />
                            <div>
                              <p className="font-medium">{current.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {current.role}, {current.company}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {current.rating && (
                              <span className="text-sm text-accent" aria-label={`${current.rating} out of 5 stars`}>
                                {"★".repeat(current.rating)}
                              </span>
                            )}
                            {current.isDemo && <Badge variant="outline">Placeholder</Badge>}
                          </div>
                        </figcaption>
                      </motion.figure>
                    </AnimatePresence>
                  </motion.div>

                  {count > 1 && (
                    <div className="mt-8 flex gap-2" role="tablist" aria-label="Choose testimonial">
                      {testimonials.map((t, i) => (
                        <button
                          key={t.id}
                          type="button"
                          role="tab"
                          aria-selected={i === index}
                          aria-label={`Testimonial ${i + 1}`}
                          onClick={() => go(i, i > index ? 1 : -1)}
                          className={cn("h-1 rounded-full transition-all duration-500", i === index ? "w-10 bg-accent" : "w-4 bg-border hover:bg-foreground/40")}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  if (!src || failed) {
    return (
      <span className="flex size-12 items-center justify-center rounded-full border border-border bg-secondary font-display text-sm font-semibold" aria-hidden>
        {initials}
      </span>
    );
  }
  return (
    <span className="relative size-12 overflow-hidden rounded-full border border-border bg-secondary">
      <Image src={src} alt="" fill sizes="48px" className="object-cover" onError={() => setFailed(true)} />
    </span>
  );
}
