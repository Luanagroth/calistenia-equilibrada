import "server-only";

import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { getAccessDaysRemaining } from "@/lib/jornada/calendar";

export type StudentAccess = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profileStatus: string;
  accessStatus: string | null;
  startsAt: string | null;
  endsAt: string | null;
  source: string | null;
  daysRemaining: number;
  isAccessActive: boolean;
};

export async function getStudents(): Promise<StudentAccess[]> {
  const adminAccess = await getAdminAccess();

  if (!adminAccess.isAdmin) {
    return [];
  }

  const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
  const authUsers = usersData?.users ?? [];

  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, role, status")
    .eq("role", "student");

  const { data: accessPeriods } = await supabaseAdmin
    .from("access_periods")
    .select("user_id, starts_at, ends_at, status, source")
    .order("ends_at", { ascending: false });

  const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);
  const accessByUser = new Map<string, typeof accessPeriods>();
  for (const access of accessPeriods ?? []) {
    const existing = accessByUser.get(access.user_id);
    if (!existing) {
      accessByUser.set(access.user_id, [access]);
    } else {
      existing.push(access);
    }
  }

  const now = new Date();

  return authUsers
    .filter((u) => u.email)
    .map((u) => {
      const profile = profileMap.get(u.id);
      const accesses = accessByUser.get(u.id) ?? [];

      const activeAccess = accesses.find((a) => {
        if (a.status !== "active") return false;
        const startsAt = new Date(a.starts_at);
        const endsAt = new Date(a.ends_at);
        return startsAt <= now && endsAt >= now;
      });

      const latestAccess = accesses[0];

      const accessToUse = activeAccess ?? latestAccess;

      let daysRemaining = 0;
      let isAccessActive = false;

      if (accessToUse) {
        const startsAt = new Date(accessToUse.starts_at);
        const endsAt = new Date(accessToUse.ends_at);
        const now = new Date();
        daysRemaining = getAccessDaysRemaining(endsAt);
        isAccessActive = daysRemaining > 0 && accessToUse.status === "active" && startsAt <= now && endsAt >= now;
      }

      return {
        id: u.id,
        fullName: profile?.full_name ?? u.email!.split("@")[0],
        email: u.email!,
        role: profile?.role ?? "student",
        profileStatus: profile?.status ?? "active",
        accessStatus: accessToUse?.status ?? null,
        startsAt: accessToUse?.starts_at ?? null,
        endsAt: accessToUse?.ends_at ?? null,
        source: accessToUse?.source ?? null,
        daysRemaining,
        isAccessActive,
      };
    });
}
