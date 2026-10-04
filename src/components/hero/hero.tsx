"use client";

import { ArrowRight, ArrowUpRight, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/animations/magnetic";
import { HeroSceneLoader } from "@/components/three/hero-scene-loader";
import { heroState } from "@/components/three/hero-state";
import { useGsap } from "@/hooks/use-gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { SiteSettings } from "@/lib/settings/schema";
import { ScrollIndicator } from "./scroll-indicator";

type HeroProps = {
  hero: SiteSettings["hero"];
  availability?: string;
};

export function Hero({ hero, availability }: HeroProps) {
  const reduced = useReducedMotion();

  const scope = useGsap<HTMLElement>(
    (_, el) => {
      const q = gsap.utils.selector(el);

      if (reduced) {
        return;
      }

      // Smooth background & ambient reveal without blocking or delaying critical text for LCP
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(q("[data-hero=bg]"), { autoAlpha: 0.3 }, { autoAlpha: 1, duration: 1.2 }, 0)
        .fromTo(q("[data-hero=scene]"), { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power3.out" }, 0.2)
        .fromTo(q("[data-hero=scroll]"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.8);

      // Scroll: parallax the copy, feed progress to the 3D scene
      gsap.to(q("[data-hero=content]"), {
        yPercent: -12,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          heroState.scroll = self.progress;
        },
        onToggle: (self) => {
          heroState.visible = self.isActive;
        },
      });

      // Pointer: normalised position for the scene
      const onMove = (e: PointerEvent) => {
        heroState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        heroState.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      el.addEventListener("pointermove", onMove, { passive: true });
      return () => el.removeEventListener("pointermove", onMove);
    },
    [reduced],
  );

  const words = hero.headline.trim().split(/\s+/);

  return (
    <section id="hero" ref={scope} data-section="hero" className="relative flex min-h-dvh items-center overflow-hidden grain">
      {/* Background */}
      <div data-hero="bg" aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-1/3 right-[-20%] size-[70vmax] rounded-full bg-accent/[0.07] blur-[120px] dark:bg-accent/[0.09]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] bg-[size:96px_96px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      </div>

      {/* 3D scene */}
      <div data-hero="scene" className="absolute inset-0 -z-[5] opacity-60 lg:left-auto lg:right-0 lg:w-[54%] lg:opacity-100">
        <HeroSceneLoader />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent lg:from-background/90 lg:via-transparent" aria-hidden />
      </div>

      {/* Content */}
      <div className="container-x relative w-full pb-28 pt-32 md:pt-36 lg:pb-32">
        <div data-hero="content" className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 xl:col-span-7">
            <div data-hero="label" className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">{hero.label}</span>
              {availability && (
                <span className="inline-flex items-center gap-2.5 rounded-full border border-success/40 bg-success/10 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-md shadow-[0_0_12px_1px_hsl(var(--success)/0.25)]">
                  <span className="relative flex size-2 items-center justify-center">
                    <span className="radar-beacon size-1.5 rounded-full bg-success" />
                  </span>
                  {availability}
                </span>
              )}
            </div>

            <h1 data-hero="headline" className="clip-lines mt-7 max-w-5xl font-display text-[clamp(2.6rem,7.2vw,6.4rem)] font-semibold leading-[0.96] tracking-[-0.035em] text-foreground" aria-label={hero.headline}>
              <span className="line block" aria-hidden>
                {words.map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
                    <span data-hero-word className={`inline-block ${i === 0 ? "text-shimmer font-bold" : ""}`}>
                      {w}
                    </span>
                    {i < words.length - 1 ? "\u00a0" : ""}
                  </span>
                ))}
              </span>
            </h1>

            <p data-hero="copy" className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg lg:mt-9">
              {hero.subheadline}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3.5 sm:gap-4 lg:mt-11">
              <div data-hero="cta">
                <Magnetic>
                  <Button asChild size="lg" variant="accent" data-cursor="cta" className="breathe-glow font-medium shadow-[0_4px_24px_-2px_hsl(var(--accent)/0.5)]">
                    <a href={hero.primaryCta.href}>
                      {hero.primaryCta.label}
                      <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden />
                    </a>
                  </Button>
                </Magnetic>
              </div>
              <div data-hero="cta">
                <Magnetic>
                  <Button asChild size="lg" variant="outline" data-cursor="cta" className="border-border/80 bg-card/40 backdrop-blur-sm transition-all hover:bg-card hover:border-foreground/30 hover:shadow-sm">
                    <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
                  </Button>
                </Magnetic>
              </div>
              <div data-hero="cta">
                <Magnetic>
                  <Button asChild size="lg" variant="ghost" data-cursor="cta" className="border border-border/70 bg-secondary/30 backdrop-blur-sm transition-all hover:bg-secondary/70 hover:border-accent/40 text-foreground font-medium">
                    <a href="/abuhasan-cv.pdf" download="AbuHasan-Resume.pdf" className="inline-flex items-center gap-2">
                      <FileDown className="size-4 text-accent" aria-hidden />
                      <span>Download CV</span>
                    </a>
                  </Button>
                </Magnetic>
              </div>
              <a data-hero="cta" href={hero.tertiaryLink.href} className="link-underline ml-1 inline-flex items-center gap-1.5 text-sm font-medium text-foreground sm:ml-2 hover:text-accent transition-colors">
                {hero.tertiaryLink.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </div>

            {/* Quick Trust / Credibility Badges */}
            <div data-hero="cta" className="mt-10 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground pt-4 border-t border-border/40">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent" />
                <span>100% Client Satisfaction</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent" />
                <span>50+ High-Performance Websites</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent" />
                <span>WordPress & Full-Stack Pro</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
