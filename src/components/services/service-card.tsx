import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import type { Service } from "@prisma/client";
import { cn } from "@/lib/utils";
import { ServiceIcon } from "./service-icon";

const serviceEstimates: Record<string, string> = {
  "website-design": "From $699",
  "wordpress-development": "From $599",
  "elementor-development": "From $399",
  "landing-pages": "From $349",
  "ui-ux-design": "From $499",
  "woocommerce": "From $799",
  "framer-webflow": "From $599",
  "seo": "From $299",
  "performance-optimization": "From $199",
  "troubleshooting": "From $99",
};

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const number = String(index + 1).padStart(2, "0");
  const estimate = serviceEstimates[service.slug] ?? "Custom Scope";

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-3xl border border-border/80 bg-card/70 p-6 md:p-8 backdrop-blur-md shadow-xs transition-all duration-300 ease-[var(--ease-standard)] accent-top-line shine-on-hover",
        open
          ? "border-accent/50 bg-card shadow-[0_16px_40px_-10px_hsl(var(--accent)/0.15)]"
          : "hover:-translate-y-1 hover:border-accent/40 hover:bg-card hover:shadow-[0_16px_40px_-10px_hsl(var(--accent)/0.18)]",
      )}
    >
      <span className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(600px_circle_at_var(--x,50%)_var(--y,50%),hsl(var(--accent)/0.08),transparent_40%)]" aria-hidden />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-semibold tracking-wider text-accent tabular-nums">{number}</span>
          <span className="rounded-full border border-border/70 bg-secondary/50 px-2.5 py-0.5 font-mono text-[11px] font-medium text-foreground/80">
            {estimate}
          </span>
        </div>
        <span className="flex size-12 items-center justify-center rounded-2xl border border-border/70 bg-secondary/70 text-foreground transition-all duration-300 ease-[var(--ease-standard)] group-hover:scale-110 group-hover:border-accent/50 group-hover:text-accent group-hover:shadow-[0_0_16px_2px_hsl(var(--accent)/0.25)]">
          <ServiceIcon name={service.icon} className="size-5 transition-transform duration-300 group-hover:scale-110" aria-hidden />
        </span>
      </div>

      <h3 className="mt-7 font-display text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">{service.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{service.description}</p>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-6 border-t border-border/50 mt-6">
              <p className="text-sm leading-relaxed text-foreground/90">{service.details}</p>
              {service.features.length > 0 && (
                <ul className="mt-5 grid gap-2.5 text-sm text-muted-foreground">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <span className="flex size-4 items-center justify-center rounded-full bg-accent/15 text-accent shrink-0" aria-hidden>
                        <Check className="size-2.5 stroke-[3]" />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              <a href="#contact" className="link-underline mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/90 transition-colors">
                Discuss this service
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="mt-8 inline-flex items-center gap-2.5 self-start rounded-full border border-border/70 bg-secondary/50 px-3.5 py-1.5 text-xs font-medium text-foreground/85 transition-all hover:border-accent/40 hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className={cn("flex size-4.5 items-center justify-center rounded-full transition-transform duration-300", open && "rotate-45 text-accent")}>
          <Plus className="size-3.5" aria-hidden />
        </span>
        <span>{open ? "Show less" : "What's included"}</span>
      </button>
    </article>
  );
}

