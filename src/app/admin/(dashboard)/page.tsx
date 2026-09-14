import Link from "next/link";
import { ArrowUpRight, TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Td, Th } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function AdminDashboard() {
  const [projects, posts, drafts, testimonials, services, submissions, newSubmissions, demoProjects, demoPosts, demoTestimonials, recent] = await Promise.all([
    prisma.project.count(),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.blogPost.count({ where: { status: "DRAFT" } }),
    prisma.testimonial.count(),
    prisma.service.count({ where: { active: true } }),
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
    prisma.project.count({ where: { isDemo: true } }),
    prisma.blogPost.count({ where: { isDemo: true } }),
    prisma.testimonial.count({ where: { isDemo: true } }),
    prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const cards = [
    { label: "Projects", value: projects, href: "/admin/projects" },
    { label: "Published posts", value: posts, href: "/admin/posts", note: drafts ? `${drafts} draft${drafts > 1 ? "s" : ""}` : undefined },
    { label: "Testimonials", value: testimonials, href: "/admin/testimonials" },
    { label: "Active services", value: services, href: "/admin/services" },
    { label: "Submissions", value: submissions, href: "/admin/submissions", note: newSubmissions ? `${newSubmissions} new` : undefined },
  ];

  const demoTotal = demoProjects + demoPosts + demoTestimonials;

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your portfolio content and incoming leads." />

      {demoTotal > 0 && (
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-5 text-sm">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <p>
            <span className="font-medium">Demo content is live.</span> {demoProjects} project{demoProjects === 1 ? "" : "s"}, {demoPosts} post{demoPosts === 1 ? "" : "s"} and {demoTestimonials} testimonial{demoTestimonials === 1 ? "" : "s"} are flagged as placeholders. Replace or edit them and untick “Demo content” before launch.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">{c.label}</p>
            <p className="mt-3 font-display text-4xl font-semibold tabular-nums">{c.value}</p>
            <p className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{c.note ?? "\u00a0"}</span>
              <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight">Recent submissions</h2>
          <Link href="/admin/submissions" className="link-underline text-sm font-medium">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No submissions yet. They will appear here when someone uses the contact form.</p>
        ) : (
          <DataTable>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Project</Th>
                <Th>Budget</Th>
                <Th>Status</Th>
                <Th>Received</Th>
              </tr>
            </thead>
            <tbody>
              {recent.map((s) => (
                <tr key={s.id} className="hover:bg-secondary/50">
                  <Td>
                    <Link href={`/admin/submissions/${s.id}`} className="font-medium hover:underline">
                      {s.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                  </Td>
                  <Td>{s.projectType}</Td>
                  <Td>
                    <Badge variant="outline">{s.budget}</Badge>
                  </Td>
                  <Td>
                    <StatusBadge status={s.status} />
                  </Td>
                  <Td className="whitespace-nowrap text-muted-foreground">{formatDate(s.createdAt, { hour: "2-digit", minute: "2-digit" })}</Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </div>
    </>
  );
}
