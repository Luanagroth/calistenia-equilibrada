import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/auth/get-admin-access";

export default async function PendingStudentLayout({
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

  return <>{children}</>;
}