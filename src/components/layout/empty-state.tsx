import { Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, icon: Icon = Inbox, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-16 text-center", className)} role="status">
      <span className="flex size-12 items-center justify-center rounded-full border border-border text-muted-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
      <p className="mt-5 font-display text-lg font-semibold tracking-tight">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
