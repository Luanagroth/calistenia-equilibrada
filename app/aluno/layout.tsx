import { redirect } from "next/navigation";
import { getUserAccess } from "@/lib/auth/get-user-access";
import { AlunoShell } from "@/components/aluno/aluno-shell";

export default async function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await getUserAccess();

  if (!access.user) {
    redirect("/login");
  }

  if (!access.isActive) {
    redirect("/acesso-expirado");
  }

  const studentName = access.profile?.full_name ?? "Aluno";
  const studentEmail = access.user.email ?? "";
  const studentAvatarUrl = access.profile?.avatar_url ?? "";
  const daysRemaining = access.daysRemaining;

  return (
    <AlunoShell
      studentName={studentName}
      studentEmail={studentEmail}
      studentAvatarUrl={studentAvatarUrl}
      daysRemaining={daysRemaining}
    >
      {children}
    </AlunoShell>
  );
}
