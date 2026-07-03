import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { getAccessDaysRemaining } from "@/lib/jornada/calendar";

export type AdminStudentProgressEntry = {
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

export type AdminStudentEvolutionEntry = {
  id: string;
  weight_kg: number | null;
  mobility_level: number | null;
  energy_level: number | null;
  pain_level: number | null;
  notes: string | null;
  created_at: string;
};

export type AdminStudentSupportTicket = {
  id: string;
  type: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  admin_notes: string | null;
};

export type AdminStudentDetail = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profileStatus: string;
  avatarUrl: string | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  mobilityLevel: number | null;
  mainGoal: string | null;
  limitations: string | null;
  createdAt: string | null;
  authCreatedAt: string | null;
  access: {
    isActive: boolean;
    daysRemaining: number;
    startsAt: string | null;
    endsAt: string | null;
    source: string | null;
    status: string | null;
  };
  progress: {
    totalCompletedDays: number;
    totalInProgressDays: number;
    progressPercentage: number;
    lastCompletedDay: number | null;
    list: AdminStudentProgressEntry[];
  };
  evolution: {
    checkins: AdminStudentEvolutionEntry[];
    currentWeightKg: number | null;
    currentMobilityLevel: number | null;
    lastCheckinAt: string | null;
  };
  supportTickets: AdminStudentSupportTicket[];
};

export async function getAdminStudentDetail(studentId: string): Promise<AdminStudentDetail | null> {
  const adminAccess = await getAdminAccess();

  if (!adminAccess.isAdmin) {
    return null;
  }

  const [{ data: authUsers }, { data: profile }, { data: accessPeriods }, { data: progress }, { data: evolutionCheckins }, { data: supportTickets }] =
    await Promise.all([
      supabaseAdmin.auth.admin.listUsers(),
      supabaseAdmin
        .from("profiles")
        .select(
          "full_name, role, status, avatar_url, age, height_cm, weight_kg, mobility_level, main_goal, limitations, created_at",
        )
        .eq("id", studentId)
        .maybeSingle(),
      supabaseAdmin
        .from("access_periods")
        .select("starts_at, ends_at, status, source")
        .eq("user_id", studentId)
        .order("ends_at", { ascending: false }),
      supabaseAdmin
        .from("student_daily_progress")
        .select("*")
        .eq("user_id", studentId)
        .order("journey_day", { ascending: true }),
      supabaseAdmin
        .from("student_evolution_checkins")
        .select("*")
        .eq("user_id", studentId)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("support_tickets")
        .select("*")
        .eq("user_id", studentId)
        .order("created_at", { ascending: false }),
    ]);

  const authUser = authUsers?.users.find((u) => u.id === studentId) ?? null;

  if (!profile && !authUser) {
    return null;
  }

  const now = new Date();
  const activeAccess = (accessPeriods ?? []).find((a) => {
    if (a.status !== "active") return false;
    const startsAt = new Date(a.starts_at);
    const endsAt = new Date(a.ends_at);
    return startsAt <= now && endsAt >= now;
  });

  const latestAccess = (accessPeriods ?? [])[0] || null;
  const accessToUse = activeAccess ?? latestAccess;

  let daysRemaining = 0;
  let isAccessActive = false;

  if (accessToUse) {
    const startsAt = new Date(accessToUse.starts_at);
    const endsAt = new Date(accessToUse.ends_at);
    daysRemaining = getAccessDaysRemaining(endsAt);
    isAccessActive = daysRemaining > 0 && accessToUse.status === "active" && startsAt <= now && endsAt >= now;
  }

  const progressList = (progress ?? []) as AdminStudentProgressEntry[];
  const totalCompletedDays = progressList.filter((p) => p.status === "completed").length;
  const totalInProgressDays = progressList.filter((p) => p.status === "in_progress").length;
  const progressPercentage = Math.round((totalCompletedDays / 30) * 100);
  const lastCompletedDay =
    progressList
      .filter((p) => p.status === "completed")
      .sort((a, b) => b.journey_day - a.journey_day)[0]?.journey_day ?? null;

  const evolutionList = (evolutionCheckins ?? []) as AdminStudentEvolutionEntry[];
  const sortedEvolution = [...evolutionList].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const latestCheckinWithWeight = sortedEvolution.find((c) => c.weight_kg !== null) ?? null;
  const latestCheckinWithMobility = sortedEvolution.find((c) => c.mobility_level !== null) ?? null;

  const currentWeightKg = latestCheckinWithWeight?.weight_kg ?? profile?.weight_kg ?? null;
  const currentMobilityLevel = latestCheckinWithMobility?.mobility_level ?? profile?.mobility_level ?? null;
  const lastCheckinAt = sortedEvolution[0]?.created_at ?? null;

  return {
    id: studentId,
    fullName: profile?.full_name ?? authUser?.email?.split("@")[0] ?? "Aluno",
    email: authUser?.email ?? "",
    role: profile?.role ?? "student",
    profileStatus: profile?.status ?? "active",
    avatarUrl: profile?.avatar_url ?? null,
    age: profile?.age ?? null,
    heightCm: profile?.height_cm ?? null,
    weightKg: profile?.weight_kg ?? null,
    mobilityLevel: profile?.mobility_level ?? null,
    mainGoal: profile?.main_goal ?? null,
    limitations: profile?.limitations ?? null,
    createdAt: profile?.created_at ?? null,
    authCreatedAt: authUser?.created_at ?? null,
    access: {
      isActive: isAccessActive,
      daysRemaining,
      startsAt: accessToUse?.starts_at ?? null,
      endsAt: accessToUse?.ends_at ?? null,
      source: accessToUse?.source ?? null,
      status: accessToUse?.status ?? null,
    },
    progress: {
      totalCompletedDays,
      totalInProgressDays,
      progressPercentage,
      lastCompletedDay,
      list: progressList,
    },
    evolution: {
      checkins: evolutionList,
      currentWeightKg,
      currentMobilityLevel,
      lastCheckinAt,
    },
    supportTickets: (supportTickets ?? []) as AdminStudentSupportTicket[],
  };
}
