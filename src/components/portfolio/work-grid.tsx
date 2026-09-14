"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProjectWithImages } from "@/lib/data/projects";
import { Reveal } from "@/components/animations/reveal";
import { CaseStudyOverlay } from "@/components/case-study/case-study-overlay";
import { ProjectCard } from "./project-card";

const HASH_KEY = "project=";

export function WorkGrid({ projects }: { projects: ProjectWithImages[] }) {
  const [active, setActive] = useState<number | null>(null);

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
      <Reveal stagger={0.12} className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 lg:mt-20 lg:grid-cols-12 lg:gap-y-24">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} wide={i % 4 === 0 || i % 4 === 3} onOpen={() => open(i)} />
        ))}
      </Reveal>
      <CaseStudyOverlay projects={projects} index={active} onClose={close} onNavigate={open} />
    </>
  );
}
