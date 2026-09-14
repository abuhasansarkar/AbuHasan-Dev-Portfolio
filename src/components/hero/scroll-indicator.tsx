import { ArrowDown } from "lucide-react";

export function ScrollIndicator() {
  return (
    <a
      href="#about"
      data-hero="scroll"
      data-reveal
      aria-label="Scroll to about section"
      className="group absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground md:flex"
    >
      <span>Scroll</span>
      <span className="relative flex h-10 w-px overflow-hidden bg-border">
        <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-line_1.8s_var(--ease-in-out-quart)_infinite] bg-foreground" />
      </span>
      <ArrowDown className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden />
    </a>
  );
}
