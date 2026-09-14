import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, include: { images: { orderBy: { sortOrder: "asc" } } } });
  if (!project) notFound();

  return (
    <>
      <PageHeader
        title={project.title}
        description={`Editing /${project.slug}`}
        actions={
          <Button asChild variant="outline" size="sm">
            <a href={`/#project=${project.slug}`} target="_blank" rel="noopener">
              Preview on site
            </a>
          </Button>
        }
      />
      <ProjectForm project={project} />
    </>
  );
}
