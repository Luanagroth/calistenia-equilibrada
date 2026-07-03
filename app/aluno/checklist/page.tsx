import {
  CheckCircle2,
  CircleAlert,
  Medal,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStudentProgressByDay } from "@/lib/aluno/get-student-progress";
import { getJourneyAvailability } from "@/lib/jornada/progress-rules";
import { getTrainingDayPlan } from "@/lib/jornada/training-plan";
import { ChecklistForm } from "./checklist-form";

function getCurrentStatus({
  hasInProgress,
  isCompleted,
  isBlocked,
}: {
  hasInProgress: boolean;
  isCompleted: boolean;
  isBlocked: boolean;
}) {
  if (isCompleted && isBlocked) {
    return "Bloqueado";
  }

  if (hasInProgress) {
    return "Em andamento";
  }

  if (isCompleted) {
    return "Concluido";
  }

  if (isBlocked) {
    return "Bloqueado";
  }

  return "Liberado";
}

function getStatusClasses(status: string) {
  switch (status) {
    case "Concluido":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "Em andamento":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    case "Bloqueado":
      return "border-white/10 bg-white/5 text-slate-300";
    default:
      return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
  }
}

function getExerciseChecks(checklist: Record<string, unknown>) {
  const raw = checklist.exercises;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {} as Record<string, boolean>;
  }

  return Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, Boolean(value)])
  ) as Record<string, boolean>;
}

function shouldShowLockedState({
  journeyMessage,
  progressStatus,
  isNextDayLocked,
}: {
  journeyMessage: string;
  progressStatus: string | null;
  isNextDayLocked: boolean;
}) {
  return (
    isNextDayLocked &&
    progressStatus === "completed" &&
    journeyMessage.toLowerCase().includes("proximo")
  );
}

function getNextReleaseText(lockedUntilDate: string | null) {
  if (!lockedUntilDate) {
    return "O proximo treino sera liberado no proximo dia util da jornada.";
  }

  const [year, month, day] = lockedUntilDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return `Seu proximo treino sera liberado em ${date.toLocaleDateString("pt-BR")}.`;
}

export default async function ChecklistPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const journey = await getJourneyAvailability();
  const selectedDay = journey.availableDay;
  const plan = getTrainingDayPlan(selectedDay);
  const progress = await getStudentProgressByDay(selectedDay);

  if (!plan) {
    return null;
  }

  const checklist = (progress?.checklist as Record<string, unknown>) ?? {};
  const exerciseChecks = getExerciseChecks(checklist);
  const totalExerciseCount = plan.exercises.length;
  const currentProgressStatus = progress?.status ?? null;
  const energyLevel = progress?.energy_level ?? null;
  const difficultyLevel = progress?.difficulty_level ?? null;
  const painLevel = progress?.pain_level ?? null;
  const notes = progress?.notes ?? "";
  const hasPendingTraining = currentProgressStatus === "in_progress";
  const lockedState = shouldShowLockedState({
    journeyMessage: journey.message,
    progressStatus: currentProgressStatus,
    isNextDayLocked: journey.isNextDayLocked,
  });
  const currentStatus = getCurrentStatus({
    hasInProgress: hasPendingTraining,
    isCompleted: currentProgressStatus === "completed",
    isBlocked: lockedState,
  });
  const nextReleaseText = getNextReleaseText(journey.lockedUntilDate);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Jornada do dia</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Siga o treino liberado, registre sua pratica e avance no tempo certo.
          </p>
        </div>
      </div>

      {params.success === "progress-saved" && (
        <Card className="border-emerald-400/20 bg-emerald-400/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-300">Progresso salvo com sucesso.</p>
              <p className="text-xs text-slate-300">Seus exercicios marcados e anotacoes continuam salvos.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {params.success === "training-completed" && (
        <Card className="border-emerald-400/20 bg-emerald-400/5">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
                <Medal className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-emerald-300">Treino concluido. Voce se saiu muito bem!</p>
                <p className="text-xs text-slate-300">
                  Mais uma etapa da sua jornada foi registrada. Continue assim - constancia vale mais do que pressa.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Proximo passo</p>
              <p className="mt-2 text-sm text-slate-200">{nextReleaseText}</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <p className="text-sm font-semibold text-emerald-200">🏅 Medalha de persistencia</p>
              <p className="mt-1 text-xs text-slate-300">Voce concluiu mais um treino da Jornada 30 Treinos.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {params.error && (
        <Card className="border-rose-400/20 bg-rose-400/5">
          <CardContent className="flex items-center gap-3 p-4 text-sm text-rose-200">
            <CircleAlert className="h-5 w-5 shrink-0 text-rose-300" />
            <span>
              {params.error === "incomplete-main-steps" &&
                "Conclua os exercicios principais antes de finalizar o treino."}
              {params.error === "day-locked" &&
                "Esse treino nao esta liberado agora. Continue no treino acionavel da jornada."}
              {params.error === "invalid-day" &&
                "Nao foi possivel identificar o treino atual da jornada."}
              {params.error === "save-error" &&
                "Nao foi possivel salvar seu progresso agora. Tente novamente."}
            </span>
          </CardContent>
        </Card>
      )}

      {lockedState ? (
        <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
          <CardContent className="space-y-5 p-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Proximo treino no tempo certo</h3>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
                Voce ja concluiu o treino disponivel. O proximo treino libera no proximo dia util da jornada.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Link href="/aluno/evolucao">Ver evolucao</Link>
              </Button>
              <Button asChild className="bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
                <Link href="/aluno/materiais">Ver materiais</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ChecklistForm
          checklist={checklist}
          currentStatus={currentStatus}
          difficultyLevel={difficultyLevel}
          energyLevel={energyLevel}
          hasPendingTraining={hasPendingTraining}
          initialExerciseChecks={exerciseChecks}
          journeyMessage={journey.message}
          notes={notes}
          painLevel={painLevel}
          plan={plan}
          selectedDay={selectedDay}
          totalExerciseCount={totalExerciseCount}
        />
      )}
    </div>
  );
}
