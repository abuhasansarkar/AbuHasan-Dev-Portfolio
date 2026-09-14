import type { ProjectWithImages } from "@/lib/data/projects";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { EmptyState } from "@/components/layout/empty-state";
import { WorkGrid } from "./work-grid";

export function Work({ projects, error }: { projects: ProjectWithImages[]; error?: boolean }) {
  return (
    <Section id="work" aria-labelledby="work-title" className="border-t border-border/70">
      <div className="container-x">
        <SectionHeading
          id="work-title"
          number="04"
          eyebrow="Selected Work"
          title="Websites built to look better, perform better, and convert better."
          highlight={["convert"]}
          description="A selection of recent projects across service businesses, education, health and technology. Open any project for the full case study."
        />
        {projects.length === 0 ? (
          <EmptyState className="mt-14" title={error ? "Projects are temporarily unavailable" : "No projects published yet"} description={error ? "The database could not be reached. Please refresh in a moment." : "Publish projects from the admin dashboard to show them here."} />
        ) : (
          <WorkGrid projects={projects} />
        )}
      </div>
    </Section>
  );
}
