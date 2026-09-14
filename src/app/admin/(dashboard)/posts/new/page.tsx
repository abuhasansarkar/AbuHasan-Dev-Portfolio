import { PageHeader } from "@/components/admin/page-header";
import { PostForm } from "@/components/admin/post-form";
import { prisma } from "@/lib/db";

export default async function NewPostPage() {
  const categories = await prisma.blogCategory.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <PageHeader title="New post" description="Write in Markdown. Save as draft or publish immediately." />
      <PostForm categories={categories} />
    </>
  );
}
