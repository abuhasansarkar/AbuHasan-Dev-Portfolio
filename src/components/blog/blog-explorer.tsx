"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { BlogCategory } from "@prisma/client";
import type { PostWithCategory } from "@/lib/data/posts";
import { Reveal } from "@/components/animations/reveal";
import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { PostCard } from "./post-card";

const PostOverlay = dynamic(
  () => import("./post-overlay").then((m) => m.PostOverlay),
  { ssr: false }
);

const HASH_KEY = "post=";

export function BlogExplorer({ posts, categories }: { posts: PostWithCategory[]; categories: BlogCategory[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // Deep link support (#post=slug)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash.startsWith(HASH_KEY)) setActiveSlug(decodeURIComponent(hash.slice(HASH_KEY.length)));
  }, []);

  const openPost = useCallback((slug: string) => {
    setActiveSlug(slug);
    window.history.replaceState(null, "", `#${HASH_KEY}${encodeURIComponent(slug)}`);
  }, []);
  const closePost = useCallback(() => {
    setActiveSlug(null);
    window.history.replaceState(null, "", "#blog");
  }, []);

  const usedCategories = useMemo(() => categories.filter((c) => posts.some((p) => p.categoryId === c.id)), [categories, posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (category !== "all" && p.category.slug !== category) return false;
      if (!q) return true;
      return [p.title, p.excerpt, p.category.name, ...p.tags].some((s) => s.toLowerCase().includes(q));
    });
  }, [posts, query, category]);

  const isFiltering = query.trim() !== "" || category !== "all";
  const featured = !isFiltering ? (filtered.find((p) => p.featured) ?? filtered[0]) : undefined;
  const rest = featured ? filtered.filter((p) => p.id !== featured.id) : filtered;

  const activePost = activeSlug ? (posts.find((p) => p.slug === activeSlug) ?? null) : null;
  const related = activePost ? posts.filter((p) => p.id !== activePost.id && (p.categoryId === activePost.categoryId || p.tags.some((t) => activePost.tags.includes(t)))).slice(0, 3) : [];

  return (
    <>
      {/* Controls */}
      <Reveal className="mt-12 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" delay={0.1}>
        <div role="tablist" aria-label="Filter by category" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ slug: "all", name: "All" }, ...usedCategories].map((c) => (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={category === c.slug}
              onClick={() => setCategory(c.slug)}
              className={cn("shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", category === c.slug ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground")}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles…" aria-label="Search articles" className="pl-11 pr-10" />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground">
              <X className="size-4" />
            </button>
          )}
        </div>
      </Reveal>

      <p className="mt-4 text-sm text-muted-foreground" role="status" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        {isFiltering ? " found" : ""}
      </p>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={Search}
          title="No articles match"
          description="Try a different keyword or category."
          action={
            <Button type="button" variant="outline" size="sm" onClick={() => { setQuery(""); setCategory("all"); }}>
              Reset filters
            </Button>
          }
        />
      ) : (
        <div className="mt-10 flex flex-col gap-16">
          {featured && (
            <Reveal>
              <PostCard post={featured} featured onOpen={() => openPost(featured.slug)} />
            </Reveal>
          )}
          {rest.length > 0 && (
            <div key={`${category}-${query}`} className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Reveal key={post.id} y={24} start="top 95%">
                  <PostCard post={post} onOpen={() => openPost(post.slug)} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      )}

      {activePost && (
        <PostOverlay post={activePost} onClose={closePost} related={related} onOpen={openPost} />
      )}
    </>
  );
}
