"use client";

import { ExternalLink, Quote } from "lucide-react";
import type { ContentBlock } from "@/types/content-blocks";
import { CodeBlock } from "@/components/content/code-block";

interface BlockRendererProps {
  blocks: ContentBlock[];
  className?: string;
}

export function BlockRenderer({ blocks, className }: BlockRendererProps) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-6 ${className ?? ""}`}>
      {blocks.map((block) => {
        switch (block.type) {
          case "text": {
            const { tag, content, id } = block;
            if (!content) return null;

            if (tag === "h1") {
              return (
                <h1 key={id} className="mt-8 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
                  {content}
                </h1>
              );
            }
            if (tag === "h2") {
              return (
                <h2 key={id} className="mt-8 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {content}
                </h2>
              );
            }
            if (tag === "h3") {
              return (
                <h3 key={id} className="mt-6 font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                  {content}
                </h3>
              );
            }
            if (tag === "h4") {
              return (
                <h4 key={id} className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                  {content}
                </h4>
              );
            }
            if (tag === "h5") {
              return (
                <h5 key={id} className="mt-4 text-base font-semibold text-foreground">
                  {content}
                </h5>
              );
            }
            if (tag === "h6") {
              return (
                <h6 key={id} className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {content}
                </h6>
              );
            }
            if (tag === "span") {
              return (
                <div key={id} className="my-1">
                  <span className="inline-flex items-center rounded-md border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium tracking-wide text-accent">
                    {content}
                  </span>
                </div>
              );
            }

            // Default: "p"
            return (
              <p key={id} className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {content}
              </p>
            );
          }

          case "video": {
            return (
              <figure key={block.id} className="my-4 overflow-hidden rounded-2xl border border-border/80 bg-card/60 shadow-md">
                <div className="relative aspect-video w-full bg-black/40">
                  <iframe
                    src={block.embedUrl}
                    title={block.caption || "Video player"}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                {block.caption && (
                  <figcaption className="border-t border-border/60 bg-secondary/30 px-4 py-2 text-center text-xs text-muted-foreground">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          case "image": {
            return (
              <figure key={block.id} className="my-4 overflow-hidden rounded-2xl border border-border/80 bg-secondary/30 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.url}
                  alt={block.alt || "Article illustration"}
                  className="max-h-[600px] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                {block.caption && (
                  <figcaption className="border-t border-border/60 bg-secondary/40 px-4 py-2.5 text-center text-xs text-muted-foreground">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          case "code": {
            return (
              <CodeBlock
                key={block.id}
                code={block.code}
                language={block.language}
                title={block.title}
              />
            );
          }

          case "link": {
            return (
              <div key={block.id} className="my-3">
                <a
                  href={block.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-xl border border-border bg-card/80 px-4 py-3 text-sm font-medium transition-all hover:border-accent/60 hover:bg-card hover:text-accent shadow-sm"
                >
                  <span className="underline decoration-accent/40 underline-offset-4 group-hover:decoration-accent">
                    {block.title}
                  </span>
                  <ExternalLink className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                  {block.description && (
                    <span className="text-xs text-muted-foreground font-normal">
                      – {block.description}
                    </span>
                  )}
                </a>
              </div>
            );
          }

          case "quote": {
            return (
              <blockquote
                key={block.id}
                className="my-5 rounded-2xl border-l-4 border-accent bg-secondary/30 p-5 text-foreground/90 italic"
              >
                <div className="flex gap-3">
                  <Quote className="size-5 shrink-0 text-accent" />
                  <div className="space-y-1">
                    <p className="text-base md:text-lg">{block.quote}</p>
                    {block.author && (
                      <cite className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground not-italic">
                        — {block.author}
                      </cite>
                    )}
                  </div>
                </div>
              </blockquote>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
