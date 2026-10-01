"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Clock, Link2, X } from "lucide-react";
import type { PostWithCategory } from "@/lib/data/posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatIsoDate } from "@/lib/utils";
import { Markdown } from "./markdown";

type Props = { post: PostWithCategory | null; onClose: () => void; related: PostWithCategory[]; onOpen: (slug: string) => void };

export function PostOverlay({ post, onClose, related, onOpen }: Props) {
  const open = post !== null;
  const scroller = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = scroller.current;
    if (!el || !open) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? el.scrollTop / max : 0);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [open, post?.id]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
    setCopied(false);
  }, [post?.id]);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: ignore */
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && post && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm" />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                ref={scroller}
                initial={{ y: "4%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "3%", opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                data-lenis-prevent
                className="fixed inset-0 z-[70] overflow-y-auto bg-background focus:outline-none"
              >
                <div className="sticky top-0 z-10 border-b border-border/70 bg-background/80 backdrop-blur-xl">
                  <div className="absolute inset-x-0 top-0 h-0.5 origin-left bg-accent" style={{ transform: `scaleX(${progress})` }} aria-hidden />
                  <div className="container-x flex h-16 items-center justify-between gap-4">
                    <Dialog.Close asChild>
                      <Button type="button" variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground">
                        <ArrowLeft aria-hidden />
                        Back to insights
                      </Button>
                    </Dialog.Close>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={share} aria-live="polite">
                        {copied ? <Check aria-hidden /> : <Link2 aria-hidden />}
                        {copied ? "Link copied" : "Copy link"}
                      </Button>
                      <Dialog.Close asChild>
                        <Button type="button" size="icon-sm" aria-label="Close article">
                          <X />
                        </Button>
                      </Dialog.Close>
                    </div>
                  </div>
                </div>

                <motion.article key={post.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="container-x pb-24 pt-12 md:pt-16">
                  <header className="mx-auto max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge>{post.category.name}</Badge>
                      <time dateTime={formatIsoDate(post.publishedAt)}>{formatDate(post.publishedAt, { month: "long" })}</time>
                      <span aria-hidden>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" aria-hidden />
                        {post.readingTime} min read
                      </span>
                      {post.isDemo && <Badge variant="outline">Demo article</Badge>}
                    </div>
                    <Dialog.Title className="mt-6 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-5xl">{post.title}</Dialog.Title>
                    <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
                    <p className="mt-6 text-sm text-muted-foreground">
                      By <span className="font-medium text-foreground">{post.author}</span>
                    </p>
                  </header>

                  {post.coverImage && (
                    <div className="relative mx-auto mt-10 aspect-[16/9] max-w-5xl overflow-hidden rounded-2xl border border-border bg-secondary">
                      <Image src={post.coverImage} alt="" fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" priority />
                    </div>
                  )}

                  <div className="mx-auto mt-12 max-w-3xl">
                    <Markdown content={post.content} />

                    {post.tags.length > 0 && (
                      <ul className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8" aria-label="Tags">
                        {post.tags.map((t) => (
                          <li key={t}>
                            <Badge variant="outline">#{t}</Badge>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {related.length > 0 && (
                    <aside className="mx-auto mt-16 max-w-5xl border-t border-border pt-10">
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Keep reading</p>
                      <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {related.map((r) => (
                          <button key={r.id} type="button" onClick={() => onOpen(r.slug)} className="group rounded-2xl border border-border p-5 text-left transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <span className="text-xs text-muted-foreground">{r.category.name}</span>
                            <span className="mt-2 block font-display text-lg font-semibold leading-snug tracking-tight group-hover:text-accent">{r.title}</span>
                          </button>
                        ))}
                      </div>
                    </aside>
                  )}
                </motion.article>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
