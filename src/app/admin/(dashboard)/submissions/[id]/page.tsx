import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Clock, Mail, User } from "lucide-react";
import { updateSubmissionStatus, addSubmissionNote, archiveSubmission } from "@/app/actions/admin/submissions";
import { Flash } from "@/components/admin/flash";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Submission Detail" };

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const submission = await prisma.contactSubmission.findUnique({ where: { id } });
  if (!submission) notFound();

  return (
    <>
      <Suspense>
        <Flash />
      </Suspense>

      <div className="mb-6">
        <Link href="/admin/submissions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden />
          Back to submissions
        </Link>
      </div>

      <PageHeader
        title={submission.name}
        description={`Submission received on ${formatDate(submission.createdAt)}`}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Main details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Contact info */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold tracking-tight">Contact Details</h2>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  <User className="size-3.5" aria-hidden /> Name
                </dt>
                <dd className="font-medium">{submission.name}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  <Mail className="size-3.5" aria-hidden /> Email
                </dt>
                <dd>
                  <a href={`mailto:${submission.email}`} className="font-medium hover:underline">
                    {submission.email}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Project type</dt>
                <dd>{submission.projectType}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Budget</dt>
                <dd>
                  <Badge variant="outline">{submission.budget}</Badge>
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden /> Received
                </dt>
                <dd className="text-muted-foreground">
                  {formatDate(submission.createdAt, { hour: "2-digit", minute: "2-digit" })}
                </dd>
              </div>
            </dl>
          </div>

          {/* Message */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold tracking-tight">Message</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {submission.message}
            </p>
          </div>

          {/* Internal notes */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold tracking-tight">Internal Notes</h2>
            <p className="mt-1 text-xs text-muted-foreground">Only visible in the admin. Never sent to the client.</p>
            <form action={addSubmissionNote} className="mt-4 flex flex-col gap-3">
              <input type="hidden" name="id" value={submission.id} />
              <textarea
                name="notes"
                rows={4}
                defaultValue={submission.notes ?? ""}
                placeholder="Add your notes here…"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="flex justify-end">
                <Button type="submit" variant="secondary" size="sm">Save notes</Button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar: status + quick actions */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 font-display text-lg font-semibold tracking-tight">Status</h2>
            <div className="mb-4">
              <StatusBadge status={submission.status} />
            </div>
            <form action={updateSubmissionStatus} className="flex flex-col gap-3">
              <input type="hidden" name="id" value={submission.id} />
              <select
                name="status"
                defaultValue={submission.status}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Button type="submit" className="w-full">Update status</Button>
            </form>
          </div>

          {/* Reply shortcut */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-3 font-display text-sm font-semibold tracking-tight text-muted-foreground uppercase tracking-[0.18em]">Quick actions</h2>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" size="sm" className="justify-start">
                <a href={`mailto:${submission.email}?subject=Re: Your project enquiry`}>
                  <Mail className="size-4" aria-hidden />
                  Reply via email
                </a>
              </Button>
              {submission.status !== "ARCHIVED" && (
                <form action={archiveSubmission}>
                  <input type="hidden" name="id" value={submission.id} />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                  >
                    Archive submission
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
