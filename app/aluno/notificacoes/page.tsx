import { getStudentNotifications } from "@/lib/aluno/get-student-notifications";
import type { StudentNotification } from "@/lib/aluno/get-student-notifications";
import NotificationsClient from "./notifications-client";

export default async function NotificacoesPage() {
  let notifications: StudentNotification[];
  try {
    notifications = await getStudentNotifications();
  } catch {
    notifications = [];
  }

  return <NotificationsClient notifications={notifications} />;
}
