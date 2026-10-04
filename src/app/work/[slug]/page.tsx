import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { CaseStudyBody } from "@/components/case-study/case-study-body";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublishedProjectBySlug, getPublishedProjects } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/settings/get-settings";
import { siteConfig } from "@/lib/site";
import { formatIsoDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

/** Fresh data at most hourly; admin publishes already revalidate the tags. */
export const revalidate = 3600;

/** Pre-render every published project at build time; new slugs render on demand. */
export async function generateStaticParams() {
  const { data } = await getPublishedProjects();
  return (data ?? []).map((project) => ({ slug: project.slug }));
}

async function loadProject(slug: string) {
  const { data, error } = await getPublishedProjectBySlug(slug);
  // Distinguish an outage (→ 500 via error boundary, Google retries) from a
  // genuinely missing slug (→ 404). A cached 404 during an outage would be
  // disastrous for SEO.
  if (error) throw new Error(`Database unavailable while loading /work/${slug}`);
  return data;
}

const absoluteUrl = (src: string) => (src.startsWith("/") ? new URL(src, siteConfig.url).toString() : src);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) return { title: "Project not found" };

  const url = `/work/${project.slug}`;
  const title = `${project.title} — Case Study`;
  const description = project.excerpt || siteConfig.description;
  const images = [{ url: absoluteUrl(project.coverImage), width: 1200, height: 630, alt: `${project.title} website preview` }];

  return {
    title,
    description,
    keywords: [project.category, project.industry, ...project.technologies],
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, siteName: siteConfig.name, locale: siteConfig.locale, images },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
  };
}

export default async function WorkProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, all, settings] = await Promise.all([loadProject(slug), getPublishedProjects(), getSiteSettings()]);
  if (!project) notFound();

  const siblings = all.data ?? [];
  const position = siblings.findIndex((p) => p.slug === project.slug);
  const previous = position > 0 ? siblings[position - 1] : null;
  const next = position >= 0 && position < siblings.length - 1 ? siblings[position + 1] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${siteConfig.url}/work/${project.slug}#project`,
        name: project.title,
        description: project.excerpt,
        url: `${siteConfig.url}/work/${project.slug}`,
        image: absoluteUrl(project.coverImage),
        genre: project.category,
        keywords: project.technologies.join(", "),
        author: { "@id": `${siteConfig.url}/#person` },
        dateModified: formatIsoDate(project.updatedAt),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Work", item: `${siteConfig.url}/#work` },
          { "@type": "ListItem", position: 3, name: project.title, item: `${siteConfig.url}/work/${project.slug}` },
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
            <Link href="/#work" className="transition-colors hover:text-foreground">
              Work
            </Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">{project.title}</span>
          </nav>

          {/* Header */}
          <header className="mt-10 grid gap-8 lg:grid-cols-12">
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
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-6xl">{project.title}</h1>
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
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- native anchor so the Lenis smooth-scroll provider can intercept it on `/` and crawlers/no-JS get a plain link */}
                <a href="/#contact">Start a similar project</a>
              </Button>
            </div>
          </header>

          <CaseStudyBody project={project} />

          {/* Prev / next project */}
          <nav aria-label="More projects" className="mt-6 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
            {previous ? (
              <Link href={`/work/${previous.slug}`} className="group flex items-center gap-4 rounded-2xl border border-border p-6 text-left transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border transition-colors group-hover:border-accent group-hover:text-accent">
                  <ArrowLeft className="size-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">Previous project</span>
                  <span className="mt-1 block truncate font-display text-lg font-semibold tracking-tight">{previous.title}</span>
                </span>
              </Link>
            ) : (
              <span aria-hidden />
            )}
            {next && (
              <Link href={`/work/${next.slug}`} className="group flex items-center gap-4 rounded-2xl border border-border p-6 text-left transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row-reverse sm:text-right">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border transition-colors group-hover:border-accent group-hover:text-accent">
                  <ArrowRight className="size-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">Next project</span>
                  <span className="mt-1 block truncate font-display text-lg font-semibold tracking-tight">{next.title}</span>
                </span>
              </Link>
            )}
          </nav>

          <div className="mt-10">
            <Button asChild variant="ghost">
              <Link href="/#work">
                <ArrowLeft aria-hidden />
                Back to all projects
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer profile={settings.profile} social={settings.social} />
    </>
  );
}
