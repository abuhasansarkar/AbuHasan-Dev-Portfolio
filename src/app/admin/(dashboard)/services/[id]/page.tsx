import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ServiceForm } from "@/components/admin/service-form";
import { prisma } from "@/lib/db";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();
  return (
    <>
      <PageHeader title={service.title} />
      <ServiceForm service={service} />
    </>
  );
}
