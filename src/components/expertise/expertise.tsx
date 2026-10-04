import { Parallax } from "@/components/animations/parallax";
import { Reveal } from "@/components/animations/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { techGroups } from "@/lib/content/tech";
import { TechOrbit } from "./tech-orbit";

export function Expertise({ name }: { name: string }) {
  return (
    <Section id="expertise" aria-labelledby="expertise-title" className="overflow-hidden border-t border-border/70">
      <div className="container-x">
        <div className="grid grid-cols-12 items-center gap-x-6 gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            <SectionHeading
              id="expertise-title"
              number="03"
              eyebrow="Expertise"
              title="The right tool for the job, not the same tool for every job."
              highlight={["right", "tool"]}
              description="WordPress when editors need control. Framer or Webflow when speed and motion matter. Custom code when performance and complexity demand it."
            />

            {/* Mobile / tablet: grouped chips */}
            <div className="mt-12 flex flex-col gap-8 lg:hidden">
              {techGroups.map((group) => (
                <div key={group.id}>
                  <p className="mb-3 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    <span aria-hidden className="size-1.5 shrink-0 rounded-full" style={{ background: `hsl(${group.color})` }} />
                    {group.label}
                  </p>
                  <Reveal stagger={0.04} className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3.5 py-2 text-sm font-medium tracking-tight shadow-xs backdrop-blur-sm transition-all hover:border-accent/40 hover:text-accent"
                      >
                        <span aria-hidden className="size-1.5 shrink-0 rounded-full" style={{ background: `hsl(${group.color})` }} />
                        {item}
                      </span>
                    ))}
                  </Reveal>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: orbit + legend (the stage owns its own container query) */}
          <div className="col-span-12 hidden lg:col-span-7 lg:block">
            <Reveal scale={0.96} duration={1.4}>
              <Parallax strength={10}>
                <TechOrbit name={name} />
              </Parallax>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
