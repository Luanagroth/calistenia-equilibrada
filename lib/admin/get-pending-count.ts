import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getPendingStudentsCount(): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from("payment_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) {
    return 0;
  }

  return count ?? 0;
}