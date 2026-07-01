"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminAccess } from "@/lib/auth/get-admin-access";

async function ensureAdmin(): Promise<void> {
  const adminAccess = await getAdminAccess();
  if (!adminAccess.isAdmin) {
    throw new Error("Acesso restrito a administradores.");
  }
}

function getTicketId(formData: FormData): string {
  const ticketId = formData.get("ticketId");
  if (typeof ticketId !== "string" || !ticketId.trim()) {
    throw new Error("Ticket é obrigatório.");
  }
  return ticketId.trim();
}

export async function markTicketReviewingAction(formData: FormData): Promise<void> {
  const ticketId = getTicketId(formData);
  await ensureAdmin();

  const { error } = await supabaseAdmin
    .from("support_tickets")
    .update({ status: "reviewing" })
    .eq("id", ticketId);

  if (error) {
    throw new Error("Erro ao atualizar ticket.");
  }

  revalidatePath("/admin/suporte");
  redirect("/admin/suporte?success=mark-reviewing");
}

export async function markTicketAnsweredAction(formData: FormData): Promise<void> {
  const ticketId = getTicketId(formData);
  await ensureAdmin();

  const { error } = await supabaseAdmin
    .from("support_tickets")
    .update({ status: "answered" })
    .eq("id", ticketId);

  if (error) {
    throw new Error("Erro ao atualizar ticket.");
  }

  revalidatePath("/admin/suporte");
  redirect("/admin/suporte?success=mark-answered");
}

export async function closeTicketAction(formData: FormData): Promise<void> {
  const ticketId = getTicketId(formData);
  await ensureAdmin();

  const { error } = await supabaseAdmin
    .from("support_tickets")
    .update({ status: "closed" })
    .eq("id", ticketId);

  if (error) {
    throw new Error("Erro ao atualizar ticket.");
  }

  revalidatePath("/admin/suporte");
  redirect("/admin/suporte?success=mark-closed");
}
