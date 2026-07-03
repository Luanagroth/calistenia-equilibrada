"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const evolutionCheckinSchema = z.object({
  weightKg: z.number().min(20).max(300).nullable(),
  mobilityLevel: z.number().int().min(0).max(5).nullable(),
  energyLevel: z.number().int().min(1).max(5).nullable(),
  painLevel: z.number().int().min(0).max(5).nullable(),
  notes: z.string().trim(),
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

export async function createEvolutionCheckinAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const parsedCheckin = evolutionCheckinSchema.safeParse({
    weightKg: parseOptionalDecimal(getTrimmedValue(formData, "weightKg")),
    mobilityLevel: parseOptionalInteger(getTrimmedValue(formData, "mobilityLevel")),
    energyLevel: parseOptionalInteger(getTrimmedValue(formData, "energyLevel")),
    painLevel: parseOptionalInteger(getTrimmedValue(formData, "painLevel")),
    notes: getTrimmedValue(formData, "notes"),
  });

  if (!parsedCheckin.success) {
    const issues = parsedCheckin.error.flatten().fieldErrors;

    if (issues.weightKg?.length) redirect("/aluno/evolucao?error=invalid-weight");
    if (issues.mobilityLevel?.length) redirect("/aluno/evolucao?error=invalid-mobility-level");
    if (issues.energyLevel?.length) redirect("/aluno/evolucao?error=invalid-energy-level");
    if (issues.painLevel?.length) redirect("/aluno/evolucao?error=invalid-pain-level");

    redirect("/aluno/evolucao?error=checkin-error");
  }

  const { error } = await supabase.from("student_evolution_checkins").insert({
    user_id: user.id,
    weight_kg: parsedCheckin.data.weightKg,
    mobility_level: parsedCheckin.data.mobilityLevel,
    energy_level: parsedCheckin.data.energyLevel,
    pain_level: parsedCheckin.data.painLevel,
    notes: parsedCheckin.data.notes || null,
  });

  if (error) {
    redirect("/aluno/evolucao?error=checkin-error");
  }

  revalidatePath("/aluno/evolucao");
  redirect("/aluno/evolucao?success=checkin-created");
}
