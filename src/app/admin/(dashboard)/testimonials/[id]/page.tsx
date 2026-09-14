import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { prisma } from "@/lib/db";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();
  return (
    <>
      <PageHeader title={`Testimonial from ${testimonial.name}`} />
      <TestimonialForm testimonial={testimonial} />
    </>
  );
}
