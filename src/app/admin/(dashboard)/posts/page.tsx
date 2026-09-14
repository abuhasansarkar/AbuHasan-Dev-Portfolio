import Link from "next/link";
import { Suspense } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { deleteCategory, deletePost } from "@/app/actions/admin/posts";
import { CategoryForm } from "@/components/admin/category-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { DataTable, Td, Th } from "@/components/admin/data-table";
import { Flash } from "@/components/admin/flash";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function PostsPage() {
  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({ include: { category: true }, orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }] }),
    prisma.blogCategory.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { posts: true } } } }),
  ]);

  return (
    <>
      <Suspense>
        <Flash />
      </Suspense>
      <PageHeader
        title="Blog posts"
        description={`${posts.filter((p) => p.status === "PUBLISHED").length} published, ${posts.filter((p) => p.status === "DRAFT").length} draft.`}
        actions={
          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus aria-hidden />
              New post
            </Link>
          </Button>
        }
      />

      {posts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No posts yet.</p>
      ) : (
        <DataTable>
          <thead>
            <tr>
              <Th>Title</Th>
              <Th>Category</Th>
              <Th>Status</Th>
              <Th>Published</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-secondary/50">
                <Td>
                  <Link href={`/admin/posts/${p.id}`} className="font-medium hover:underline">
                    {p.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    /{p.slug} · {p.readingTime} min
                  </p>
                </Td>
                <Td className="text-muted-foreground">{p.category.name}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant={p.status === "PUBLISHED" ? "success" : "outline"}>{p.status === "PUBLISHED" ? "Published" : "Draft"}</Badge>
                    {p.featured && <Badge variant="accent">Featured</Badge>}
                    {p.isDemo && <Badge variant="outline">Demo</Badge>}
                  </div>
                </Td>
                <Td className="whitespace-nowrap text-muted-foreground">{formatDate(p.publishedAt) || "—"}</Td>
                <Td>
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${p.title}`}>
                      <Link href={`/admin/posts/${p.id}`}>
                        <Pencil />
                      </Link>
                    </Button>
                    <form action={deletePost}>
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmButton variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" aria-label={`Delete ${p.title}`} confirmText={`Delete "${p.title}"?`}>
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

      <section className="mt-12 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold tracking-tight">Categories</h2>
        <p className="mt-1 text-sm text-muted-foreground">Categories power the filter on the public blog. A category can only be removed when no posts use it.</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center gap-1 rounded-full border border-border pl-3 pr-1 text-sm">
              {c.name} <span className="text-xs text-muted-foreground tabular-nums">({c._count.posts})</span>
              {c._count.posts === 0 && (
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <ConfirmButton variant="ghost" size="icon-sm" className="size-7 text-muted-foreground hover:text-destructive" aria-label={`Delete category ${c.name}`} confirmText={`Delete category "${c.name}"?`}>
                    <X className="size-3.5" />
                  </ConfirmButton>
                </form>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <CategoryForm />
        </div>
      </section>
    </>
  );
}
