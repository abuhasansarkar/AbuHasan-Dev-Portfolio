import { Counter } from "@/components/animations/counter";
import { Reveal } from "@/components/animations/reveal";
import type { SiteSettings } from "@/lib/settings/schema";

export function Stats({ stats }: { stats: SiteSettings["stats"] }) {
  if (stats.length === 0) return null;
  return (
    <div className="container-x pb-20 md:pb-28 lg:pb-36" aria-label="Key figures">
      <Reveal stagger={0.1} className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="group relative flex min-h-44 flex-col justify-between bg-card p-7 transition-all duration-300 ease-[var(--ease-standard)] hover:bg-secondary hover:-translate-y-0.5 accent-top-line">
            <p className="font-display text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
              {typeof stat.numeric === "number" ? <Counter value={stat.numeric} prefix={stat.prefix} suffix={stat.suffix} /> : <span className="text-3xl md:text-4xl">{stat.value}</span>}
            </p>
            <p className="mt-6 text-sm leading-snug text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
