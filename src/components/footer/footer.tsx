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
          <a href="#hero" className="font-display text-2xl font-semibold tracking-tight">
            {profile.name}
            <span className="text-accent">.</span>
          </a>
          <p className="mt-3 text-sm text-muted-foreground">{profile.tagline}</p>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted-foreground">Websites designed and built to generate leads, sales, trust and growth for businesses and agencies.</p>
        </Reveal>

        <Reveal as="nav" aria-label="Footer" className="md:col-span-3" delay={0.15} y={24}>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Navigate</p>
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

        <Reveal className="md:col-span-3" delay={0.3} y={24}>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Elsewhere</p>
          <ul className="mt-5 flex flex-col gap-3">
            {socials.length === 0 && <li className="text-sm text-muted-foreground">Social links coming soon.</li>}
            {socials.map((k) => (
              <li key={k}>
                <a href={social[k]} target="_blank" rel="noopener noreferrer" className="link-underline group inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  {socialLabels[k]}
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-[var(--ease-standard)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </a>
              </li>
            ))}
            {social.email && (
              <li>
                <a href={`mailto:${social.email}`} className="link-underline text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Email
                </a>
              </li>
            )}
          </ul>
        </Reveal>
      </div>

      <Reveal as="div" y={16} start="top 97%" className="border-t border-border/70">
        <div className="container-x flex flex-col gap-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            <li>
              <span className="text-muted-foreground/60 cursor-default" title="Coming soon">Privacy</span>
            </li>
            <li>
              <span className="text-muted-foreground/60 cursor-default" title="Coming soon">Terms</span>
            </li>
          </ul>
        </div>
      </Reveal>
      <BackToTop />
    </footer>
  );
}
