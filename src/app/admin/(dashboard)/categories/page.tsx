import Link from "next/link";
import { Suspense } from "react";
import { Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { deleteCategory } from "@/app/actions/admin/categories";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { DataTable, Td, Th } from "@/components/admin/data-table";
import { Flash } from "@/components/admin/flash";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export const metadata = { title: "Blog Categories" };

export default async function CategoriesPage() {
  const categories = await prisma.blogCategory.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <Suspense>
        <Flash />
      </Suspense>
      <PageHeader
        title="Blog Categories"
        description="Organize your blog posts into categories. A category slug is set on creation and cannot be changed."
        actions={
          <Button asChild>
            <Link href="/admin/categories/new">
              <Plus aria-hidden />
              New category
            </Link>
          </Button>
        }
      />

      {categories.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border p-16 text-center">
          <Tag className="size-8 text-muted-foreground/40" />
          <div>
            <p className="font-medium">No categories yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first category to start organizing blog posts.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/categories/new">
              <Plus aria-hidden />
              New category
            </Link>
          </Button>
        </div>
      ) : (
        <DataTable>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Slug</Th>
              <Th>Description</Th>
              <Th className="text-right">Posts</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-secondary/50">
                <Td>
                  <Link href={`/admin/categories/${cat.id}`} className="font-medium hover:underline">
                    {cat.name}
                  </Link>
                </Td>
                <Td>
                  <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">{cat.slug}</code>
                </Td>
                <Td className="max-w-xs text-muted-foreground text-sm">
                  {cat.description ?? <span className="italic opacity-50">No description</span>}
                </Td>
                <Td className="text-right tabular-nums">{cat._count.posts}</Td>
                <Td>
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${cat.name}`}>
                      <Link href={`/admin/categories/${cat.id}`}>
                        <Pencil />
                      </Link>
                    </Button>
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={cat.id} />
                      <ConfirmButton
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Delete ${cat.name}`}
                        confirmText={
                          cat._count.posts > 0
                            ? `"${cat.name}" has ${cat._count.posts} post(s). Deleting it will remove those posts' category. Continue?`
                            : `Delete category "${cat.name}"?`
                        }
                      >
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
