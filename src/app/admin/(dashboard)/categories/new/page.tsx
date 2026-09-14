import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { saveCategory } from "@/app/actions/admin/categories";
import { FormField, FormSection } from "@/components/admin/form-field";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata = { title: "New Category" };

export default function NewCategoryPage() {
  return (
    <>
      <div className="mb-6">
        <Link href="/admin/categories" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden />
          Back to categories
        </Link>
      </div>

      <PageHeader title="New Category" description="Categories are used to organize blog posts." />

      <form action={saveCategory} className="mt-6 flex flex-col gap-6">
        <FormSection title="Category Details">
          <FormField label="Name" name="name" hint="Displayed on the blog and in filters.">
            <Input id="name" name="name" placeholder="e.g. WordPress" required />
          </FormField>
          <FormField label="Description" name="description" hint="Optional. Shown on the category page.">
            <Textarea id="description" name="description" placeholder="A short description of this category…" rows={3} />
          </FormField>
        </FormSection>

        <div className="flex justify-end gap-3">
          <Link href="/admin/categories" className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground hover:text-foreground">
            Cancel
          </Link>
          <SubmitButton pendingLabel="Saving…">Create category</SubmitButton>
        </div>
      </form>
    </>
  );
}
