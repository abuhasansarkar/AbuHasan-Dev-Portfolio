import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import type { SectionId } from "@/lib/site";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  id: SectionId;
  /** Remove default vertical padding */
  flush?: boolean;
};

export function Section({ id, className, flush = false, children, ...props }: SectionProps) {
  return (
    <section id={id} data-section={id} className={cn("relative scroll-mt-20", !flush && "section-y", className)} {...props}>
      {children}
    </section>
  );
}
