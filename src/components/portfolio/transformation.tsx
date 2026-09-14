import { Check, X } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { BeforeAfterSlider } from "./before-after-slider";

const before = ["Outdated design", "Poor mobile experience", "Slow performance", "Unclear call to action", "Weak visual hierarchy"];
const after = ["Modern, focused UI", "Responsive on every device", "Optimized load times", "Strong, repeated CTA", "Structure built for conversion"];

export function Transformation() {
  return (
    <Section id="transformation" aria-labelledby="transformation-title" className="border-t border-border/70">
      <div className="container-x">
        <div className="grid grid-cols-12 items-start gap-x-6 gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <SectionHeading
              id="transformation-title"
              number="05"
              eyebrow="Transformation"
              title="Same business. Different website. Different results."
              highlight={["different", "results"]}
              description="Drag the divider to compare a typical starting point with the rebuilt version. Demo imagery, replaceable from the admin."
              titleClassName="lg:text-5xl"
            />

            <Reveal stagger={0.1} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-border p-5">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Before</p>
                <ul className="flex flex-col gap-2.5 text-sm">
                  {before.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-muted-foreground">
                      <X className="size-4 shrink-0 text-destructive/80" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-accent">After</p>
                <ul className="flex flex-col gap-2.5 text-sm">
                  {after.map((a) => (
                    <li key={a} className="flex items-center gap-3">
                      <Check className="size-4 shrink-0 text-success" aria-hidden />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <Reveal scale={0.97} duration={1.2}>
              <BeforeAfterSlider
                before={{ src: "/demo/transformation/before.svg", alt: "Outdated website design with cluttered layout and weak hierarchy" }}
                after={{ src: "/demo/transformation/after.svg", alt: "Redesigned website with clear hierarchy, strong call to action and modern layout" }}
              />
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
