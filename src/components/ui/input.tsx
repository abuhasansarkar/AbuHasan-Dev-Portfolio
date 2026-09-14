import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-12 w-full rounded-lg border border-input bg-background/60 px-4 text-base text-foreground shadow-none transition-colors placeholder:text-muted-foreground/70 hover:border-foreground/30 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive md:text-sm",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
