"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Nome obrigatorio."),
  avatarUrl: z.string().trim(),
  age: z.number().int().min(5).max(120).nullable(),
  heightCm: z.number().int().min(80).max(250).nullable(),
  weightKg: z.number().min(20).max(300).nullable(),
  mobilityLevel: z.number().int().min(0).max(5).nullable(),
  mainGoal: z.string().trim(),
  limitations: z.string().trim(),
});

function getTrimmedValue(formData: FormData, key: string) {
  return (formData.get(key) as string | null)?.trim() ?? "";
}

function parseOptionalInteger(value: string) {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? Number.NaN : parsed;
}

function parseOptionalDecimal(value: string) {
  if (!value) return null;
  const normalized = value.replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? Number.NaN : parsed;
}

export async function updateStudentProfileAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const parsedProfile = profileSchema.safeParse({
    fullName: getTrimmedValue(formData, "fullName"),
    avatarUrl: getTrimmedValue(formData, "avatarUrl"),
    age: parseOptionalInteger(getTrimmedValue(formData, "age")),
    heightCm: parseOptionalInteger(getTrimmedValue(formData, "heightCm")),
    weightKg: parseOptionalDecimal(getTrimmedValue(formData, "weightKg")),
    mobilityLevel: parseOptionalInteger(getTrimmedValue(formData, "mobilityLevel")),
    mainGoal: getTrimmedValue(formData, "mainGoal"),
    limitations: getTrimmedValue(formData, "limitations"),
  });

  if (!parsedProfile.success) {
    const issues = parsedProfile.error.flatten().fieldErrors;

    if (issues.fullName?.length) {
      redirect("/aluno/perfil?error=missing-full-name");
    }
    if (issues.age?.length) {
      redirect("/aluno/perfil?error=invalid-age");
    }
    if (issues.heightCm?.length) {
      redirect("/aluno/perfil?error=invalid-height");
    }
    if (issues.weightKg?.length) {
      redirect("/aluno/perfil?error=invalid-weight");
    }
    if (issues.mobilityLevel?.length) {
      redirect("/aluno/perfil?error=invalid-mobility-level");
    }

    redirect("/aluno/perfil?error=profile-error");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsedProfile.data.fullName,
      avatar_url: parsedProfile.data.avatarUrl || null,
      age: parsedProfile.data.age,
      height_cm: parsedProfile.data.heightCm,
      weight_kg: parsedProfile.data.weightKg,
      mobility_level: parsedProfile.data.mobilityLevel,
      main_goal: parsedProfile.data.mainGoal || null,
      limitations: parsedProfile.data.limitations || null,
    })
    .eq("id", user.id);

  if (error) {
    redirect("/aluno/perfil?error=profile-error");
  }

  revalidatePath("/aluno/perfil");
  revalidatePath("/aluno/dashboard");
  redirect("/aluno/perfil?success=profile-updated");
}

export async function updateStudentPasswordAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const newPassword = getTrimmedValue(formData, "newPassword");
  const confirmPassword = getTrimmedValue(formData, "confirmPassword");

  if (newPassword.length < 6) {
    redirect("/aluno/perfil?error=password-too-short");
  }

  if (newPassword !== confirmPassword) {
    redirect("/aluno/perfil?error=password-mismatch");
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    redirect("/aluno/perfil?error=password-error");
  }

  revalidatePath("/aluno/perfil");
  redirect("/aluno/perfil?success=password-updated");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
