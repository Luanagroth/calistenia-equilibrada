import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await getAdminAccess();

  if (!access.user) {
    redirect("/login");
  }

  if (!access.isAdmin) {
    redirect("/aluno/dashboard");
  }

  return (
    <AdminShell
      adminName={access.profile?.full_name ?? "Admin"}
      adminEmail={access.user.email ?? ""}
    >
      {children}
    </AdminShell>
  );
}
