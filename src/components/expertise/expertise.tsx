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
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">{group.label}</p>
                  <Reveal stagger={0.04} className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium tracking-tight">
                        {item}
                      </span>
                    ))}
                  </Reveal>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: orbit */}
          <div className="col-span-12 hidden lg:col-span-7 lg:block [container-type:inline-size]">
            <Reveal scale={0.94} duration={1.4}>
              <Parallax strength={12}>
                <TechOrbit name={name} />
              </Parallax>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
