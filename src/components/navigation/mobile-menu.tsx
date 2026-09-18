"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/animations/magnetic";
import { ThemeToggle } from "./theme-toggle";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  links: readonly { label: string; href: string }[];
  ctaLabel: string;
  activeHref: string;
};

const instant = { duration: 0 };

const LIST_ANIM = { visible: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } }, exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } } };
const item = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { y: 20, opacity: 0, transition: { duration: 0.25 } },
};

export function MobileMenu({ open, onClose, links, ctaLabel, activeHref }: MobileMenuProps) {
  // clip-path is not a transform, so MotionConfig's reduced-motion handling skips it — collapse manually.
  const reduced = !!useReducedMotion();
  const overlay = reduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: instant }, exit: { opacity: 0, transition: instant } }
    : {
        hidden: { clipPath: "inset(0 0 100% 0)" },
        visible: { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] as const } },
        exit: { clipPath: "inset(0 0 100% 0)", transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] as const, delay: 0.1 } },
      };
  const list = reduced ? { visible: { transition: instant }, exit: { transition: instant } } : LIST_ANIM;
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          variants={overlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-40 flex flex-col bg-background/95 backdrop-blur-2xl grain lg:hidden"
        >
          {/* Subtle ambient light orb */}
          <div className="pointer-events-none absolute -top-20 -right-20 size-80 rounded-full bg-accent/15 blur-3xl" aria-hidden />

          <div className="container-x relative z-10 flex flex-1 flex-col justify-between pb-10 pt-28">
            <motion.nav variants={list} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-1">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  variants={item}
                  href={link.href}
                  onClick={onClose}
                  aria-current={activeHref === link.href ? "page" : undefined}
                  className="group flex items-baseline justify-between border-b border-border/60 py-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl transition-colors hover:text-accent"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-xs font-medium text-accent tabular-nums">0{i + 1}</span>
                    <span className={activeHref === link.href ? "text-accent" : ""}>{link.label}</span>
                  </span>
                  <ArrowUpRight className="size-6 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" aria-hidden />
                </motion.a>
              ))}
            </motion.nav>

            <motion.div variants={item} initial="hidden" animate="visible" exit="exit" className="flex items-center justify-between gap-4 pt-10 border-t border-border/40">
              <Magnetic strength={0.2} className="flex-1">
                <Button asChild variant="accent" size="lg" className="w-full shadow-[0_0_24px_-4px_hsl(var(--accent)/0.4)]" data-cursor="cta">
                  <a href="#contact" onClick={onClose}>
                    {ctaLabel}
                  </a>
                </Button>
              </Magnetic>
              <ThemeToggle className="size-13 rounded-full border border-border bg-card/60 shadow-sm" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
