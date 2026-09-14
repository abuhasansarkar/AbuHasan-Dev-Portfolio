"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn("rounded-full text-muted-foreground hover:text-foreground", className)}
    >
      <span className="relative flex size-4 items-center justify-center">
        <Sun className={cn("absolute transition-all duration-300", isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100")} />
        <Moon className={cn("absolute transition-all duration-300", isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0")} />
      </span>
    </Button>
  );
}
