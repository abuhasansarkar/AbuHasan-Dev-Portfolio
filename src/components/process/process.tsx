"use client";

import { Check } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { SectionHeading } from "@/components/layout/section-heading";
import { useGsap } from "@/hooks/use-gsap";
import { gsap } from "@/lib/gsap";
import { processSteps } from "@/lib/content/process";

export function Process() {
  const scope = useGsap<HTMLElement>((_, el) => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const track = el.querySelector<HTMLElement>("[data-track]");
      const progress = el.querySelector<HTMLElement>("[data-progress]");
      const stage = el.querySelector<HTMLElement>("[data-stage]");
      if (!track || !stage) return;

      const distance = () => track.scrollWidth - stage.clientWidth;

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          pin: true,
          scrub: 0.8,
          start: "top top",
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progress) progress.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="process" ref={scope} data-section="process" className="relative scroll-mt-20 border-t border-border/70 lg:min-h-dvh lg:overflow-hidden" aria-labelledby="process-title">
      <div className="container-x pt-20 md:pt-28 lg:pt-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="process-title" number="06" eyebrow="How I work" title="A clear process. No surprises." highlight={["clear"]} description="Six steps from first call to launch. You always know what is happening, what comes next and what you will receive." />
          <Reveal className="hidden lg:block" delay={0.2}>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Scroll to move through the steps</p>
            <div className="mt-3 h-px w-64 overflow-hidden bg-border">
              <div data-progress className="h-full w-full origin-left scale-x-0 bg-accent" />
            </div>
          </Reveal>
        </div>
      </div>

      {/* Desktop: horizontal track */}
      <div data-stage className="container-x mt-16 hidden pb-24 lg:block">
        <div data-track className="flex w-max gap-6 will-change-transform">
          {processSteps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} className="w-[440px] xl:w-[480px]" />
          ))}
          <div className="flex w-[380px] shrink-0 flex-col justify-between rounded-3xl border border-accent/40 bg-accent/10 p-10 backdrop-blur-md shadow-[0_12px_40px_-10px_hsl(var(--accent)/0.25)]">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-accent">Next Step</span>
              <p className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">Ready when you are.</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Every great project starts with a simple conversation. Let&apos;s talk about yours.</p>
            </div>
            <div className="pt-8">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-[0_0_20px_-2px_hsl(var(--accent)/0.5)] transition-all hover:scale-105 hover:bg-accent/90"
                data-cursor="cta"
              >
                <span>Start a project</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet: vertical timeline */}
      <div className="container-x mt-14 pb-20 md:pb-28 lg:hidden">
        <ol className="relative flex flex-col gap-6 border-l border-border/70 pl-8">
          {processSteps.map((step, i) => (
            <Reveal as="li" key={step.title} className="relative" delay={0.05}>
              <span className="absolute -left-[2.35rem] top-7 flex size-5 items-center justify-center rounded-full border border-border bg-background shadow-xs" aria-hidden>
                <span className="size-2 rounded-full bg-accent animate-[glow-pulse_3s_ease-in-out_infinite]" />
              </span>
              <StepCard step={step} index={i} />
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function StepCard({ step, index, className = "" }: { step: (typeof processSteps)[number]; index: number; className?: string }) {
  return (
    <article className={`group relative flex shrink-0 flex-col rounded-3xl border border-border/80 bg-card/75 p-7 md:p-9 backdrop-blur-md shadow-xs transition-all duration-300 ease-[var(--ease-standard)] hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_16px_40px_-10px_hsl(var(--accent)/0.18)] accent-top-line shine-on-hover ${className}`}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-5xl font-bold tracking-tight text-foreground/15 transition-all duration-500 group-hover:text-accent group-hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.4)] md:text-6xl">{String(index + 1).padStart(2, "0")}</span>
        <span className="rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{`Step ${index + 1} of ${processSteps.length}`}</span>
      </div>
      <h3 className="mt-7 font-display text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent md:text-3xl">{step.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{step.description}</p>
      <ul className="mt-6 flex flex-col gap-2.5 border-t border-border/60 pt-5 text-sm">
        {step.deliverables.map((d) => (
          <li key={d} className="flex items-center gap-3 text-foreground/90">
            <span className="flex size-4.5 items-center justify-center rounded-full bg-success/15 text-success shrink-0" aria-hidden>
              <Check className="size-2.5 stroke-[3]" />
            </span>
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
