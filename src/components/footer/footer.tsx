import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { navLinks } from "@/lib/site";
import type { SiteSettings } from "@/lib/settings/schema";
import { BackToTop } from "./back-to-top";

const socialLabels: Record<keyof Omit<SiteSettings["social"], "email">, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  upwork: "Upwork",
  dribbble: "Dribbble",
  behance: "Behance",
};

export function Footer({ profile, social }: { profile: SiteSettings["profile"]; social: SiteSettings["social"] }) {
  const socials = (Object.keys(socialLabels) as (keyof typeof socialLabels)[]).filter((k) => social[k]);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <Reveal className="md:col-span-5" y={24}>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain anchor keeps smooth-scroll + no-JS working for the in-page `#hero` target */}
          <a href="/#hero" className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-foreground">
            <span className="relative flex size-2.5 items-center justify-center">
              <span className="radar-beacon size-2 rounded-full bg-accent" />
            </span>
            <span>
              {profile.name}
              <span className="text-accent">.</span>
            </span>
          </a>
          <p className="mt-3 text-sm text-muted-foreground font-medium">{profile.tagline}</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">High-impact websites designed and engineered to generate leads, sales, and sustainable growth for modern businesses.</p>
          
          {/* Live Local Time / Status Pill */}
          <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-secondary/50 px-3.5 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur-xs">
            <span className="relative flex size-2 items-center justify-center">
              <span className="radar-beacon size-1.5 rounded-full bg-success" />
            </span>
            <span>Dhaka, Bangladesh · UTC+6</span>
          </div>
        </Reveal>

        <Reveal as="nav" aria-label="Footer" className="md:col-span-3" delay={0.15} y={24}>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Navigate</p>
          <ul className="mt-5 flex flex-col gap-3">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-underline text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="md:col-span-4" delay={0.3} y={24}>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Elsewhere</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {socials.length === 0 && <li className="text-sm text-muted-foreground">Social links coming soon.</li>}
            {socials.map((k) => (
              <li key={k}>
                <a
                  href={social[k]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-accent/40 hover:bg-secondary hover:text-foreground hover:shadow-xs"
                >
                  <span>{socialLabels[k]}</span>
                  <ArrowUpRight className="size-3 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
                </a>
              </li>
            ))}
            {social.email && (
              <li>
                <a
                  href={`mailto:${social.email}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-accent/40 hover:bg-secondary hover:text-foreground hover:shadow-xs"
                >
                  <span>Email</span>
                  <ArrowUpRight className="size-3 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
                </a>
              </li>
            )}
          </ul>
        </Reveal>
      </div>

      <Reveal as="div" y={16} start="top 97%" className="border-t border-border/60">
        <div className="container-x flex flex-col gap-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <p className="text-muted-foreground/70">
            Crafted with Next.js 15, Tailwind & Three.js
          </p>
        </div>
      </Reveal>
      <BackToTop />
    </footer>
  );
}
