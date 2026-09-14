import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const showDemoHint = process.env.NODE_ENV !== "production" && Boolean(process.env.ADMIN_EMAIL);

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-16 grain">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden />
          Back to site
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8">
          <p className="font-display text-xl font-semibold tracking-tight">
            AbuHasan<span className="text-accent">.</span>
          </p>
          <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight">Sign in to admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage projects, articles, testimonials and leads.</p>
          <div className="mt-8">
            <LoginForm next={next} />
          </div>
        </div>
        {showDemoHint && (
          <p className="mt-6 rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Development:</span> the initial account uses <code className="rounded bg-secondary px-1">ADMIN_EMAIL</code> and <code className="rounded bg-secondary px-1">ADMIN_PASSWORD</code> from your <code className="rounded bg-secondary px-1">.env</code>. Change them before deploying.
          </p>
        )}
      </div>
    </main>
  );
}
