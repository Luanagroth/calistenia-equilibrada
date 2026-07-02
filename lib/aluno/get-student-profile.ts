import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type StudentProfile = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  mobilityLevel: number | null;
  mainGoal: string;
  limitations: string;
};

export async function getStudentProfile(): Promise<StudentProfile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, avatar_url, age, height_cm, weight_kg, mobility_level, main_goal, limitations",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return {
    id: profile?.id ?? user.id,
    email: user.email ?? "",
    fullName: profile?.full_name ?? "",
    avatarUrl: profile?.avatar_url ?? "",
    age: profile?.age ?? null,
    heightCm: profile?.height_cm ?? null,
    weightKg: profile?.weight_kg ?? null,
    mobilityLevel: profile?.mobility_level ?? null,
    mainGoal: profile?.main_goal ?? "",
    limitations: profile?.limitations ?? "",
  };
}
