"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateAdminProfileAction(prev: { success?: boolean; error?: string } | null, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sessao expirada." };
  }

  const fullName = (formData.get("fullName") as string | null)?.trim() ?? "";
  if (!fullName) {
    return { error: "Nome e obrigatorio." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id);

  if (error) {
    return { error: "Erro ao atualizar perfil." };
  }

  revalidatePath("/admin/perfil");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateAdminPasswordAction(prev: { success?: boolean; error?: string } | null, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sessao expirada." };
  }

  const newPassword = (formData.get("newPassword") as string | null)?.trim() ?? "";
  const confirmPassword = (formData.get("confirmPassword") as string | null)?.trim() ?? "";

  if (!newPassword || newPassword.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "As senhas nao coincidem." };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: "Erro ao alterar senha." };
  }

  revalidatePath("/admin/perfil");
  return { success: true };
}

export async function adminLogoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
