"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { ProjectWithImages } from "@/lib/data/projects";
import { ProjectCard } from "./project-card";
import { cn } from "@/lib/utils";

const CaseStudyOverlay = dynamic(
  () => import("@/components/case-study/case-study-overlay").then((m) => m.CaseStudyOverlay),
  { ssr: false }
);

const HASH_KEY = "project=";

export function WorkGrid({ projects }: { projects: ProjectWithImages[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const list = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
    return ["All", ...list];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  // Deep link: #project=slug opens the overlay on load
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash.startsWith(HASH_KEY)) return;
    const slug = decodeURIComponent(hash.slice(HASH_KEY.length));
    const i = projects.findIndex((p) => p.slug === slug);
    if (i >= 0) setActive(i);
  }, [projects]);

  const open = useCallback(
    (i: number) => {
      setActive(i);
      const slug = projects[i]?.slug;
      if (slug) window.history.replaceState(null, "", `#${HASH_KEY}${encodeURIComponent(slug)}`);
    },
    [projects],
  );

  const close = useCallback(() => {
    setActive(null);
    window.history.replaceState(null, "", "#work");
  }, []);

  return (
    <>
      {/* Interactive Category Filter Tabs */}
      {categories.length > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            const count = category === "All" ? projects.length : projects.filter((p) => p.category === category).length;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                )}
              >
                {isSelected && (
                  <motion.span
                    layoutId="work-filter-active"
                    className="absolute inset-0 -z-10 rounded-full border border-accent/40 bg-accent/15 shadow-[0_0_16px_hsl(var(--accent)/0.25)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span>{category}</span>
                <span
                  className={cn(
                    "ml-1.5 text-[11px] tabular-nums",
                    isSelected ? "text-accent font-bold" : "text-muted-foreground/60",
                  )}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Projects Grid */}
      <motion.div
        layout
        className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 lg:mt-16 lg:grid-cols-12 lg:gap-y-24"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, i) => {
            const originalIndex = projects.findIndex((p) => p.id === project.id);
            const isWide = i % 4 === 0 || i % 4 === 3;
            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={cn(isWide ? "lg:col-span-7" : "lg:col-span-5")}
              >
                <ProjectCard
                  project={project}
                  index={i}
                  wide={isWide}
                  className="lg:col-span-12"
                  onOpen={() => open(originalIndex >= 0 ? originalIndex : i)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {active !== null && (
        <CaseStudyOverlay projects={projects} index={active} onClose={close} onNavigate={open} />
      )}
    </>
  );
}
