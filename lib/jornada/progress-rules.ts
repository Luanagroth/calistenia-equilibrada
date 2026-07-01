import { getStudentProgressByDay, getStudentProgressSummary } from "@/lib/aluno/get-student-progress";
import {
  getBrazilDateKey,
  isValidTrainingDay,
  getNextValidTrainingDate,
} from "./calendar";

export type JourneyAvailability = {
  availableDay: number;
  suggestedDay: number;
  isNextDayLocked: boolean;
  lockedUntilDate: string | null;
  todayDateKey: string;
  message: string;
  isJourneyCompleted: boolean;
};

export async function getJourneyAvailability(): Promise<JourneyAvailability> {
  const summary = await getStudentProgressSummary();
  const todayDateKey = getBrazilDateKey();

  const inProgress = summary.progressList.find((p) => p.status === "in_progress");
  const lastCompleted = summary.progressList
    .filter((p) => p.status === "completed")
    .sort((a, b) => b.journey_day - a.journey_day)[0];

  if (summary.totalCompletedDays >= 30) {
    return {
      availableDay: 30,
      suggestedDay: 30,
      isNextDayLocked: true,
      lockedUntilDate: null,
      todayDateKey,
      message: "Você completou a jornada de 30 dias!",
      isJourneyCompleted: true,
    };
  }

  if (inProgress) {
    return {
      availableDay: inProgress.journey_day,
      suggestedDay: inProgress.journey_day,
      isNextDayLocked: false,
      lockedUntilDate: null,
      todayDateKey,
      message: `Continue o dia ${String(inProgress.journey_day).padStart(2, "0")} de onde parou.`,
      isJourneyCompleted: false,
    };
  }

  if (lastCompleted) {
    const lastCompletedDateKey = lastCompleted.completed_at
      ? getBrazilDateKey(new Date(lastCompleted.completed_at))
      : null;

    if (lastCompletedDateKey === todayDateKey) {
      const nextValidDate = getNextValidTrainingDate(todayDateKey);
      return {
        availableDay: lastCompleted.journey_day,
        suggestedDay: lastCompleted.journey_day,
        isNextDayLocked: true,
        lockedUntilDate: nextValidDate,
        todayDateKey,
        message: `Você já concluiu o treino de hoje. O próximo dia libera em ${formatDateKeyPtBR(nextValidDate)}.`,
        isJourneyCompleted: false,
      };
    }

    if (!isValidTrainingDay(todayDateKey)) {
      const nextValidDate = getNextValidTrainingDate(todayDateKey);
      return {
        availableDay: lastCompleted.journey_day,
        suggestedDay: lastCompleted.journey_day,
        isNextDayLocked: true,
        lockedUntilDate: nextValidDate,
        todayDateKey,
        message: `Hoje é dia de pausa. Sua jornada continua no próximo dia útil.`,
        isJourneyCompleted: false,
      };
    }

    const nextDay = lastCompleted.journey_day + 1;
    return {
      availableDay: nextDay,
      suggestedDay: nextDay,
      isNextDayLocked: false,
      lockedUntilDate: null,
      todayDateKey,
      message: `Continue sua jornada no dia ${String(nextDay).padStart(2, "0")}.`,
      isJourneyCompleted: false,
    };
  }

  if (!isValidTrainingDay(todayDateKey)) {
    const nextValidDate = getNextValidTrainingDate(todayDateKey);
    return {
      availableDay: 1,
      suggestedDay: 1,
      isNextDayLocked: true,
      lockedUntilDate: nextValidDate,
      todayDateKey,
      message: `Hoje é dia de pausa. Sua jornada começa no próximo dia útil.`,
      isJourneyCompleted: false,
    };
  }

  return {
    availableDay: 1,
    suggestedDay: 1,
    isNextDayLocked: false,
    lockedUntilDate: null,
    todayDateKey,
    message: "Comece sua jornada pelo dia 1.",
    isJourneyCompleted: false,
  };
}

function formatDateKeyPtBR(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("pt-BR");
}
