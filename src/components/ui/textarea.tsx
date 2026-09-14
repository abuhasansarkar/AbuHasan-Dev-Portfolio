import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-32 w-full rounded-lg border border-input bg-background/60 px-4 py-3 text-base text-foreground shadow-none transition-[border-color,box-shadow] duration-300 ease-[var(--ease-standard)] placeholder:text-muted-foreground/70 hover:border-foreground/30 focus-visible:border-ring focus-visible:shadow-[0_6px_24px_-12px_hsl(var(--accent)/0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive md:text-sm",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
