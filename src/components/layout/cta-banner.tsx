import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/animations/magnetic";
import { Parallax } from "@/components/animations/parallax";
import { Reveal } from "@/components/animations/reveal";
import { TextReveal } from "@/components/animations/text-reveal";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/settings/schema";

export function CtaBanner({ cta }: { cta: SiteSettings["cta"] }) {
  return (
    <div className="container-x pb-20 md:pb-28 lg:pb-36">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-primary px-6 py-16 text-primary-foreground md:px-14 md:py-24 grain">
        <Parallax strength={24} className="absolute -right-24 -top-24 size-[420px] rounded-full bg-accent/30 blur-[100px]" aria-hidden>
          {null}
        </Parallax>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary-foreground)/0.06)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary-foreground)/0.06)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
        {/* Floating decorative dots */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <span className="absolute top-[15%] left-[10%] size-1.5 rounded-full bg-accent/60 animate-[dot-float-1_6s_ease-in-out_infinite]" />
          <span className="absolute top-[25%] right-[15%] size-1 rounded-full bg-primary-foreground/30 animate-[dot-float-2_8s_ease-in-out_infinite_1s]" />
          <span className="absolute bottom-[20%] left-[25%] size-2 rounded-full bg-accent/40 animate-[dot-float-3_7s_ease-in-out_infinite_0.5s]" />
          <span className="absolute top-[60%] right-[30%] size-1.5 rounded-full bg-primary-foreground/20 animate-[dot-float-1_9s_ease-in-out_infinite_2s]" />
          <span className="absolute bottom-[35%] left-[60%] size-1 rounded-full bg-accent/50 animate-[dot-float-2_7s_ease-in-out_infinite_1.5s]" />
          <span className="absolute top-[40%] left-[45%] size-1.5 rounded-full bg-primary-foreground/15 animate-[dot-float-3_10s_ease-in-out_infinite_3s]" />
        </div>
        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <TextReveal as="h2" text={cta.bannerHeadline} className="max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-6xl" />
            {cta.bannerBody && (
              <Reveal as="p" delay={0.15} className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/70 md:text-lg">
                {cta.bannerBody}
              </Reveal>
            )}
          </div>
          <Reveal className="lg:col-span-4 lg:justify-self-end" delay={0.25}>
            <Magnetic>
              <Button asChild size="lg" variant="accent" data-cursor="cta" className="breathe-glow">
                <a href="#contact">
                  {cta.bannerButton}
                  <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden />
                </a>
              </Button>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
