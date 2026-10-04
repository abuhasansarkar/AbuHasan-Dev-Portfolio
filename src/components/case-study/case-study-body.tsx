import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { BrowserFrame } from "@/components/portfolio/browser-frame";
import { BlockRenderer } from "@/components/content/block-renderer";
import type { ProjectWithImages } from "@/lib/data/projects";
import type { ContentBlock } from "@/types/content-blocks";

function Paragraphs({ text }: { text: string }) {
  if (!text) return null;
  const trimmed = text.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.type) {
        return <BlockRenderer blocks={parsed as ContentBlock[]} />;
      }
    } catch {
      // fallback to plain paragraphs
    }
  }

  return (
    <div className="flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
      {text
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((p, i) => (
          <p key={i}>{p}</p>
        ))}
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4 border-t border-border py-10 md:grid-cols-12">
      <h3 className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground md:col-span-3">{label}</h3>
      <div className="md:col-span-8 md:col-start-5">{children}</div>
    </div>
  );
}

/**
 * The full case-study body (hero image → facts → section blocks → services).
 * Shared by the home-page overlay and the crawlable `/work/[slug]` route so the
 * two views can never drift apart.
 */
export function CaseStudyBody({ project }: { project: ProjectWithImages }) {
  return (
    <>
      {/* Hero image */}
      <div className="mt-12 rounded-2xl border border-border bg-secondary/40 p-3 sm:p-6 lg:p-10">
        <BrowserFrame url={project.projectUrl || `${project.slug}.com`} accent={project.accentColor}>
          <div className="relative aspect-[16/9] w-full bg-background">
            <Image src={project.coverImage} alt={`${project.title} website preview`} fill sizes="100vw" className="object-cover object-top" loading="lazy" />
          </div>
        </BrowserFrame>
      </div>

      {/* Overview facts */}
      <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-8 md:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Client</dt>
          <dd className="mt-2 font-medium">{project.client}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Business type</dt>
          <dd className="mt-2 font-medium">{project.industry}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Scope</dt>
          <dd className="mt-2 font-medium">{project.category}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Year</dt>
          <dd className="mt-2 font-medium">{project.year ?? "—"}</dd>
        </div>
      </dl>

      <div className="mt-8">
        <Block label="Overview">
          <Paragraphs text={project.description} />
        </Block>
        <Block label="Challenge">
          <Paragraphs text={project.challenge} />
        </Block>
        <Block label="Strategy">
          <Paragraphs text={project.strategy} />
        </Block>
        <Block label="Solution">
          <Paragraphs text={project.solution} />
        </Block>
        {project.keyImprovements.length > 0 && (
          <Block label="Key improvements">
            <ul className="grid gap-3 sm:grid-cols-2">
              {project.keyImprovements.map((item) => (
                <li key={item} className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-snug">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Block>
        )}
        <Block label="Technologies">
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <Badge key={t} className="px-3 py-1 text-sm">
                {t}
              </Badge>
            ))}
          </div>
        </Block>
        {project.images.length > 0 && (
          <Block label="Screenshots">
            <div className="grid gap-6">
              {project.images.map((img) => (
                <figure key={img.id}>
                  <BrowserFrame url={project.projectUrl || `${project.slug}.com`} accent={project.accentColor}>
                    <div className="relative aspect-[16/10] w-full bg-background">
                      <Image src={img.url} alt={img.alt} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover object-top" />
                    </div>
                  </BrowserFrame>
                  {img.caption && <figcaption className="mt-3 text-sm text-muted-foreground">{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </Block>
        )}
        <Block label="Result">
          <Paragraphs text={project.results} />
        </Block>
        <Block label="Services delivered">
          <ul className="flex flex-wrap gap-2">
            {project.services.map((s) => (
              <li key={s}>
                <Badge variant="accent" className="px-3 py-1 text-sm">
                  {s}
                </Badge>
              </li>
            ))}
          </ul>
        </Block>
      </div>
    </>
  );
}