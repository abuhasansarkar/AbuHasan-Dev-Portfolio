import { prisma } from "@/lib/db";

async function main() {
  const projects = await prisma.project.findMany();
  console.log("Projects:", projects);
  
  const publishedProjects = await prisma.project.findMany({ where: { published: true } });
  console.log("Published Projects:", publishedProjects);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });