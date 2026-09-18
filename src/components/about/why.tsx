import { CheckCircle2, Code2, MessageSquare, Search, Smartphone, Target, TrendingUp, Zap } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { TextReveal } from "@/components/animations/text-reveal";
import { Section } from "@/components/layout/section";
import { principles } from "@/lib/content/principles";

const PRINCIPLE_ICONS = [Target, TrendingUp, CheckCircle2, Zap, Smartphone, Search, Code2, MessageSquare];

export function Why() {
  return (
    <Section id="why" aria-labelledby="why-title" className="border-t border-border/70">
      <div className="container-x">
        <Reveal as="p" y={12} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          <span className="font-mono text-accent">07</span>
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

        <Reveal stagger={0.05} className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {principles.map((p, i) => {
            const Icon = PRINCIPLE_ICONS[i % PRINCIPLE_ICONS.length] ?? Target;
            return (
              <div
                key={p.title}
                className="group relative flex min-h-56 flex-col justify-between rounded-2xl border border-border/80 bg-card/70 p-7 backdrop-blur-md shadow-xs transition-all duration-300 ease-[var(--ease-standard)] hover:bg-card hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_hsl(var(--accent)/0.15)] accent-top-line shine-on-hover"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold tracking-wider text-accent tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-secondary/60 text-muted-foreground transition-all duration-300 group-hover:border-accent/40 group-hover:text-accent group-hover:scale-110 group-hover:shadow-[0_0_12px_hsl(var(--accent)/0.2)]">
                    <Icon className="size-4" aria-hidden />
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">{p.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </Section>
  );
}

