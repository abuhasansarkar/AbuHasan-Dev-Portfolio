import { Marquee } from "@/components/animations/marquee";

export function SkillsMarquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div aria-label="Focus areas" className="hairline border-b border-border/70 py-5">
      <Marquee speed={45} reactive>
        {items.map((item) => (
          <span key={item} className="flex items-center gap-6 pr-6 font-display text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground md:text-base">
            {item}
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
