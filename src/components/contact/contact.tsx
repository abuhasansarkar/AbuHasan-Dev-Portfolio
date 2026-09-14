import { ArrowUpRight, Mail } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import type { SiteSettings } from "@/lib/settings/schema";
import { ContactForm } from "./contact-form";

const socialLabels: Record<keyof Omit<SiteSettings["social"], "email">, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  upwork: "Upwork",
  dribbble: "Dribbble",
  behance: "Behance",
};

export function Contact({ contact, social, availability }: { contact: SiteSettings["contact"]; social: SiteSettings["social"]; availability?: string }) {
  const socials = (Object.keys(socialLabels) as (keyof typeof socialLabels)[]).filter((k) => social[k]);

  return (
    <Section id="contact" aria-labelledby="contact-title" className="border-t border-border/70 grain">
      <div className="container-x">
        <div className="grid grid-cols-12 gap-x-6 gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            <SectionHeading id="contact-title" number="11" eyebrow="Let's build something" title={contact.headline} highlight={["perform"]} description={contact.body} titleClassName="lg:text-5xl xl:text-6xl" />

            <Reveal className="mt-12 flex flex-col gap-6" delay={0.2}>
              {availability && (
                <p className="inline-flex items-center gap-2 text-sm">
                  <span className="size-2 rounded-full bg-success" aria-hidden />
                  {availability}
                </p>
              )}
              {social.email && (
                <a href={`mailto:${social.email}`} className="link-underline inline-flex items-center gap-2 self-start text-lg font-medium">
                  <Mail className="size-4" aria-hidden />
                  {social.email}
                </a>
              )}
              {socials.length > 0 && (
                <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Social profiles">
                  {socials.map((k) => (
                    <li key={k}>
                      <a href={social[k]} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                        {socialLabels[k]}
                        <ArrowUpRight className="size-3.5" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <Reveal className="relative rounded-2xl border border-border bg-card p-6 md:p-10" y={40}>
              <ContactForm contact={contact} />
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
