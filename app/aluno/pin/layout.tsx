import { getUserAccess } from "@/lib/auth/get-user-access";
import { redirect } from "next/navigation";

export default async function PinLayout({
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

  return <>{children}</>;
}