import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Native select styled to match inputs. Native keeps keyboard + mobile behaviour free and accessible. */
const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "flex h-12 w-full appearance-none rounded-lg border border-input bg-background/60 px-4 pr-10 text-base text-foreground shadow-none transition-[border-color,box-shadow] duration-300 ease-[var(--ease-standard)] hover:border-foreground/30 focus-visible:border-ring focus-visible:shadow-[0_6px_24px_-12px_hsl(var(--accent)/0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive md:text-sm",
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
  </div>
));
Select.displayName = "Select";

export { Select };
