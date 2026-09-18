"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/animations/magnetic";
import { useActiveSection } from "@/hooks/use-active-section";
import { navLinks, sectionIds, type SectionId } from "@/lib/site";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

/** Which nav link lights up for each section on the page */
const sectionToNav: Record<SectionId, string> = {
  hero: "",
  about: "#about",
  services: "#services",
  expertise: "#services",
  work: "#work",
  transformation: "#work",
  process: "#process",
  why: "#process",
  testimonials: "#process",
  blog: "#blog",
  faq: "#blog",
  contact: "#contact",
};

export function Navbar({ ctaLabel, name }: { ctaLabel: string; name: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(sectionIds) as SectionId;
  const activeHref = sectionToNav[active] ?? "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled || open
            ? "border-b border-border/70 bg-background/80 backdrop-blur-2xl shadow-[0_8px_32px_-8px_hsl(var(--foreground)/0.06)] supports-[backdrop-filter]:bg-background/70"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-x flex h-18 items-center justify-between gap-6 lg:h-20">
          <a
            href="#hero"
            className="group flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-foreground transition-transform duration-300 hover:scale-[1.02]"
            aria-label={`${name} – back to top`}
          >
            <span className="relative flex size-2.5 items-center justify-center">
              <span className="radar-beacon size-2 rounded-full bg-accent" />
            </span>
            <span>
              {name}
              <span className="text-accent transition-colors duration-300 group-hover:text-foreground">.</span>
            </span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1 rounded-full border border-border/50 bg-secondary/40 p-1 backdrop-blur-md lg:flex">
            {navLinks.map((link) => {
              const isActive = activeHref === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200",
                    isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-background shadow-sm border border-border/60"
                      transition={{ type: "spring", stiffness: 420, damping: 35 }}
                    />
                  )}
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle className="hidden lg:inline-flex" />
            <Magnetic strength={0.25} className="hidden lg:inline-block">
              <Button asChild size="sm" variant="accent" data-cursor="cta" className="breathe-glow font-medium shadow-[0_0_20px_-3px_hsl(var(--accent)/0.4)]">
                <a href="#contact">{ctaLabel}</a>
              </Button>
            </Magnetic>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="lg:hidden rounded-full border-border/80 bg-background/60 backdrop-blur-sm"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={close} links={navLinks} ctaLabel={ctaLabel} activeHref={activeHref} />
    </>
  );
}
