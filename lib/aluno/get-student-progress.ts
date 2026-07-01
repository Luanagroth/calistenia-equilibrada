import "server-only";

import { createClient } from "@/lib/supabase/server";

export type DayProgress = {
  id: string;
  journey_day: number;
  checklist: Record<string, boolean>;
  energy_level: number | null;
  difficulty_level: number | null;
  pain_level: number | null;
  notes: string | null;
  status: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProgressSummary = {
  totalCompletedDays: number;
  totalInProgressDays: number;
  progressPercentage: number;
  lastCompletedDay: number | null;
  progressList: DayProgress[];
};

export async function getStudentProgressByDay(journeyDay: number): Promise<DayProgress | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("student_daily_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("journey_day", journeyDay)
    .maybeSingle();

  return data as DayProgress | null;
}

export async function getStudentProgressSummary(): Promise<ProgressSummary> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      totalCompletedDays: 0,
      totalInProgressDays: 0,
      progressPercentage: 0,
      lastCompletedDay: null,
      progressList: [],
    };
  }

  const { data } = await supabase
    .from("student_daily_progress")
    .select("*")
    .eq("user_id", user.id)
    .order("journey_day", { ascending: true });

  const progressList = (data ?? []) as DayProgress[];

  const totalCompletedDays = progressList.filter((p) => p.status === "completed").length;
  const totalInProgressDays = progressList.filter((p) => p.status === "in_progress").length;
  const progressPercentage = Math.round((totalCompletedDays / 30) * 100);
  const lastCompletedDay = progressList.filter((p) => p.status === "completed").sort((a, b) => b.journey_day - a.journey_day)[0]?.journey_day ?? null;

  return {
    totalCompletedDays,
    totalInProgressDays,
    progressPercentage,
    lastCompletedDay,
    progressList,
  };
}
