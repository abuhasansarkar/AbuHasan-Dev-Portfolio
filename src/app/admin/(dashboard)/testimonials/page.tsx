import Link from "next/link";
import { Suspense } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteTestimonial } from "@/app/actions/admin/testimonials";
import { DeleteForm } from "@/components/admin/delete-form";
import { DataTable, Td, Th } from "@/components/admin/data-table";
import { Flash } from "@/components/admin/flash";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { truncate } from "@/lib/utils";

export default async function TestimonialsPage() {
  const items = await prisma.testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });

  return (
    <>
      <Suspense>
        <Flash />
      </Suspense>
      <PageHeader
        title="Testimonials"
        description="Quotes shown in the carousel. Demo entries are labelled as placeholders on the site."
        actions={
          <Button asChild>
            <Link href="/admin/testimonials/new">
              <Plus aria-hidden />
              New testimonial
            </Link>
          </Button>
        }
      />
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No testimonials yet.</p>
      ) : (
        <DataTable>
          <thead>
            <tr>
              <Th>Person</Th>
              <Th>Quote</Th>
              <Th>Status</Th>
              <Th className="text-right">Order</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="hover:bg-secondary/50">
                <Td>
                  <Link href={`/admin/testimonials/${t.id}`} className="font-medium hover:underline">
                    {t.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {t.role}, {t.company}
                  </p>
                </Td>
                <Td className="max-w-md text-muted-foreground">{truncate(t.quote, 110)}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant={t.featured ? "success" : "outline"}>{t.featured ? "Visible" : "Hidden"}</Badge>
                    {t.isDemo && <Badge variant="outline">Demo</Badge>}
                  </div>
                </Td>
                <Td className="text-right tabular-nums">{t.sortOrder}</Td>
                <Td>
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit testimonial from ${t.name}`}>
                      <Link href={`/admin/testimonials/${t.id}`}>
                        <Pencil />
                      </Link>
                    </Button>
                    <DeleteForm action={deleteTestimonial} id={t.id} ariaLabel={`Delete testimonial from ${t.name}`} confirmText={`Delete the testimonial from ${t.name}?`}>
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
