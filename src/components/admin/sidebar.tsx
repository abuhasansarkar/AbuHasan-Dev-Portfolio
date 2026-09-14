"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, ExternalLink, FileText, Inbox, LayoutDashboard, LogOut, MessageSquareQuote, Settings, Tag, Wrench } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/posts", label: "Blog posts", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/submissions", label: "Submissions", icon: Inbox },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
];

export function Sidebar({ userName, newSubmissions }: { userName: string; newSubmissions: number }) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col border-b border-border bg-card lg:h-dvh lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:sticky lg:top-0">
      <div className="flex items-center justify-between px-5 py-4 lg:py-6">
        <Link href="/admin" className="font-display text-lg font-semibold tracking-tight">
          AbuHasan<span className="text-accent">.</span> <span className="text-xs font-medium text-muted-foreground">Admin</span>
        </Link>
        <ThemeToggle />
      </div>

      <nav aria-label="Admin" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-0">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn("flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}
            >
              <Icon className="size-4" aria-hidden />
              {label}
              {label === "Submissions" && newSubmissions > 0 && (
                <span className={cn("ml-auto rounded-full px-2 py-0.5 text-xs tabular-nums", active ? "bg-background/20" : "bg-accent text-accent-foreground")}>{newSubmissions}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-border p-4 lg:block">
        <a href="/" target="_blank" rel="noopener" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
          <ExternalLink className="size-4" aria-hidden />
          View site
        </a>
        <div className="mt-2 flex items-center justify-between gap-2 px-3">
          <span className="truncate text-xs text-muted-foreground">Signed in as {userName}</span>
          <form action={logout}>
            <button type="submit" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
              <LogOut className="size-3.5" aria-hidden />
              Log out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
