import { createClient } from "@/lib/supabase/server";

export type AdminAccess = {
  user: { id: string; email: string } | null;
  profile: { full_name: string; role: string; status: string } | null;
  isAdmin: boolean;
};

export async function getAdminAccess(): Promise<AdminAccess> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null, isAdmin: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, status")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  return {
    user: { id: user.id, email: user.email ?? "" },
    profile: profile ?? null,
    isAdmin,
  };
}
