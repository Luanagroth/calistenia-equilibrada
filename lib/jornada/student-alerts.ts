import { getAccessDaysRemaining, countValidTrainingDaysUntil, getBrazilDateKey } from "./calendar";

export type JourneyAlert = {
  type: "info" | "warning" | "danger" | "success";
  title: string;
  message: string;
};

function getLastActivityDate(progressList: { updated_at: string | null; completed_at: string | null; created_at: string }[]): string | null {
  if (progressList.length === 0) return null;

  const dates = progressList
    .map((p) => p.completed_at || p.updated_at || p.created_at)
    .filter((d): d is string => !!d)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return dates[0] ?? null;
}

export async function getStudentJourneyAlerts(params: {
  daysRemaining: number;
  accessEndsAt: string | Date;
  accessStartsAt: string | Date;
  progressList: Array<{
    journey_day: number;
    status: string;
    updated_at: string | null;
    completed_at: string | null;
    created_at: string;
  }>;
}): Promise<JourneyAlert[]> {
  const alerts: JourneyAlert[] = [];
  const { daysRemaining, accessEndsAt, accessStartsAt, progressList } = params;

  const completedDays = progressList.filter((p) => p.status === "completed").length;
  const remainingWorkouts = 30 - completedDays;
  const todayKey = getBrazilDateKey();
  const validTrainingDaysLeft = countValidTrainingDaysUntil(accessEndsAt);
  const lastActivityDate = getLastActivityDate(progressList);

  if (completedDays >= 30) {
    alerts.push({
      type: "success",
      title: "Jornada concluída",
      message: "Parabéns! Você concluiu os 30 dias da jornada.",
    });
    return alerts;
  }

  if (daysRemaining <= 0) {
    alerts.push({
      type: "danger",
      title: "Acesso expirado",
      message: "O período de acesso chegou ao fim.",
    });
    return alerts;
  }

  if (daysRemaining <= 7) {
    alerts.push({
      type: "danger",
      title: "Acesso quase no fim",
      message: `Seu acesso expira em ${daysRemaining} dias. Priorize os treinos pendentes.`,
    });
  } else if (daysRemaining <= 20) {
    alerts.push({
      type: "warning",
      title: "Acesso perto de expirar",
      message: `Seu acesso expira em ${daysRemaining} dias.`,
    });
  }

  if (progressList.length === 0) {
    const startDate = new Date(accessStartsAt);
    const startKey = getBrazilDateKey(startDate);
    const today = new Date(todayKey + "T00:00:00");
    const start = new Date(startKey + "T00:00:00");
    const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays >= 3) {
      alerts.push({
        type: "info",
        title: "Jornada ainda não iniciada",
        message: "Você ainda não registrou nenhum treino.",
      });
    }
  } else if (lastActivityDate) {
    const last = new Date(lastActivityDate);
    const lastKey = getBrazilDateKey(last);
    const today = new Date(todayKey + "T00:00:00");
    const lastActivity = new Date(lastKey + "T00:00:00");
    const inactiveDays = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

    if (inactiveDays >= 3) {
      alerts.push({
        type: "warning",
        title: "Você está há alguns dias sem treinar",
        message: `Você está há ${inactiveDays} dias sem registrar treino.`,
      });
    }
  }

  if (remainingWorkouts > 0 && validTrainingDaysLeft > 0 && remainingWorkouts > validTrainingDaysLeft) {
    alerts.push({
      type: "warning",
      title: "Jornada atrasada",
      message: `Você ainda tem ${remainingWorkouts} treinos para concluir e cerca de ${validTrainingDaysLeft} dias úteis disponíveis até o fim do acesso.`,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      type: "info",
      title: "Tudo certo por aqui",
      message: "Continue sua jornada no ritmo planejado.",
    });
  }

  return alerts;
}
