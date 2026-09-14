import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DataTable({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-border bg-card", className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cn("whitespace-nowrap border-b border-border px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground", className)}>{children}</th>;
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("border-b border-border/60 px-4 py-3 align-middle", className)}>{children}</td>;
}
