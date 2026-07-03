"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";

const TEMP_PASSWORD = "calistenia123";

export async function approvePendingStudentAction(formData: FormData) {
  const studentId = formData.get("studentId") as string;

  if (!studentId) {
    redirect(`/admin/alunos/pendentes?error=invalid-id`);
  }

  const { data: student, error: fetchError } = await supabaseAdmin
    .from("payment_requests")
    .select("email, name")
    .eq("id", studentId)
    .single();

  if (fetchError || !student) {
    redirect(`/admin/alunos/pendentes?error=student-not-found`);
  }

  const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: student.email,
    password: TEMP_PASSWORD,
    email_confirm: true,
  });

  if (createError || !authUser.user) {
    redirect(`/admin/alunos/pendentes?error=create-failed`);
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: authUser.user.id,
    full_name: student.name,
    role: "student",
    status: "active",
  });

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    redirect(`/admin/alunos/pendentes?error=profile-failed`);
  }

  const now = new Date();
  const endsAt = new Date();
  endsAt.setDate(endsAt.getDate() + 45);

  const { error: accessError } = await supabaseAdmin.from("access_periods").insert({
    user_id: authUser.user.id,
    starts_at: now.toISOString(),
    ends_at: endsAt.toISOString(),
    status: "active",
    source: "manual_approval",
  });

  if (accessError) {
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    redirect(`/admin/alunos/pendentes?error=access-failed`);
  }

  const { error: updateError } = await supabaseAdmin
    .from("payment_requests")
    .update({ status: "approved" })
    .eq("id", studentId);

  if (updateError) {
    redirect(`/admin/alunos/pendentes?error=update-failed`);
  }

  redirect(`/admin/alunos?success=student-approved`);
}