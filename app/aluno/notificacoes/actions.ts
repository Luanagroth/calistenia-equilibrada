"use server";

import { revalidatePath } from "next/cache";
import { markStudentNotificationAsRead } from "@/lib/aluno/get-student-notifications";

export async function markStudentNotificationAsReadAction(formData: FormData): Promise<void> {
  const notificationId = formData.get("notificationId");
  if (typeof notificationId !== "string" || !notificationId.trim()) {
    return;
  }

  try {
    await markStudentNotificationAsRead(notificationId.trim());
  } catch {
    // silent fail for notification read tracking
  }

  revalidatePath("/aluno/notificacoes");
}
