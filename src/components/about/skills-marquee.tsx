import { Marquee } from "@/components/animations/marquee";

export function SkillsMarquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div aria-label="Focus areas" className="hairline border-b border-border/60 py-6 bg-secondary/20 backdrop-blur-xs">
      <Marquee speed={40} reactive>
        {items.map((item) => (
          <span
            key={item}
            className="group flex items-center gap-3 mr-4 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-foreground/80 shadow-xs backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:bg-card hover:text-foreground hover:shadow-[0_0_12px_1px_hsl(var(--accent)/0.2)] md:text-sm"
          >
            <span className="size-1.5 rounded-full bg-accent animate-[glow-pulse_3s_ease-in-out_infinite]" aria-hidden />
            <span>{item}</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
