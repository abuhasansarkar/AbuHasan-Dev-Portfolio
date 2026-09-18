"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { ProjectWithImages } from "@/lib/data/projects";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Parallax } from "@/components/animations/parallax";
import { BrowserFrame } from "./browser-frame";

type ProjectCardProps = {
  project: ProjectWithImages;
  index: number;
  wide: boolean;
  onOpen: () => void;
};

export function ProjectCard({ project, index, wide, onOpen }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);
  const [imgError, setImgError] = useState(false);

  // Subtle card tilt following the pointer (desktop only via pointer events on hover-capable devices)
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${-py * 4}deg`);
    el.style.setProperty("--ry", `${px * 6}deg`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("group relative flex flex-col [perspective:1200px]", wide ? "lg:col-span-7" : "lg:col-span-5")}
    >
      <button
        type="button"
        onClick={onOpen}
        data-cursor="project"
        aria-label={`Open case study: ${project.title}`}
        className="relative block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-3xl"
      >
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-secondary/35 p-3 sm:p-5 lg:p-7 backdrop-blur-xs transition-all duration-500 ease-[var(--ease-standard)] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] group-hover:border-accent/40 group-hover:shadow-[0_20px_50px_-15px_hsl(var(--accent)/0.15)]">
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(800px circle at 30% 0%, ${project.accentColor ?? "hsl(var(--accent))"}28, transparent 55%)` }} aria-hidden />
          <BrowserFrame url={project.projectUrl || `${project.slug}.com`} accent={project.accentColor} className="translate-y-2 transition-transform duration-500 ease-[var(--ease-standard)] group-hover:translate-y-0">
            <div className={cn("relative w-full overflow-hidden bg-background", wide ? "aspect-[16/10]" : "aspect-[4/3]")}>
              {imgError ? (
                <div className="flex size-full items-center justify-center text-xs text-muted-foreground">Preview unavailable</div>
              ) : (
                <Parallax className="absolute inset-x-0 top-[-7%] h-[114%] w-full" strength={16} as="div">
                <Image
                  src={project.coverImage}
                  alt={`${project.title} website preview`}
                  fill
                  sizes={wide ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 42vw, 100vw"}
                  className="object-cover object-top transition-transform duration-700 ease-[var(--ease-standard)] group-hover:scale-[1.04]"
                  priority={index < 2}
                  onError={() => setImgError(true)}
                />
                </Parallax>
              )}
            </div>
          </BrowserFrame>
          <span className="absolute right-5 top-5 flex size-11 translate-y-2 items-center justify-center rounded-full bg-foreground text-background opacity-0 shadow-lg transition-all duration-300 ease-[var(--ease-standard)] group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-105 group-hover:bg-accent group-hover:text-accent-foreground lg:right-8 lg:top-8" aria-hidden>
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </button>

      <div className="mt-6 flex flex-col gap-3.5 px-1">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-medium">
          <span className="font-mono text-xs font-semibold text-accent tabular-nums">{String(index + 1).padStart(2, "0")}</span>
          <span aria-hidden className="text-border">·</span>
          <span className="rounded-full bg-secondary/70 px-2.5 py-0.5 text-foreground/80">{project.industry}</span>
          {project.year && (
            <>
              <span aria-hidden className="text-border">·</span>
              <span>{project.year}</span>
            </>
          )}
        </div>
        <div className="flex items-start justify-between gap-6">
          <h3 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            <button type="button" onClick={onOpen} className="link-underline text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm hover:text-accent transition-colors">
              {project.title}
            </button>
          </h3>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">{project.excerpt}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.technologies.slice(0, 5).map((t) => (
            <Badge key={t} variant="outline" className="rounded-full border-border/70 bg-card/60 px-2.5 py-0.5 text-xs font-medium backdrop-blur-xs transition-colors hover:border-accent/40 hover:text-foreground">
              {t}
            </Badge>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-5 text-sm font-semibold">
          <button type="button" onClick={onOpen} className="inline-flex items-center gap-1.5 text-accent transition-all hover:text-accent/80 hover:translate-x-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
            View case study
            <ArrowUpRight className="size-4" aria-hidden />
          </button>
          {project.projectUrl && (
            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground">
              Visit live site
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
