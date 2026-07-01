import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminAccess } from "@/lib/auth/get-admin-access";

export type AdminStudentProgress = {
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

export type AdminStudentProgressSummary = {
  totalCompletedDays: number;
  totalInProgressDays: number;
  progressPercentage: number;
  lastCompletedDay: number | null;
  progressList: AdminStudentProgress[];
};

export async function getAdminStudentProgress(studentId: string): Promise<AdminStudentProgressSummary> {
  const adminAccess = await getAdminAccess();

  if (!adminAccess.isAdmin) {
    return {
      totalCompletedDays: 0,
      totalInProgressDays: 0,
      progressPercentage: 0,
      lastCompletedDay: null,
      progressList: [],
    };
  }

  const { data } = await supabaseAdmin
    .from("student_daily_progress")
    .select("*")
    .eq("user_id", studentId)
    .order("journey_day", { ascending: true });

  const progressList = (data ?? []) as AdminStudentProgress[];

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
