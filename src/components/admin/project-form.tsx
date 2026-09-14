"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveProject } from "@/app/actions/admin/projects";
import { BlockEditor } from "@/components/admin/block-editor";
import { Checkbox, FormError, FormField, FormSection } from "@/components/admin/form-field";
import { ImageInput } from "@/components/admin/image-input";
import { SubmitButton } from "@/components/admin/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initialActionState } from "@/lib/admin/action-state";
import type { ProjectWithImages } from "@/lib/data/projects";

export function ProjectForm({ project }: { project?: ProjectWithImages }) {
  const [state, action] = useActionState(saveProject, initialActionState);
  const e = state.fieldErrors ?? {};
  const imagesText = project?.images.map((i) => [i.url, i.alt, i.caption ?? ""].filter((_, idx) => idx < 2 || i.caption).join(" | ")).join("\n") ?? "";

  return (
    <form action={action} className="flex flex-col gap-6">
      {project && <input type="hidden" name="id" value={project.id} />}

      <FormSection title="Basics" description="How the project appears in the Selected Work grid.">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Title" name="title" error={e.title}>
            <Input id="title" name="title" defaultValue={project?.title} required />
          </FormField>
          <FormField label="Slug" name="slug" error={e.slug} hint="Leave empty to generate from the title.">
            <Input id="slug" name="slug" defaultValue={project?.slug} placeholder="my-project" />
          </FormField>
          <FormField label="Client" name="client" error={e.client}>
            <Input id="client" name="client" defaultValue={project?.client} required />
          </FormField>
          <FormField label="Industry" name="industry" error={e.industry}>
            <Input id="industry" name="industry" defaultValue={project?.industry} required />
          </FormField>
          <FormField label="Category / scope" name="category" error={e.category}>
            <Input id="category" name="category" defaultValue={project?.category} placeholder="Website Design & Development" required />
          </FormField>
          <FormField label="Year" name="year" error={e.year}>
            <Input id="year" name="year" type="number" min={2000} max={2100} defaultValue={project?.year ?? ""} />
          </FormField>
        </div>
        <FormField label="Excerpt" name="excerpt" error={e.excerpt} hint="One or two sentences shown on the card.">
          <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={project?.excerpt} required />
        </FormField>
        <FormField label="Cover image" name="coverImage" error={e.coverImage}>
          <ImageInput name="coverImage" defaultValue={project?.coverImage} required />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Accent color" name="accentColor" error={e.accentColor} hint="Hex, used for hover glow.">
            <Input id="accentColor" name="accentColor" defaultValue={project?.accentColor ?? ""} placeholder="#f97316" />
          </FormField>
          <FormField label="Live URL" name="projectUrl" error={e.projectUrl}>
            <Input id="projectUrl" name="projectUrl" type="url" defaultValue={project?.projectUrl ?? ""} placeholder="https://" />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Case study" description="Shown in the full-screen project view. Separate paragraphs with a blank line.">
        <FormField label="Overview" name="description" error={e.description}>
          <Textarea id="description" name="description" rows={4} defaultValue={project?.description} required />
        </FormField>
        <FormField label="Challenge" name="challenge" error={e.challenge}>
          <Textarea id="challenge" name="challenge" rows={4} defaultValue={project?.challenge} required />
        </FormField>
        <FormField label="Strategy" name="strategy" error={e.strategy}>
          <Textarea id="strategy" name="strategy" rows={4} defaultValue={project?.strategy} required />
        </FormField>
        <FormField
          label="Solution & Architecture Blocks"
          name="solution"
          error={e.solution}
          hint="Add formatted text (p, span, h1-h6), project demo videos (YouTube/Vimeo), architecture code snippets, images, or links."
        >
          <BlockEditor name="solution" defaultValue={project?.solution} />
        </FormField>
        <FormField label="Result" name="results" error={e.results}>
          <Textarea id="results" name="results" rows={4} defaultValue={project?.results} required />
        </FormField>
        <FormField label="Key improvements" name="keyImprovements" error={e.keyImprovements} hint="One per line.">
          <Textarea id="keyImprovements" name="keyImprovements" rows={4} defaultValue={project?.keyImprovements.join("\n")} />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Technologies" name="technologies" error={e.technologies} hint="Comma separated.">
            <Input id="technologies" name="technologies" defaultValue={project?.technologies.join(", ")} />
          </FormField>
          <FormField label="Services delivered" name="services" error={e.services} hint="Comma separated.">
            <Input id="services" name="services" defaultValue={project?.services.join(", ")} />
          </FormField>
        </div>
        <FormField label="Screenshots" name="images" error={e.images ?? Object.entries(e).find(([k]) => k.startsWith("images."))?.[1]} hint="One per line: image URL | alt text | optional caption">
          <Textarea id="images" name="images" rows={4} defaultValue={imagesText} className="font-mono text-xs" />
        </FormField>
      </FormSection>

      <FormSection title="Visibility">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Sort order" name="sortOrder" error={e.sortOrder} hint="Lower numbers appear first.">
            <Input id="sortOrder" name="sortOrder" type="number" min={0} defaultValue={project?.sortOrder ?? 0} />
          </FormField>
        </div>
        <div className="flex flex-wrap gap-6">
          <FormField label="Published" name="published" inline>
            <Checkbox id="published" name="published" defaultChecked={project?.published ?? true} />
          </FormField>
          <FormField label="Featured" name="featured" inline>
            <Checkbox id="featured" name="featured" defaultChecked={project?.featured ?? false} />
          </FormField>
          <FormField label="Demo content" name="isDemo" inline>
            <Checkbox id="isDemo" name="isDemo" defaultChecked={project?.isDemo ?? false} />
          </FormField>
        </div>
      </FormSection>

      <FormError message={state.error} />

      <div className="flex items-center justify-end gap-3">
        <Button asChild variant="ghost">
          <Link href="/admin/projects">Cancel</Link>
        </Button>
        <SubmitButton pendingLabel="Saving…">{project ? "Save changes" : "Create project"}</SubmitButton>
      </div>
    </form>
  );
}
