import type { SubmissionStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

export const submissionStatusLabels: Record<SubmissionStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

const variants: Record<SubmissionStatus, "accent" | "default" | "outline" | "success"> = {
  NEW: "accent",
  CONTACTED: "default",
  IN_PROGRESS: "default",
  COMPLETED: "success",
  ARCHIVED: "outline",
};

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return <Badge variant={variants[status]}>{submissionStatusLabels[status]}</Badge>;
}
