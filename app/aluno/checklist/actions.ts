"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/auth/get-user-access";
import { getJourneyAvailability } from "@/lib/jornada/progress-rules";
import { getStudentProgressSummary } from "@/lib/aluno/get-student-progress";
import { getTrainingDayPlan } from "@/lib/jornada/training-plan";

export async function saveDailyProgressAction(formData: FormData): Promise<void> {
  const access = await getUserAccess();

  if (!access.user || !access.isActive) {
    redirect("/acesso-expirado");
  }

  const journeyDayRaw = formData.get("journeyDay");
  const journeyDay = typeof journeyDayRaw === "string" ? parseInt(journeyDayRaw, 10) : NaN;

  if (Number.isNaN(journeyDay) || journeyDay < 1 || journeyDay > 30) {
    redirect("/aluno/checklist?error=invalid-day");
  }

  const intent = formData.get("intent");
  const status = intent === "complete" ? "completed" : "in_progress";

  const journey = await getJourneyAvailability();
  const summary = await getStudentProgressSummary();
  const plan = getTrainingDayPlan(journeyDay);

  const dayProgress = summary.progressList.find((p) => p.journey_day === journeyDay);

  if (!plan) {
    redirect("/aluno/checklist?error=invalid-day");
  }

  if (status === "completed" && journeyDay !== journey.availableDay) {
    redirect("/aluno/checklist?error=day-locked");
  }

  if (status === "in_progress" && dayProgress?.status === "completed") {
    redirect("/aluno/checklist?error=day-locked");
  }

  if (status === "in_progress" && !dayProgress && journeyDay > journey.availableDay) {
    redirect("/aluno/checklist?error=day-locked");
  }

  const checklistKeys = [
    "warmup",
    "mobility",
    "strength",
    "stretching",
    "breathing",
    "hydration",
    "balancedFood",
    "naturalFoods",
    "respectedLimits",
    "rest",
    "reading",
  ] as const;
  const checklist: Record<string, boolean> = {};
  for (const key of checklistKeys) {
    checklist[key] = formData.has(key);
  }

  const exerciseProgress = Object.fromEntries(
    plan.exercises.map((exercise) => [exercise.id, formData.has(`exercise:${exercise.id}`)])
  );

  const legacyExerciseMap = {
    aquecimento: "warmup",
    mobilidade: "mobility",
    estabilidade: "strength",
    forca: "strength",
    alongamento: "stretching",
    respiracao: "breathing",
  } as const;

  for (const exercise of plan.exercises) {
    const legacyKey = legacyExerciseMap[exercise.category];
    if (exerciseProgress[exercise.id] && legacyKey) {
      checklist[legacyKey] = true;
    }
  }

  const completedExerciseCount = Object.values(exerciseProgress).filter(Boolean).length;
  const totalExerciseCount = plan.exercises.length;

  if (status === "completed" && completedExerciseCount < totalExerciseCount) {
    redirect("/aluno/checklist?error=incomplete-main-steps");
  }

  const energyLevelRaw = formData.get("energyLevel");
  const energyLevel = typeof energyLevelRaw === "string" && energyLevelRaw.trim() ? parseInt(energyLevelRaw, 10) : null;

  const difficultyLevelRaw = formData.get("difficultyLevel");
  const difficultyLevel = typeof difficultyLevelRaw === "string" && difficultyLevelRaw.trim() ? parseInt(difficultyLevelRaw, 10) : null;

  const painLevelRaw = formData.get("painLevel");
  const painLevel = typeof painLevelRaw === "string" && painLevelRaw.trim() ? parseInt(painLevelRaw, 10) : null;

  const notes = (formData.get("notes") as string | null)?.trim() ?? "";

  const supabase = await createClient();

  const payload: Record<string, unknown> = {
    user_id: access.user.id,
    journey_day: journeyDay,
    checklist: {
      ...checklist,
      exercises: exerciseProgress,
    },
    energy_level: energyLevel,
    difficulty_level: difficultyLevel,
    pain_level: painLevel,
    notes: notes || null,
    status,
  };

  if (status === "completed") {
    payload.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("student_daily_progress")
    .upsert(payload, { onConflict: "user_id, journey_day" });

  if (error) {
    redirect("/aluno/checklist?error=save-error");
  }

  revalidatePath("/aluno/checklist");
  revalidatePath("/aluno/evolucao");

  redirect(`/aluno/checklist?success=${status === "completed" ? "training-completed" : "progress-saved"}`);
}
