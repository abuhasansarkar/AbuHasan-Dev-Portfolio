"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Clock } from "lucide-react";
import type { PostWithCategory } from "@/lib/data/posts";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, formatIsoDate } from "@/lib/utils";

type Props = { post: PostWithCategory; onOpen: () => void; featured?: boolean };

export function PostCard({ post, onOpen, featured = false }: Props) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className={cn("group relative flex flex-col", featured && "lg:grid lg:grid-cols-12 lg:items-center lg:gap-10")}>
      <button
        type="button"
        onClick={onOpen}
        data-cursor="project"
        aria-label={`Read article: ${post.title}`}
        className={cn("relative block overflow-hidden rounded-2xl border border-border bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", featured ? "aspect-[16/10] lg:col-span-7" : "aspect-[16/10]")}
      >
        {post.coverImage && !imgError ? (
          <Image src={post.coverImage} alt="" fill sizes={featured ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"} className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]" onError={() => setImgError(true)} />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-secondary to-background">
            <span className="font-display text-6xl font-semibold text-foreground/10">{post.category.name.slice(0, 1)}</span>
          </div>
        )}
        <span className="absolute left-4 top-4">
          <Badge className="bg-background/80 backdrop-blur">{post.category.name}</Badge>
        </span>
        <span className="absolute bottom-4 right-4 flex size-10 translate-y-2 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100" aria-hidden>
          <ArrowUpRight className="size-4" />
        </span>
      </button>

      <div className={cn("mt-5 flex flex-col gap-3", featured && "lg:col-span-5 lg:mt-0")}>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={formatIsoDate(post.publishedAt)}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden />
            {post.readingTime} min read
          </span>
          {featured && <Badge variant="accent">Featured</Badge>}
        </div>
        <h3 className={cn("font-display font-semibold tracking-tight", featured ? "text-2xl md:text-3xl lg:text-4xl" : "text-xl")}>
          <button type="button" onClick={onOpen} className="link-underline text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
            {post.title}
          </button>
        </h3>
        <p className={cn("leading-relaxed text-muted-foreground", featured ? "text-base md:text-lg" : "text-sm")}>{post.excerpt}</p>
        {featured && (
          <button type="button" onClick={onOpen} className="mt-2 inline-flex items-center gap-1.5 self-start text-sm font-medium transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
            Read article
            <ArrowUpRight className="size-4" aria-hidden />
          </button>
        )}
      </div>
    </article>
  );
}
