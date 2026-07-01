"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminAccess } from "@/lib/auth/get-admin-access";

type ActionResult = {
  success?: boolean;
  message?: string;
  error?: string;
};

export async function createStudentAccessAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult | null> {
  const adminAccess = await getAdminAccess();

  if (!adminAccess.isAdmin) {
    return { error: "Acesso restrito a administradores." };
  }

  const fullName = (formData.get("fullName") as string | null)?.trim();
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const temporaryPassword = formData.get("temporaryPassword") as string | null;
  const durationDays = parseInt((formData.get("durationDays") as string | null) || "0", 10);
  const notes = (formData.get("notes") as string | null)?.trim() ?? "";

  if (!fullName) {
    return { error: "Nome é obrigatório." };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "E-mail inválido." };
  }

  if (!temporaryPassword || temporaryPassword.length < 6) {
    return { error: "A senha temporária deve ter pelo menos 6 caracteres." };
  }

  if (![30, 45, 60].includes(durationDays)) {
    return { error: "Duração inválida. Selecione 30, 45 ou 60 dias." };
  }

  const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    return { error: "Erro ao verificar usuário existente." };
  }

  const userExists = existingUsers?.users.some((u) => u.email?.toLowerCase() === email);
  if (userExists) {
    return { error: "Este e-mail já possui cadastro. Use a ação de estender acesso." };
  }

  const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
    },
  });

  if (createError || !createdUser.user) {
    return { error: "Erro ao criar usuário. Tente novamente." };
  }

  const userId = createdUser.user.id;

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .upsert({
      id: userId,
      full_name: fullName,
      role: "student",
      status: "active",
    });

  if (profileError) {
    return { error: "Erro ao criar perfil do aluno." };
  }

  const startsAt = new Date().toISOString();
  const endsAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  const { error: accessError } = await supabaseAdmin.from("access_periods").insert({
    user_id: userId,
    starts_at: startsAt,
    ends_at: endsAt,
    status: "active",
    source: "manual_admin",
    notes: notes || "Acesso criado pelo painel admin",
  });

  if (accessError) {
    return { error: "Erro ao criar período de acesso." };
  }

  revalidatePath("/admin/alunos");
  revalidatePath("/admin");

  return {
    success: true,
    message: `Aluno criado e acesso liberado por ${durationDays} dias.`,
  };
}
