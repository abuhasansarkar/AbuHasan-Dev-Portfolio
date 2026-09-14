import { Reveal } from "@/components/animations/reveal";
import { TextReveal } from "@/components/animations/text-reveal";
import { Section } from "@/components/layout/section";
import { principles } from "@/lib/content/principles";

export function Why() {
  return (
    <Section id="why" aria-labelledby="why-title" className="border-t border-border/70">
      <div className="container-x">
        <Reveal as="p" y={12} className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
          <span className="font-display text-accent">07</span>
          <span className="h-px w-6 bg-border" aria-hidden />
          Why work with me
        </Reveal>

        <TextReveal
          id="why-title"
          as="h2"
          text={"Design gets attention.\nPerformance earns trust.\nConversion creates business."}
          muted={["gets", "attention.", "earns", "trust.", "creates"]}
          highlight={["business."]}
          stagger={0.06}
          className="mt-8 max-w-5xl font-display text-[clamp(2.2rem,6vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]"
        />

        <Reveal stagger={0.07} className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {principles.map((p, i) => (
            <div key={p.title} className="group relative flex min-h-56 flex-col justify-between bg-card p-7 transition-colors duration-500 hover:bg-secondary">
              <span className="font-display text-xs font-medium tracking-[0.2em] text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
