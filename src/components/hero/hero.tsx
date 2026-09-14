"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
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
      if (reduced === undefined) return;
      const q = gsap.utils.selector(el);
      const targets = q("[data-reveal]");

      if (reduced) {
        gsap.set(targets, { autoAlpha: 1 });
        gsap.set(q("[data-hero-word]"), { yPercent: 0 });
        return;
      }

      // Entrance sequence: background → label → headline → copy → CTAs → scene → scroll indicator
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(q("[data-hero=bg]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, 0)
        .fromTo(q("[data-hero=label]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.25)
        .set(q("[data-hero=headline]"), { autoAlpha: 1 }, 0.35)
        .fromTo(q("[data-hero-word]"), { yPercent: 110, rotate: 2 }, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.05 }, 0.35)
        .fromTo(q("[data-hero=copy]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.85)
        .fromTo(q("[data-hero=cta]"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 1.0)
        .fromTo(q("[data-hero=scene]"), { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power3.out" }, 0.5)
        .fromTo(q("[data-hero=scroll]"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.5);

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
      <div data-hero="bg" data-reveal aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-1/3 right-[-20%] size-[70vmax] rounded-full bg-accent/[0.07] blur-[120px] dark:bg-accent/[0.09]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] bg-[size:96px_96px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      </div>

      {/* 3D scene */}
      <div data-hero="scene" data-reveal className="absolute inset-0 -z-[5] opacity-60 lg:left-auto lg:right-0 lg:w-[54%] lg:opacity-100">
        <HeroSceneLoader />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent lg:from-background/90 lg:via-transparent" aria-hidden />
      </div>

      {/* Content */}
      <div className="container-x relative w-full pb-28 pt-32 md:pt-36 lg:pb-32">
        <div data-hero="content" className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 xl:col-span-7">
            <div data-hero="label" data-reveal className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">{hero.label}</span>
              {availability && (
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-[pulse-dot_2s_ease-out_infinite] rounded-full bg-success" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-success" />
                  </span>
                  {availability}
                </span>
              )}
            </div>

            <h1 data-hero="headline" data-reveal className="clip-lines mt-7 max-w-5xl font-display text-[clamp(2.6rem,7.2vw,6.4rem)] font-semibold leading-[0.96] tracking-[-0.035em] text-foreground" aria-label={hero.headline}>
              <span className="line block" aria-hidden>
                {words.map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
                    <span data-hero-word className="inline-block will-change-transform">
                      {w}
                    </span>
                    {i < words.length - 1 ? "\u00a0" : ""}
                  </span>
                ))}
              </span>
            </h1>

            <p data-hero="copy" data-reveal className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg lg:mt-9">
              {hero.subheadline}
            </p>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:mt-11">
              <div data-hero="cta" data-reveal>
                <Magnetic>
                  <Button asChild size="lg" variant="default" data-cursor="cta">
                    <a href={hero.primaryCta.href}>
                      {hero.primaryCta.label}
                      <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden />
                    </a>
                  </Button>
                </Magnetic>
              </div>
              <div data-hero="cta" data-reveal>
                <Magnetic>
                  <Button asChild size="lg" variant="outline" data-cursor="cta">
                    <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
                  </Button>
                </Magnetic>
              </div>
              <a data-hero="cta" data-reveal href={hero.tertiaryLink.href} className="link-underline ml-1 inline-flex items-center gap-1 text-sm font-medium text-foreground sm:ml-3">
                {hero.tertiaryLink.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
