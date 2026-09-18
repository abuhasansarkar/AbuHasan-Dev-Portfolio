import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteProject } from "@/app/actions/admin/projects";
import { DeleteForm } from "@/components/admin/delete-form";
import { DataTable, Td, Th } from "@/components/admin/data-table";
import { Flash } from "@/components/admin/flash";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });

  return (
    <>
      <Suspense>
        <Flash />
      </Suspense>
      <PageHeader
        title="Projects"
        description={`${projects.length} project${projects.length === 1 ? "" : "s"} in the portfolio.`}
        actions={
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus aria-hidden />
              New project
            </Link>
          </Button>
        }
      />

      {projects.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No projects yet.</p>
      ) : (
        <DataTable>
          <thead>
            <tr>
              <Th>Project</Th>
              <Th>Industry</Th>
              <Th>Status</Th>
              <Th className="text-right">Order</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-secondary/50">
                <Td>
                  <div className="flex items-center gap-3">
                    <span className="relative h-10 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                      <Image src={p.coverImage} alt="" fill sizes="64px" className="object-cover object-top" />
                    </span>
                    <div>
                      <Link href={`/admin/projects/${p.id}`} className="font-medium hover:underline">
                        {p.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">/{p.slug}</p>
                    </div>
                  </div>
                </Td>
                <Td className="text-muted-foreground">{p.industry}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant={p.published ? "success" : "outline"}>{p.published ? "Published" : "Hidden"}</Badge>
                    {p.featured && <Badge variant="accent">Featured</Badge>}
                    {p.isDemo && <Badge variant="outline">Demo</Badge>}
                  </div>
                </Td>
                <Td className="text-right tabular-nums">{p.sortOrder}</Td>
                <Td>
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${p.title}`}>
                      <Link href={`/admin/projects/${p.id}`}>
                        <Pencil />
                      </Link>
                    </Button>
                    <DeleteForm
                      action={deleteProject}
                      id={p.id}
                      ariaLabel={`Delete ${p.title}`}
                      confirmText={`Delete "${p.title}"? This cannot be undone.`}
                    >
                      <Trash2 />
                    </DeleteForm>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      )}
    </>
  );
}
