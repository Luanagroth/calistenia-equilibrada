"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminAccess } from "@/lib/auth/get-admin-access";

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

export async function extendAccessAction(formData: FormData): Promise<void> {
  const studentId = getStudentId(formData);
  await ensureAdmin();

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

  const { error: insertError } = await supabaseAdmin.from("access_periods").insert({
    user_id: studentId,
    starts_at: now.toISOString(),
    ends_at: new Date(baseDate.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    source: "manual_admin_extension",
    notes: "Acesso estendido pelo painel admin",
  });

  if (insertError) {
    throw new Error("Erro ao estender acesso do aluno.");
  }

  await supabaseAdmin
    .from("profiles")
    .update({ status: "active" })
    .eq("id", studentId);

  revalidatePath("/admin/acessos");
  redirect("/admin/acessos?success=access-extended");
}

export async function endAccessAction(formData: FormData): Promise<void> {
  const studentId = getStudentId(formData);
  await ensureAdmin();

  await supabaseAdmin
    .from("profiles")
    .update({ status: "blocked" })
    .eq("id", studentId);

  const { error: updateError } = await supabaseAdmin
    .from("access_periods")
    .update({ status: "blocked" })
    .eq("user_id", studentId)
    .eq("status", "active");

  if (updateError) {
    throw new Error("Erro ao encerrar acesso do aluno.");
  }

  revalidatePath("/admin/acessos");
  redirect("/admin/acessos?success=access-ended");
}
