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

function getReply(formData: FormData): string {
  const reply = formData.get("replyMessage");
  if (typeof reply !== "string" || !reply.trim()) {
    throw new Error("A resposta é obrigatória.");
  }
  return reply.trim();
}

export async function replySupportTicketAction(formData: FormData): Promise<void> {
  const ticketId = getTicketId(formData);
  await ensureAdmin();

  const replyMessage = getReply(formData);

  const { data: ticket } = await supabaseAdmin
    .from("support_tickets")
    .select("user_id")
    .eq("id", ticketId)
    .maybeSingle();

  if (!ticket) {
    throw new Error("Ticket não encontrado.");
  }

  const { error } = await supabaseAdmin
    .from("support_tickets")
    .update({
      admin_notes: replyMessage,
      status: "answered",
      updated_at: new Date().toISOString(),
    })
    .eq("id", ticketId);

  if (error) {
    throw new Error("Erro ao responder ticket.");
  }

  const { error: notificationError } = await supabaseAdmin.from("student_notifications").insert({
    user_id: ticket.user_id,
    title: "Resposta do suporte",
    message: "Sua solicitação recebeu uma resposta. Acesse o suporte para conferir.",
    type: "support",
  });

  if (notificationError) {
    throw new Error("Resposta salva, mas não foi possível gerar notificação.");
  }

  revalidatePath("/admin/suporte");
  redirect("/admin/suporte?success=ticket-replied");
}
