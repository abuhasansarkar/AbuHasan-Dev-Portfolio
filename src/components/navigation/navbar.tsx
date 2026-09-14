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
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || open ? "border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60" : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-x flex h-18 items-center justify-between gap-6 lg:h-20">
          <a href="#hero" className="font-display text-lg font-semibold tracking-tight text-foreground" aria-label={`${name} – back to top`}>
            {name}
            <span className="text-accent">.</span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = activeHref === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn("relative rounded-full px-4 py-2 text-sm font-medium transition-colors", isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-foreground/[0.06]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden lg:inline-flex" />
            <Magnetic strength={0.25} className="hidden lg:inline-block">
              <Button asChild size="sm" variant="default" data-cursor="cta">
                <a href="#contact">{ctaLabel}</a>
              </Button>
            </Magnetic>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="lg:hidden"
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
