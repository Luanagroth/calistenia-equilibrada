import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { getAccessDaysRemaining, isValidTrainingDay, getNextValidTrainingDate, getBrazilDateKey } from "@/lib/jornada/calendar";

export type AdminDashboardStats = {
  totalStudents: number;
  activeStudents: number;
  expiredStudents: number;
  blockedStudents: number;
  openTickets: number;
  reviewingTickets: number;
  answeredTickets: number;
  closedTickets: number;
  totalCompletedDays: number;
  expiringSoonCount: number;
  upcomingExpirations: {
    studentName: string;
    daysRemaining: number;
    plan: string;
  }[];
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const adminAccess = await getAdminAccess();

  if (!adminAccess.isAdmin) {
    return {
      totalStudents: 0,
      activeStudents: 0,
      expiredStudents: 0,
      blockedStudents: 0,
      openTickets: 0,
      reviewingTickets: 0,
      answeredTickets: 0,
      closedTickets: 0,
      totalCompletedDays: 0,
      expiringSoonCount: 0,
      upcomingExpirations: [],
    };
  }

  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, status")
    .eq("role", "student");

  const { data: accessPeriods } = await supabaseAdmin
    .from("access_periods")
    .select("user_id, starts_at, ends_at, status, source")
    .order("ends_at", { ascending: false });

  const { data: tickets } = await supabaseAdmin
    .from("support_tickets")
    .select("status")
    .order("created_at", { ascending: false });

  const { data: progress } = await supabaseAdmin
    .from("student_daily_progress")
    .select("user_id, status, journey_day")
    .eq("status", "completed");

  const now = new Date();

  const studentStats = (profiles ?? []).map((profile) => {
    const accesses = (accessPeriods ?? []).filter((a) => a.user_id === profile.id);
    const activeAccess = accesses.find((a) => {
      if (a.status !== "active") return false;
      const startsAt = new Date(a.starts_at);
      const endsAt = new Date(a.ends_at);
      return startsAt <= now && endsAt >= now;
    });

    let daysRemaining = 0;
    let isAccessActive = false;

    if (activeAccess) {
      const startsAt = new Date(activeAccess.starts_at);
      const endsAt = new Date(activeAccess.ends_at);
      const now = new Date();
      daysRemaining = getAccessDaysRemaining(endsAt);
      isAccessActive = daysRemaining > 0;
    }

    return {
      profileStatus: profile.status,
      isAccessActive,
      daysRemaining,
      access: activeAccess,
    };
  });

  const totalStudents = studentStats.length;
  const activeStudents = studentStats.filter((s) => s.isAccessActive && s.profileStatus !== "blocked").length;
  const expiredStudents = studentStats.filter((s) => !s.isAccessActive && s.profileStatus !== "blocked").length;
  const blockedStudents = studentStats.filter((s) => s.profileStatus === "blocked").length;
  const expiringSoonCount = studentStats.filter((s) => s.isAccessActive && s.profileStatus !== "blocked" && s.daysRemaining <= 20 && s.daysRemaining > 0).length;

  const ticketCounts = (tickets ?? []).reduce(
    (acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const upcomingExpirations = studentStats
    .filter((s) => s.isAccessActive && s.profileStatus !== "blocked")
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 5)
    .map((s) => ({
      studentName: s.access?.user_id ?? "Aluno",
      daysRemaining: s.daysRemaining,
      plan: "Acesso ativo",
    }));

  return {
    totalStudents,
    activeStudents,
    expiredStudents,
    blockedStudents,
    openTickets: ticketCounts["open"] || 0,
    reviewingTickets: ticketCounts["reviewing"] || 0,
    answeredTickets: ticketCounts["answered"] || 0,
    closedTickets: ticketCounts["closed"] || 0,
    totalCompletedDays: (progress ?? []).length,
    expiringSoonCount,
    upcomingExpirations,
  };
}
