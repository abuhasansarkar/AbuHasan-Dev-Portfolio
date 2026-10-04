import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { projects } from "./seed-data/projects";
import { categories, posts } from "./seed-data/posts";
import { services } from "./seed-data/services";
import { testimonials } from "./seed-data/testimonials";
import { siteSettings } from "./seed-data/settings";

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.com").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "ChangeThisImmediately123!";
  const name = process.env.ADMIN_NAME?.trim() || "AbuHasan";

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`✓ Admin exists (${email})`);
    return;
  }
  await prisma.admin.create({
    data: { email, name, passwordHash: await bcrypt.hash(password, 12) },
  });
  console.log(`✓ Admin created (${email}) – DEMO credentials, change before production`);
}

async function seedSettings() {
  for (const [key, value] of Object.entries(siteSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value: value as Prisma.InputJsonValue },
    });
  }
  console.log(`✓ Site settings (${Object.keys(siteSettings).length} keys)`);
}

async function seedServices() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }
  console.log(`✓ Services (${services.length})`);
}

async function seedBlog() {
  for (const category of categories) {
    await prisma.blogCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log(`✓ Blog categories (${categories.length})`);

  for (const post of posts) {
    const { categorySlug, ...data } = post;
    await prisma.blogPost.upsert({
      where: { slug: data.slug },
      update: {},
      create: { ...data, category: { connect: { slug: categorySlug } } },
    });
  }
  console.log(`✓ Blog posts (${posts.length})`);
}

async function seedProjects() {
  for (const project of projects) {
    const { images, ...data } = project;
    const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
    if (existing) continue;
    await prisma.project.create({
      data: {
        ...data,
        images: { create: images.map((img, i) => ({ ...img, sortOrder: i })) },
      },
    });
  }
  console.log(`✓ Projects (${projects.length})`);
}

async function seedTestimonials() {
  const count = await prisma.testimonial.count();
  if (count > 0) {
    console.log("✓ Testimonials exist – skipped");
    return;
  }
  await prisma.testimonial.createMany({ data: testimonials });
  console.log(`✓ Testimonials (${testimonials.length}, all flagged isDemo)`);
}

async function main() {
  console.log("Seeding database…");
  await seedAdmin();
  await seedSettings();
  await seedServices();
  await seedBlog();
  await seedProjects();
  await seedTestimonials();
  console.log("Done. Run `npm run db:reset` for a clean re-seed.");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
