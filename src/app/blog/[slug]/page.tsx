import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/blog/markdown";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/data/posts";
import { getSiteSettings } from "@/lib/settings/get-settings";
import { siteConfig } from "@/lib/site";
import { formatDate, formatIsoDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

/** Fresh data at most hourly; admin publishes already revalidate the tags. */
export const revalidate = 3600;

/** Pre-render every published post at build time; new slugs render on demand. */
export async function generateStaticParams() {
  const { data } = await getPublishedPosts();
  return (data ?? []).map((post) => ({ slug: post.slug }));
}

async function loadPost(slug: string) {
  const { data, error } = await getPublishedPostBySlug(slug);
  // Outage → 500 (Google retries) instead of a cached 404; missing slug → 404.
  if (error) throw new Error(`Database unavailable while loading /blog/${slug}`);
  return data;
}

const absoluteUrl = (src: string) => (src.startsWith("/") ? new URL(src, siteConfig.url).toString() : src);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return { title: "Article not found" };

  const url = `/blog/${post.slug}`;
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const imageSrc = post.ogImage || post.coverImage;
  const images = imageSrc ? [{ url: absoluteUrl(imageSrc), width: 1200, height: 630, alt: post.title }] : [];

  return {
    title,
    description,
    keywords: post.tags.length > 0 ? post.tags : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      ...(post.publishedAt ? { publishedTime: formatIsoDate(post.publishedAt) } : {}),
      ...(post.updatedAt ? { modifiedTime: formatIsoDate(post.updatedAt) } : {}),
      authors: [post.author],
      section: post.category.name,
      tags: post.tags,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => i.url),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, all, settings] = await Promise.all([loadPost(slug), getPublishedPosts(), getSiteSettings()]);
  if (!post) notFound();

  const siblings = all.data ?? [];
  const related = siblings
    .filter((p) => p.id !== post.id && (p.categoryId === post.categoryId || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${siteConfig.url}/blog/${post.slug}#article`,
        headline: post.title,
        description: post.excerpt,
        url: `${siteConfig.url}/blog/${post.slug}`,
        ...(post.coverImage ? { image: absoluteUrl(post.coverImage) } : {}),
        ...(post.publishedAt ? { datePublished: formatIsoDate(post.publishedAt) } : {}),
        dateModified: formatIsoDate(post.updatedAt ?? post.publishedAt),
        articleSection: post.category.name,
        keywords: post.tags.join(", "),
        author: { "@type": "Person", name: post.author, url: siteConfig.url },
        publisher: { "@id": `${siteConfig.url}/#person` },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}/blog/${post.slug}` },
        timeRequired: `PT${post.readingTime}M`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/#blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: `${siteConfig.url}/blog/${post.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground">
        Skip to content
      </a>
      <Navbar ctaLabel={settings.cta.navLabel} name={settings.profile.name} />
      <main id="main" className="flex-1 pb-20 pt-24 md:pt-28">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

        <div className="container-x">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/#blog" className="transition-colors hover:text-foreground">
              Blog
            </Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">{post.title}</span>
          </nav>

          <article>
            <header className="mx-auto mt-10 max-w-3xl">
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
              <h1 className="mt-6 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-5xl">{post.title}</h1>
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

            <div className="mx-auto mt-10 max-w-3xl">
              <Markdown content={post.content} />
              {post.tags.length > 0 && (
                <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8" aria-label="Article tags">
                  {post.tags.map((tag) => (
                    <Badge key={tag}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="mt-10">
                <Link
                  href="/#blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Back to all articles
                </Link>
              </div>
            </div>
          </article>

          {related.length > 0 && (
            <section aria-labelledby="related-heading" className="mx-auto mt-20 max-w-5xl">
              <h2 id="related-heading" className="font-display text-2xl font-semibold tracking-tight">
                Keep reading
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/blog/${item.slug}`}
                    className="group rounded-2xl border border-border p-6 transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.category.name}</p>
                    <p className="mt-3 font-display text-lg font-semibold leading-snug tracking-tight group-hover:underline group-hover:underline-offset-4">
                      {item.title}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer profile={settings.profile} social={settings.social} />
    </>
  );
}

