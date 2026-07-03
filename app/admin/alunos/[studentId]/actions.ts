"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminAccess } from "@/lib/auth/get-admin-access";

const BASE_PATH = "/admin/alunos";

function getStudentId(formData: FormData): string {
  const studentId = formData.get("studentId");
  if (typeof studentId !== "string" || !studentId.trim()) {
    throw new Error("studentId é obrigatório.");
  }
  return studentId.trim();
}

async function ensureAdmin(): Promise<void> {
  const adminAccess = await getAdminAccess();
  if (!adminAccess.isAdmin) {
    throw new Error("Acesso restrito a administradores.");
  }
}

function redirectWithParam(studentId: string, key: string, value: string) {
  revalidatePath(BASE_PATH);
  redirect(`${BASE_PATH}/${studentId}?${key}=${encodeURIComponent(value)}`);
}

export async function updateStudentEmailAction(formData: FormData): Promise<void> {
  const studentId = getStudentId(formData);
  await ensureAdmin();

  const rawEmail = (formData.get("newEmail") as string | null)?.trim() ?? "";
  if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
    redirectWithParam(studentId, "error", "email-invalid");
  }

  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
  const alreadyExists = existingUsers?.users.some((u) => u.email?.toLowerCase() === rawEmail.toLowerCase() && u.id !== studentId);
  if (alreadyExists) {
    redirectWithParam(studentId, "error", "email-exists");
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(studentId, {
    email: rawEmail,
    email_confirm: true,
  });

  if (error) {
    redirectWithParam(studentId, "error", "email-error");
  }

  redirectWithParam(studentId, "success", "email-updated");
}

export async function resetStudentPasswordAction(formData: FormData): Promise<void> {
  const studentId = getStudentId(formData);
  await ensureAdmin();

  const password = (formData.get("newPassword") as string | null)?.trim() ?? "";
  if (!password || password.length < 6) {
    redirectWithParam(studentId, "error", "password-short");
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(studentId, {
    password,
  });

  if (error) {
    redirectWithParam(studentId, "error", "password-error");
  }

  redirectWithParam(studentId, "success", "password-reset");
}

export async function sendStudentResetLinkAction(formData: FormData): Promise<void> {
  const studentId = getStudentId(formData);
  await ensureAdmin();

  const { data: users } = await supabaseAdmin.auth.admin.listUsers();
  const user = users?.users.find((u) => u.id === studentId);
  const email = user?.email;

  if (!email) {
    redirectWithParam(studentId, "error", "reset-link-error");
  }

  try {
    const { error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: email!,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/nova-senha`,
      },
    });

    if (error) {
      throw error;
    }
  } catch {
    redirectWithParam(studentId, "error", "reset-link-error");
  }

  redirectWithParam(studentId, "success", "reset-link-sent");
}

export async function adjustStudentAccessAction(formData: FormData): Promise<void> {
  const studentId = getStudentId(formData);
  await ensureAdmin();

  const days = getDaysValue(formData);
  const now = new Date();

  const { data: activeAccess } = await supabaseAdmin
    .from("access_periods")
    .select("ends_at")
    .eq("user_id", studentId)
    .eq("status", "active")
    .lte("starts_at", now.toISOString())
    .gte("ends_at", now.toISOString())
    .order("ends_at", { ascending: false })
    .maybeSingle();

  const baseDate = activeAccess ? new Date(activeAccess.ends_at) : now;
  const newEndsAt = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);

  if (newEndsAt.toISOString() < now.toISOString() && days < 0) {
    redirectWithParam(studentId, "error", "end-date-past");
  }

  const { error: insertError } = await supabaseAdmin.from("access_periods").insert({
    user_id: studentId,
    starts_at: now.toISOString(),
    ends_at: newEndsAt.toISOString(),
    status: "active",
    source: "manual_admin_adjustment",
    notes: `Acesso ajustado em ${days > 0 ? "+" : ""}${days} dias pelo painel admin`,
  });

  if (insertError) {
    redirectWithParam(studentId, "error", "access-error");
  }

  const { data: profile } = await supabaseAdmin.from("profiles").select("status").eq("id", studentId).maybeSingle();
  if (profile?.status !== "active") {
    await supabaseAdmin.from("profiles").update({ status: "active" }).eq("id", studentId);
  }

  redirectWithParam(studentId, "success", "access-extended");
}

export async function setStudentAccessEndDateAction(formData: FormData): Promise<void> {
  const studentId = getStudentId(formData);
  await ensureAdmin();

  const newEndDate = (formData.get("endDate") as string | null)?.trim() ?? "";
  if (!newEndDate) {
    redirectWithParam(studentId, "error", "end-date-invalid");
  }

  const now = new Date();
  const endsAt = new Date(newEndDate + "T23:59:59");
  if (isNaN(endsAt.getTime())) {
    redirectWithParam(studentId, "error", "end-date-invalid");
  }

  if (endsAt.toISOString() < now.toISOString()) {
    redirectWithParam(studentId, "error", "end-date-past");
  }

  const { error: updateError } = await supabaseAdmin
    .from("access_periods")
    .update({ ends_at: endsAt.toISOString(), status: "active" })
    .eq("user_id", studentId)
    .eq("status", "active")
    .lte("starts_at", now.toISOString())
    .gte("ends_at", now.toISOString());

  if (updateError) {
    const { error: insertError } = await supabaseAdmin.from("access_periods").insert({
      user_id: studentId,
      starts_at: now.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "active",
      source: "manual_admin_enddate",
      notes: "Data final definida manualmente pelo painel admin",
    });

    if (insertError) {
      redirectWithParam(studentId, "error", "end-date-error");
    }
  }

  const { data: profile } = await supabaseAdmin.from("profiles").select("status").eq("id", studentId).maybeSingle();
  if (profile?.status !== "active") {
    await supabaseAdmin.from("profiles").update({ status: "active" }).eq("id", studentId);
  }

  redirectWithParam(studentId, "success", "end-date-set");
}

export async function blockStudentAccessAction(formData: FormData): Promise<void> {
  const studentId = getStudentId(formData);
  await ensureAdmin();

  await supabaseAdmin.from("profiles").update({ status: "blocked" }).eq("id", studentId);

  const { error } = await supabaseAdmin
    .from("access_periods")
    .update({ status: "blocked" })
    .eq("user_id", studentId)
    .eq("status", "active");

  if (error) {
    redirectWithParam(studentId, "error", "block-error");
  }

  redirectWithParam(studentId, "success", "student-blocked");
}

export async function unblockStudentAccessAction(formData: FormData): Promise<void> {
  const studentId = getStudentId(formData);
  await ensureAdmin();

  const now = new Date();
  const { data: activeAccess } = await supabaseAdmin
    .from("access_periods")
    .select("ends_at, starts_at")
    .eq("user_id", studentId)
    .eq("status", "blocked")
    .order("ends_at", { ascending: false })
    .maybeSingle();

  const baseDate = activeAccess ? new Date(activeAccess.ends_at) : now;
  const newEndsAt = baseDate > now ? baseDate : new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000);

  const { error: insertError } = await supabaseAdmin.from("access_periods").insert({
    user_id: studentId,
    starts_at: now.toISOString(),
    ends_at: newEndsAt.toISOString(),
    status: "active",
    source: "manual_admin_unblock",
    notes: "Acesso reativado pelo painel admin",
  });

  if (insertError) {
    redirectWithParam(studentId, "error", "unblock-error");
  }

  await supabaseAdmin.from("profiles").update({ status: "active" }).eq("id", studentId);

  redirectWithParam(studentId, "success", "student-unblocked");
}

export async function disableStudentAccountAction(formData: FormData): Promise<void> {
  const studentId = getStudentId(formData);
  await ensureAdmin();

  await supabaseAdmin.from("profiles").update({ status: "blocked" }).eq("id", studentId);

  const { error } = await supabaseAdmin
    .from("access_periods")
    .update({ status: "blocked" })
    .eq("user_id", studentId)
    .eq("status", "active");

  if (error) {
    redirectWithParam(studentId, "error", "disable-error");
  }

  redirectWithParam(studentId, "success", "student-disabled");
}

export async function resetStudentAccountAction(formData: FormData): Promise<void> {
  const studentId = getStudentId(formData);
  const confirmation = (formData.get("confirmation") as string | null)?.trim() ?? "";

  await ensureAdmin();

  if (confirmation !== "RESETAR") {
    redirectWithParam(studentId, "error", "reset-confirm-error");
  }

  const now = new Date().toISOString();

  const { error: progressDeleteError } = await supabaseAdmin
    .from("student_daily_progress")
    .delete()
    .eq("user_id", studentId);

  if (progressDeleteError) {
    redirectWithParam(studentId, "error", "reset-progress-error");
  }

  const { error: evolutionDeleteError } = await supabaseAdmin
    .from("student_evolution_checkins")
    .delete()
    .eq("user_id", studentId);

  if (evolutionDeleteError) {
    redirectWithParam(studentId, "error", "reset-evolution-error");
  }

  await supabaseAdmin.from("profiles").update({
    weight_kg: null,
    mobility_level: null,
  }).eq("id", studentId);

  revalidatePath(BASE_PATH);
  redirect(`${BASE_PATH}/${studentId}?success=account-reset`);
}

export async function replyStudentTicketAction(formData: FormData): Promise<void> {
  const ticketId = getTicketId(formData);
  const studentId = (formData.get("studentId") as string | null)?.trim() ?? "";
  const replyMessage = (formData.get("replyMessage") as string | null)?.trim() ?? "";

  await ensureAdmin();

  if (!replyMessage) {
    redirectWithParam(studentId, "error", "ticket-reply-error");
  }

  const { data: ticket } = await supabaseAdmin
    .from("support_tickets")
    .select("id, user_id")
    .eq("id", ticketId)
    .maybeSingle();

  if (!ticket) {
    redirectWithParam(studentId, "error", "ticket-reply-error");
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
    redirectWithParam(studentId, "error", "ticket-reply-error");
  }

  const { error: notificationError } = await supabaseAdmin.from("student_notifications").insert({
    user_id: ticket!.user_id,
    title: "Resposta do suporte",
    message: "Sua solicitação recebeu uma resposta. Acesse o suporte para conferir.",
    type: "support",
  });

  if (notificationError) {
    redirectWithParam(studentId, "error", "ticket-notification-error");
  }

  redirectWithParam(studentId, "success", "ticket-replied");
}

function getTicketId(formData: FormData): string {
  const ticketId = formData.get("ticketId");
  if (typeof ticketId !== "string" || !ticketId.trim()) {
    throw new Error("Ticket é obrigatório.");
  }
  return ticketId.trim();
}

function getDaysValue(formData: FormData): number {
  const raw = formData.get("days") as string | null;
  const parsed = raw ? parseInt(raw, 10) : 0;
  if (Number.isNaN(parsed) || parsed === 0) {
    throw new Error("Valor de dias inválido.");
  }
  return parsed;
}
