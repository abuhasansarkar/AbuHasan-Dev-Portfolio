import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <>
      <PageHeader title="New project" description="Add a project to Selected Work with a full case study." />
      <ProjectForm />
    </>
  );
}
