import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { PostForm } from "@/components/admin/post-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([prisma.blogPost.findUnique({ where: { id }, include: { category: true } }), prisma.blogCategory.findMany({ orderBy: { sortOrder: "asc" } })]);
  if (!post) notFound();

  return (
    <>
      <PageHeader
        title={post.title}
        description={`Editing /${post.slug}`}
        actions={
          post.status === "PUBLISHED" ? (
            <Button asChild variant="outline" size="sm">
              <a href={`/#post=${post.slug}`} target="_blank" rel="noopener">
                Preview on site
              </a>
            </Button>
          ) : undefined
        }
      />
      <PostForm post={post} categories={categories} />
    </>
  );
}
