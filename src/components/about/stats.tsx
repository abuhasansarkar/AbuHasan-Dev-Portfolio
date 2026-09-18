import { Award, Code2, Gauge, Users } from "lucide-react";
import { Counter } from "@/components/animations/counter";
import { Reveal } from "@/components/animations/reveal";
import type { SiteSettings } from "@/lib/settings/schema";

const STAT_ICONS = [Code2, Award, Users, Gauge];

export function Stats({ stats }: { stats: SiteSettings["stats"] }) {
  if (stats.length === 0) return null;
  return (
    <div className="container-x pb-20 md:pb-28 lg:pb-36" aria-label="Key figures">
      <Reveal stagger={0.1} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = STAT_ICONS[i % STAT_ICONS.length] ?? Code2;
          return (
            <div
              key={stat.label}
              className="group relative flex min-h-48 flex-col justify-between rounded-2xl border border-border/80 bg-card/70 p-7 backdrop-blur-md shadow-xs transition-all duration-300 ease-[var(--ease-standard)] hover:-translate-y-1 hover:border-accent/40 hover:bg-card hover:shadow-[0_12px_32px_-8px_hsl(var(--accent)/0.15)] accent-top-line shine-on-hover"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-accent/80 tracking-wider">
                  0{i + 1}
                </span>
                <span className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-secondary/60 text-muted-foreground transition-all duration-300 group-hover:border-accent/40 group-hover:text-accent group-hover:scale-110 group-hover:shadow-[0_0_12px_hsl(var(--accent)/0.2)]">
                  <Icon className="size-4.5" aria-hidden />
                </span>
              </div>

              <div>
                <p className="font-display text-4xl font-bold tracking-[-0.03em] text-foreground md:text-5xl">
                  {typeof stat.numeric === "number" ? (
                    <Counter value={stat.numeric} prefix={stat.prefix} suffix={stat.suffix} />
                  ) : (
                    <span className="text-3xl md:text-4xl">{stat.value}</span>
                  )}
                </p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </Reveal>
    </div>
  );
}

