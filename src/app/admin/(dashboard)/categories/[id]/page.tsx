import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { saveCategory, deleteCategory } from "@/app/actions/admin/categories";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Flash } from "@/components/admin/flash";
import { FormField, FormSection } from "@/components/admin/form-field";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/db";

export const metadata = { title: "Edit Category" };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.blogCategory.findUnique({
    where: { id },
    include: { _count: { select: { posts: true } } },
  });
  if (!category) notFound();

  return (
    <>
      <Suspense>
        <Flash />
      </Suspense>
      <div className="mb-6">
        <Link href="/admin/categories" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden />
          Back to categories
        </Link>
      </div>

      <PageHeader
        title={`Edit: ${category.name}`}
        description={`${category._count.posts} post(s) in this category.`}
      />

      <form action={saveCategory} className="mt-6 flex flex-col gap-6">
        <input type="hidden" name="id" value={category.id} />
        <FormSection title="Category Details">
          <FormField label="Name" name="name">
            <Input id="name" name="name" defaultValue={category.name} required />
          </FormField>
          <FormField label="Slug" name="slug" hint="The slug is set at creation and cannot be changed.">
            <Input id="slug" name="slug" value={category.slug} disabled className="opacity-60" />
          </FormField>
          <FormField label="Description" name="description" hint="Optional. Shown on the category page.">
            <Textarea
              id="description"
              name="description"
              defaultValue={category.description ?? ""}
              rows={3}
            />
          </FormField>
        </FormSection>

        <div className="flex items-center justify-between gap-3">
          <form action={deleteCategory}>
            <input type="hidden" name="id" value={category.id} />
            <ConfirmButton
              variant="destructive"
              size="sm"
              confirmText={
                category._count.posts > 0
                  ? `"${category.name}" has ${category._count.posts} post(s). Delete anyway?`
                  : `Delete category "${category.name}"?`
              }
            >
              Delete category
            </ConfirmButton>
          </form>
          <div className="flex gap-3">
            <Link href="/admin/categories" className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground hover:text-foreground">
              Cancel
            </Link>
            <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
          </div>
        </div>
      </form>
    </>
  );
}
