import "server-only";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type StudentNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  read_at: string | null;
  created_at: string;
};

export async function getStudentNotifications(): Promise<StudentNotification[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("student_notifications")
    .select("id, title, message, type, read_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data ?? []) as StudentNotification[];
}

export async function getUnreadStudentNotificationsCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return 0;
  }

  const { count } = await supabase
    .from("student_notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .is("read_at", null);

  return count ?? 0;
}

export async function markStudentNotificationAsRead(notificationId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("student_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", user.id);
}
