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

            <Reveal stagger={0.1} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6 backdrop-blur-xs shadow-xs transition-all duration-300 hover:border-destructive/50">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-destructive">Before</p>
                  <span className="flex size-5 items-center justify-center rounded-full bg-destructive/20 text-destructive text-[10px] font-bold">✕</span>
                </div>
                <ul className="flex flex-col gap-3 text-sm">
                  {before.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-muted-foreground font-medium">
                      <X className="size-4 shrink-0 text-destructive/80" aria-hidden />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-success/40 bg-success/10 p-6 backdrop-blur-xs shadow-[0_8px_30px_-10px_hsl(var(--success)/0.2)] transition-all duration-300 hover:border-success/60">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-success">After</p>
                  <span className="flex size-5 items-center justify-center rounded-full bg-success/20 text-success text-[10px] font-bold">✓</span>
                </div>
                <ul className="flex flex-col gap-3 text-sm">
                  {after.map((a) => (
                    <li key={a} className="flex items-center gap-3 font-medium text-foreground">
                      <Check className="size-4 shrink-0 text-success" aria-hidden />
                      <span>{a}</span>
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
