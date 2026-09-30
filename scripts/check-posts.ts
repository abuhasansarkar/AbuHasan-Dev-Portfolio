import { prisma } from "@/lib/db";

async function main() {
  const posts = await prisma.blogPost.findMany();
  console.log("Blog Posts:", posts);
  
  const publishedPosts = await prisma.blogPost.findMany({ where: { status: "PUBLISHED" } });
  console.log("Published Blog Posts:", publishedPosts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });