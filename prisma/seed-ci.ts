/**
 * CI-only fixtures.
 *
 * The production seed contains no projects/posts (all content is authored from /admin), so on a
 * freshly seeded database `generateStaticParams()` returns an empty list and the build never
 * prerenders `/work/[slug]` or `/blog/[slug]`. That is exactly how a `Date`-serialization build
 * failure slipped past CI previously. This script guarantees at least one published project and
 * one published post exist so the SSG detail routes are exercised by `next build`.
 *
 * Idempotent and only ever run by CI — never against a real database.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.blogCategory.upsert({
    where: { slug: "ci-fixture" },
    update: {},
    create: { slug: "ci-fixture", name: "CI Fixture", description: "Build-time fixture category.", sortOrder: 0 },
  });

  const body = "Build-time fixture used by CI to exercise the detail route.";

  await prisma.project.upsert({
    where: { slug: "ci-fixture-project" },
    update: {},
    create: {
      slug: "ci-fixture-project",
      title: "CI Fixture Project",
      client: "CI",
      industry: "Testing",
      category: "Fixture",
      excerpt: body,
      description: body,
      challenge: body,
      strategy: body,
      solution: body,
      results: body,
      coverImage: "/demo/avatar.svg",
      published: true,
      isDemo: true,
      sortOrder: 0,
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "ci-fixture-post" },
    update: {},
    create: {
      slug: "ci-fixture-post",
      title: "CI Fixture Post",
      excerpt: body,
      content: `# CI Fixture\n\n${body}`,
      categoryId: category.id,
      publishedAt: new Date("2024-01-01T00:00:00.000Z"),
      status: "PUBLISHED",
      isDemo: true,
    },
  });

  console.log("✓ CI fixtures ready (1 project + 1 post)");
}

main()
  .catch((err) => {
    console.error("CI fixture seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
