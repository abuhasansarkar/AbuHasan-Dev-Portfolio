"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Runtime Error]", error);
  }, [error]);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center grain">
      <div
        className="pointer-events-none absolute -top-1/4 left-1/2 size-[60vmax] -translate-x-1/2 rounded-full bg-destructive/[0.08] blur-[120px]"
        aria-hidden
      />
      <div className="flex max-w-md flex-col items-center gap-6">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
          <RotateCcw className="size-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            An unexpected error occurred while loading this page. Please try again or return to the homepage.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button onClick={() => reset()} size="lg">
            <RotateCcw className="size-4" />
            Try again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              Back to home
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
