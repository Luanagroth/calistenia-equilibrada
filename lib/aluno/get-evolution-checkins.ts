import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type EvolutionCheckin = {
  id: string;
  user_id: string;
  weight_kg: number | null;
  mobility_level: number | null;
  energy_level: number | null;
  pain_level: number | null;
  notes: string | null;
  created_at: string;
};

export type EvolutionProfileSnapshot = {
  fullName: string;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  mobilityLevel: number | null;
};

export type EvolutionTrainingAverages = {
  energy: number | null;
  difficulty: number | null;
  pain: number | null;
};

export type EvolutionCheckinsData = {
  profile: EvolutionProfileSnapshot;
  checkins: EvolutionCheckin[];
  completedTrainings: number;
  journeyPercentage: number;
  trainingAverages: EvolutionTrainingAverages;
};

function averageFrom(values: Array<number | null>): number | null {
  const validValues = values.filter((value): value is number => value !== null);
  if (validValues.length === 0) {
    return null;
  }

  const total = validValues.reduce((sum, value) => sum + value, 0);
  return Number((total / validValues.length).toFixed(1));
}

export async function getEvolutionCheckins(): Promise<EvolutionCheckinsData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile, error: profileError }, { data: checkins, error: checkinsError }, { data: progress, error: progressError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, age, height_cm, weight_kg, mobility_level")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("student_evolution_checkins")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }),
      supabase
        .from("student_daily_progress")
        .select("journey_day, energy_level, difficulty_level, pain_level, status, completed_at")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("journey_day", { ascending: true }),
    ]);

  if (profileError) throw profileError;
  if (checkinsError) throw checkinsError;
  if (progressError) throw progressError;

  const completedTrainings = progress?.length ?? 0;

  return {
    profile: {
      fullName: profile?.full_name ?? "",
      age: profile?.age ?? null,
      heightCm: profile?.height_cm ?? null,
      weightKg: profile?.weight_kg ?? null,
      mobilityLevel: profile?.mobility_level ?? null,
    },
    checkins: (checkins ?? []) as EvolutionCheckin[],
    completedTrainings,
    journeyPercentage: Math.round((completedTrainings / 30) * 100),
    trainingAverages: {
      energy: averageFrom((progress ?? []).map((entry) => entry.energy_level)),
      difficulty: averageFrom((progress ?? []).map((entry) => entry.difficulty_level)),
      pain: averageFrom((progress ?? []).map((entry) => entry.pain_level)),
    },
  };
}
