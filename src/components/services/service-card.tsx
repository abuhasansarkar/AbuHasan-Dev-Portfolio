"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import type { Service } from "@prisma/client";
import { cn } from "@/lib/utils";
import { ServiceIcon } from "./service-icon";

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-[border-color,background-color] duration-300 ease-[var(--ease-standard)] md:p-8",
        open ? "border-foreground/30" : "hover:-translate-y-0.5 hover:border-foreground/20",
      )}
    >
      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(600px_circle_at_var(--x,50%)_var(--y,50%),hsl(var(--accent)/0.08),transparent_40%)]" aria-hidden />

      <div className="flex items-start justify-between gap-4">
        <span className="font-display text-xs font-medium tracking-[0.2em] text-accent tabular-nums">{number}</span>
        <span className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300 ease-[var(--ease-standard)] group-hover:scale-105 group-hover:border-accent/50 group-hover:text-accent">
          <ServiceIcon name={service.icon} className="size-5" aria-hidden />
        </span>
      </div>

      <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight">{service.title}</h3>
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
            <div className="pt-6">
              <p className="text-sm leading-relaxed text-foreground/90">{service.details}</p>
              {service.features.length > 0 && (
                <ul className="mt-5 grid gap-2.5 text-sm text-muted-foreground">
                  {service.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              <a href="#contact" className="link-underline mt-6 inline-flex items-center gap-1 text-sm font-medium">
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
        className="mt-8 inline-flex items-center gap-2 self-start text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        <span className={cn("flex size-6 items-center justify-center rounded-full border border-border transition-transform duration-300", open && "rotate-45 border-accent text-accent")}>
          <Plus className="size-3.5" aria-hidden />
        </span>
        {open ? "Show less" : "What's included"}
      </button>
    </article>
  );
}
