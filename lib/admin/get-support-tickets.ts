import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminAccess } from "@/lib/auth/get-admin-access";

export type SupportTicket = {
  id: string;
  user_id: string;
  aluno: string;
  email: string;
  tipo: string;
  assunto: string;
  mensagem: string;
  status: string;
  created_at: string;
  admin_notes: string | null;
};

export async function getSupportTickets(): Promise<SupportTicket[]> {
  const adminAccess = await getAdminAccess();

  if (!adminAccess.isAdmin) {
    return [];
  }

  const { data: tickets } = await supabaseAdmin
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false });

  const ticketsList = tickets ?? [];

  const userIds = Array.from(new Set(ticketsList.map((t) => t.user_id)));

  const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
  const authUsersList = authUsers?.users ?? [];

  const userMap = new Map(
    authUsersList
      .filter((u) => userIds.includes(u.id))
      .map((u) => [
        u.id,
        {
          email: u.email ?? "",
        },
      ])
  );

  return ticketsList.map((t) => {
    const user = userMap.get(t.user_id);

    return {
      id: t.id,
      user_id: t.user_id,
      aluno: user?.email?.split("@")[0] ?? "Aluno",
      email: user?.email ?? "—",
      tipo: t.type,
      assunto: t.subject,
      mensagem: t.message,
      status: t.status,
      created_at: t.created_at,
      admin_notes: t.admin_notes,
    };
  });
}
