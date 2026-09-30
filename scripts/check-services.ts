import { prisma } from "@/lib/db";

async function main() {
  const services = await prisma.service.findMany();
  console.log("Services:", services);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });