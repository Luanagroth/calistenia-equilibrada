"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/auth/get-user-access";

export async function createSupportTicketAction(formData: FormData): Promise<void> {
  const access = await getUserAccess();

  if (!access.user || !access.isActive) {
    redirect("/acesso-expirado");
  }

  const type = (formData.get("type") as string | null)?.trim();
  const subject = (formData.get("subject") as string | null)?.trim();
  const message = (formData.get("message") as string | null)?.trim();

  if (!type) {
    redirect("/aluno/suporte?error=missing-type");
  }

  if (!subject || subject.length < 3) {
    redirect("/aluno/suporte?error=missing-subject");
  }

  if (!message || message.length < 10) {
    redirect("/aluno/suporte?error=missing-message");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("support_tickets").insert({
    user_id: access.user.id,
    type,
    subject,
    message,
    status: "open",
  });

  if (error) {
    redirect("/aluno/suporte?error=ticket-error");
  }

  revalidatePath("/aluno/suporte");
  redirect("/aluno/suporte?success=ticket-created");
}
