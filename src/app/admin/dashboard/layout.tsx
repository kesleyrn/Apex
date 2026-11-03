import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { ToastProvider } from "@/components/ui/Toast";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Role check: a login alone is not enough, the user must be an administrator.
  const { user, profile } = await requireAdmin();
  return (
    <ToastProvider>
      <AdminShell name={profile.full_name || user.email || "Administrator"} email={user.email ?? ""} role={profile.role}>
        {children}
      </AdminShell>
    </ToastProvider>
  );
}
