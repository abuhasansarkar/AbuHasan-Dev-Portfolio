import Link from "next/link";
import { Suspense } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteService } from "@/app/actions/admin/services";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { DataTable, Td, Th } from "@/components/admin/data-table";
import { Flash } from "@/components/admin/flash";
import { PageHeader } from "@/components/admin/page-header";
import { ServiceIcon } from "@/components/services/service-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <Suspense>
        <Flash />
      </Suspense>
      <PageHeader
        title="Services"
        description="Cards in the Services section. Inactive services are hidden from the site."
        actions={
          <Button asChild>
            <Link href="/admin/services/new">
              <Plus aria-hidden />
              New service
            </Link>
          </Button>
        }
      />
      {services.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No services yet.</p>
      ) : (
        <DataTable>
          <thead>
            <tr>
              <Th className="text-right">#</Th>
              <Th>Service</Th>
              <Th>Description</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-secondary/50">
                <Td className="text-right tabular-nums text-muted-foreground">{s.sortOrder}</Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full border border-border">
                      <ServiceIcon name={s.icon} className="size-4" />
                    </span>
                    <Link href={`/admin/services/${s.id}`} className="font-medium hover:underline">
                      {s.title}
                    </Link>
                  </div>
                </Td>
                <Td className="max-w-md text-muted-foreground">{s.description}</Td>
                <Td>
                  <Badge variant={s.active ? "success" : "outline"}>{s.active ? "Active" : "Inactive"}</Badge>
                </Td>
                <Td>
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${s.title}`}>
                      <Link href={`/admin/services/${s.id}`}>
                        <Pencil />
                      </Link>
                    </Button>
                    <form action={deleteService}>
                      <input type="hidden" name="id" value={s.id} />
                      <ConfirmButton variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" aria-label={`Delete ${s.title}`} confirmText={`Delete "${s.title}"?`}>
                        <Trash2 />
                      </ConfirmButton>
                    </form>
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
