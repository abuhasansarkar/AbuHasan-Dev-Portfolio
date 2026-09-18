import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import type { SiteSettings } from "@/lib/settings/schema";

type AboutProps = { about: SiteSettings["about"]; profile: SiteSettings["profile"] };

export function About({ about, profile }: AboutProps) {
  return (
    <Section id="about" aria-labelledby="about-title">
      <div className="container-x">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 lg:col-span-7">
            <SectionHeading id="about-title" number="01" eyebrow="Who I am" title={about.headline} highlight={["business", "tools"]} />

            <div className="mt-10 grid gap-8 md:grid-cols-12">
              <Reveal as="p" className="md:col-span-12 text-lg leading-relaxed text-foreground md:text-xl">
                {about.intro}
              </Reveal>
              <Reveal stagger={0.12} className="md:col-span-12 flex flex-col gap-5 text-base leading-relaxed text-muted-foreground">
                {about.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </Reveal>
            </div>

            <Reveal className="mt-10" delay={0.1}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Focus areas</p>
              <ul className="flex flex-wrap gap-2.5">
                {about.focusAreas.map((area) => (
                  <li key={area}>
                    <Badge variant="outline" className="px-3.5 py-1.5 text-sm font-medium transition-all duration-300 hover:border-accent/60 hover:bg-secondary/70 hover:text-foreground hover:shadow-[0_0_12px_1px_hsl(var(--accent)/0.15)] hover:scale-[1.02]">
                      {area}
                    </Badge>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <Reveal className="lg:sticky lg:top-28" y={48}>
              {/* Identity card */}
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl p-8 shadow-[0_20px_50px_-15px_hsl(var(--foreground)/0.08)] grain shine-on-hover">
                <div className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-accent/20 blur-3xl" aria-hidden />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="font-display text-2xl font-bold tracking-tight text-foreground">{profile.name}</p>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">{profile.role}</p>
                  </div>
                  <div className="relative size-20 shrink-0" aria-hidden>
                    <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-spin-slow text-muted-foreground">
                      <defs>
                        <path id="about-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                      </defs>
                      <text className="fill-current text-[9.5px] font-semibold uppercase tracking-[0.25em]">
                        <textPath href="#about-circle">design · develop · convert · </textPath>
                      </text>
                    </svg>
                    <span className="absolute inset-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_hsl(var(--accent))]" />
                  </div>
                </div>

                <dl className="relative mt-8 grid gap-4 text-sm">
                  {profile.location && (
                    <div className="flex justify-between gap-4 border-t border-border/60 pt-4">
                      <dt className="text-muted-foreground">Based</dt>
                      <dd className="text-right font-medium text-foreground">{profile.location}</dd>
                    </div>
                  )}
                  {profile.availability && (
                    <div className="flex justify-between gap-4 border-t border-border/60 pt-4">
                      <dt className="text-muted-foreground">Status</dt>
                      <dd className="flex items-center gap-2.5 font-medium text-foreground">
                        <span className="relative flex size-2 items-center justify-center">
                          <span className="radar-beacon size-1.5 rounded-full bg-success" />
                        </span>
                        {profile.availability}
                      </dd>
                    </div>
                  )}
                </dl>

                {about.currentlyFocusedOn.length > 0 && (
                  <div className="relative mt-8 rounded-2xl border border-border/70 bg-secondary/40 backdrop-blur-sm p-5 shadow-xs">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-foreground/80">
                      <Sparkles className="size-3.5 text-accent animate-[glow-pulse_3s_ease-in-out_infinite]" aria-hidden />
                      Currently focused on
                    </p>
                    <ul className="mt-4 flex flex-col gap-2.5 text-sm leading-snug text-muted-foreground">
                      {about.currentlyFocusedOn.map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                          <span className="text-foreground/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
