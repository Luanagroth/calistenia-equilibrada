import { createClient } from "@/lib/supabase/server";
import { getAccessDaysRemaining } from "@/lib/jornada/calendar";

export type UserAccess = {
  user: { id: string; email: string } | null;
  profile: { full_name: string | null; role: string; status: string; avatar_url: string | null } | null;
  access: { id: string; starts_at: string; ends_at: string; status: string } | null;
  isActive: boolean;
  daysRemaining: number;
};

export async function getUserAccess(): Promise<UserAccess> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null, access: null, isActive: false, daysRemaining: 0 };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, status, avatar_url")
    .eq("id", user.id)
    .single();

  const { data: access } = await supabase
    .from("access_periods")
    .select("id, starts_at, ends_at, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .lte("starts_at", new Date().toISOString())
    .gte("ends_at", new Date().toISOString())
    .order("ends_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let isActive = false;
  let daysRemaining = 0;

  if (profile?.role === "admin") {
    isActive = true;
    daysRemaining = 999;
  } else if (access) {
    daysRemaining = getAccessDaysRemaining(access.ends_at);
    isActive = daysRemaining > 0;
  }

  return {
    user: { id: user.id, email: user.email ?? "" },
    profile: profile ?? null,
    access: access ?? null,
    isActive,
    daysRemaining,
  };
}
