"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, X } from "lucide-react";
import type { ProjectWithImages } from "@/lib/data/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CaseStudyBody } from "@/components/case-study/case-study-body";

type Props = {
  projects: ProjectWithImages[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function CaseStudyOverlay({ projects, index, onClose, onNavigate }: Props) {
  const project = index === null ? null : projects[index];
  const open = project !== null && project !== undefined;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNavigate((index! + 1) % projects.length);
      if (e.key === "ArrowLeft") onNavigate((index! - 1 + projects.length) % projects.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, projects.length, onNavigate]);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && project && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm" />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                initial={{ y: "4%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "3%", opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                data-lenis-prevent
                className="fixed inset-0 z-[70] overflow-y-auto bg-background focus:outline-none grain"
              >
                {/* Top bar */}
                <div className="sticky top-0 z-10 border-b border-border/70 bg-background/80 backdrop-blur-xl">
                  <div className="container-x flex h-16 items-center justify-between gap-4">
                    <p className="truncate text-sm text-muted-foreground">
                      <span className="font-display font-medium text-accent tabular-nums">{String(index! + 1).padStart(2, "0")}</span>
                      <span className="mx-2">/</span>
                      <span className="tabular-nums">{String(projects.length).padStart(2, "0")}</span>
                      <span className="mx-3 hidden sm:inline">·</span>
                      <span className="hidden sm:inline">{project.title}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="icon-sm" aria-label="Previous project" onClick={() => onNavigate((index! - 1 + projects.length) % projects.length)}>
                        <ArrowLeft />
                      </Button>
                      <Button type="button" variant="outline" size="icon-sm" aria-label="Next project" onClick={() => onNavigate((index! + 1) % projects.length)}>
                        <ArrowRight />
                      </Button>
                      <Dialog.Close asChild>
                        <Button type="button" variant="default" size="sm" className="ml-2">
                          <X aria-hidden />
                          Close
                        </Button>
                      </Dialog.Close>
                    </div>
                  </div>
                </div>

                <motion.article key={project.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="container-x pb-24 pt-12 md:pt-16">
                  {/* Header */}
                  <div className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{project.category}</span>
                        <span aria-hidden>·</span>
                        <span>{project.industry}</span>
                        {project.year && (
                          <>
                            <span aria-hidden>·</span>
                            <span>{project.year}</span>
                          </>
                        )}
                        {project.isDemo && <Badge variant="accent">Demo content</Badge>}
                      </div>
                      <Dialog.Title className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-6xl">{project.title}</Dialog.Title>
                      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{project.excerpt}</p>
                    </div>
                    <div className="flex flex-col justify-end gap-3 lg:col-span-3 lg:col-start-10">
                      {project.projectUrl && (
                        <Button asChild variant="outline">
                          <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                            Visit live site
                            <ExternalLink aria-hidden />
                          </a>
                        </Button>
                      )}
                      <Button asChild variant="accent" data-cursor="cta">
                        <a href="#contact" onClick={onClose}>
                          Start a similar project
                        </a>
                      </Button>
                    </div>
                  </div>

                  <CaseStudyBody project={project} />

                  {/* Footer nav */}
                  <div className="mt-6 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
                    {[
                      { label: "Previous project", i: (index! - 1 + projects.length) % projects.length, Icon: ArrowLeft, align: "left" as const },
                      { label: "Next project", i: (index! + 1) % projects.length, Icon: ArrowRight, align: "right" as const },
                    ].map(({ label, i, Icon, align }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => onNavigate(i)}
                        className={`group flex items-center gap-4 rounded-2xl border border-border p-6 text-left transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${align === "right" ? "sm:flex-row-reverse sm:text-right" : ""}`}
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border transition-colors group-hover:border-accent group-hover:text-accent">
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
                          <span className="mt-1 block truncate font-display text-lg font-semibold tracking-tight">{projects[i]?.title}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.article>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
