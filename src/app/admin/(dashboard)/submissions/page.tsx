import Link from "next/link";
import { Suspense } from "react";
import { Clock, Mail, MessageSquare } from "lucide-react";
import { Flash } from "@/components/admin/flash";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Td, Th } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { formatDate, truncate } from "@/lib/utils";

export const metadata = { title: "Contact Submissions" };

const STATUS_ORDER = ["NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED", "ARCHIVED"] as const;

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const statusFilter = STATUS_ORDER.find((s) => s === rawStatus);

  const [items, counts] = await Promise.all([
    prisma.contactSubmission.findMany({
      where: statusFilter ? { status: statusFilter } : undefined,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactSubmission.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count._all]));
  const total = counts.reduce((s, c) => s + c._count._all, 0);

  return (
    <>
      <Suspense>
        <Flash />
      </Suspense>
      <PageHeader
        title="Submissions"
        description="Contact form submissions from potential clients."
      />

      {/* Status filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/submissions"
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            !statusFilter
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
          }`}
        >
          All <span className="ml-1 tabular-nums opacity-60">{total}</span>
        </Link>
        {STATUS_ORDER.map((s) => (
          <Link
            key={s}
            href={`/admin/submissions?status=${s}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === s
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            {s.replace("_", " ")}{" "}
            {countMap[s] ? (
              <span className="ml-1 tabular-nums opacity-60">{countMap[s]}</span>
            ) : null}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border p-16 text-center">
          <MessageSquare className="size-8 text-muted-foreground/40" />
          <div>
            <p className="font-medium">No submissions yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {statusFilter ? `No submissions with status "${statusFilter.replace("_", " ")}"` : "When someone fills out the contact form, it will appear here."}
            </p>
          </div>
        </div>
      ) : (
        <DataTable>
          <thead>
            <tr>
              <Th>From</Th>
              <Th>Project type</Th>
              <Th>Budget</Th>
              <Th>Message</Th>
              <Th>Status</Th>
              <Th>Received</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="hover:bg-secondary/50">
                <Td>
                  <Link href={`/admin/submissions/${s.id}`} className="font-medium hover:underline">
                    {s.name}
                  </Link>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="size-3" aria-hidden />
                    {s.email}
                  </p>
                </Td>
                <Td>{s.projectType}</Td>
                <Td>
                  <Badge variant="outline">{s.budget}</Badge>
                </Td>
                <Td className="max-w-xs text-muted-foreground">
                  {truncate(s.message, 80)}
                </Td>
                <Td>
                  <StatusBadge status={s.status} />
                </Td>
                <Td className="whitespace-nowrap text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" aria-hidden />
                    {formatDate(s.createdAt)}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      )}
    </>
  );
}
