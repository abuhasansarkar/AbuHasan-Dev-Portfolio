import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/sidebar";
import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const newSubmissions = await prisma.contactSubmission.count({ where: { status: "NEW" } }).catch(() => 0);

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <Sidebar userName={session.name} newSubmissions={newSubmissions} />
      <div className="flex-1 px-5 py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
