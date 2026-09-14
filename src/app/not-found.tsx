import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "404 – Page Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center grain">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute -top-1/4 left-1/2 size-[60vmax] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-[120px]"
        aria-hidden
      />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.25)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"
        aria-hidden
      />

      <p className="font-display text-[clamp(6rem,20vw,16rem)] font-semibold leading-none tracking-[-0.05em] text-foreground/[0.06] select-none">
        404
      </p>

      <div className="-mt-4 flex flex-col items-center gap-6">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Page not found
          </h1>
          <p className="mt-3 max-w-md text-base text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s
            get you back to something useful.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              Back to home
              <ArrowRight className="transition-transform group-hover/btn:translate-x-1" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/#contact">Start a project</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          <Link href="/" className="link-underline font-medium text-foreground">
            {siteConfig.name}
          </Link>
          {" "}· Full-Stack Web Developer & WordPress Developer
        </p>
      </div>
    </div>
  );
}
