import { CheckCircle2, CircleAlert, Medal } from "lucide-react";
import Link from "next/link";

import { ChecklistForm } from "./checklist-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStudentProgressByDay } from "@/lib/aluno/get-student-progress";
import { getJourneyAvailability } from "@/lib/jornada/progress-rules";
import { getTrainingDayPlan } from "@/lib/jornada/training-plan";

type SearchParams = Promise<{
  success?: string;
  error?: string;
  pendingExercises?: string;
  pendingCount?: string;
}>;

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

function getExerciseChecks(checklist: Record<string, unknown>) {
  const raw = checklist.exercises;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {} as Record<string, boolean>;
  }

  return Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, Boolean(value)]),
  ) as Record<string, boolean>;
}

function getHabitChecks(checklist: Record<string, unknown>) {
  const habitKeys = [
    "hydration",
    "balancedFood",
    "naturalFoods",
    "respectedLimits",
    "rest",
    "reading",
  ] as const;

  return Object.fromEntries(habitKeys.map((key) => [key, Boolean(checklist[key])])) as Record<
    (typeof habitKeys)[number],
    boolean
  >;
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

function formatDateKeyPtBr(dateKey: string | null) {
  if (!dateKey) {
    return null;
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
}

function getNextReleaseText(lockedUntilDate: string | null) {
  if (!lockedUntilDate) {
    return "O proximo treino sera liberado no proximo dia util da jornada.";
  }

  return `Seu proximo treino sera liberado em ${formatDateKeyPtBr(lockedUntilDate)}.`;
}

export default async function ChecklistPage({
  searchParams,
}: {
  searchParams: SearchParams;
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
  const habitChecks = getHabitChecks(checklist);
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
  const pendingExercises = params.pendingExercises
    ? decodeURIComponent(params.pendingExercises)
        .split("|")
        .filter(Boolean)
    : [];
  const pendingCount = params.pendingCount ? Number(params.pendingCount) : pendingExercises.length;

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

      {params.success === "progress-saved" && pendingCount > 0 && (
        <Card className="border-amber-400/20 bg-amber-400/5">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-300 text-slate-950">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-200">
                  Seu progresso foi salvo, mas ainda falta concluir exercicio(s) deste treino.
                </p>
                <p className="text-xs text-slate-300">
                  Seus habitos, exercicios marcados, estrelas e anotacoes continuam salvos.
                </p>
              </div>
            </div>
            {pendingExercises.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Exercicios pendentes
                </p>
                <p className="mt-2 text-sm text-slate-200">{pendingExercises.join(", ")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {params.success === "progress-saved" && pendingCount === 0 && (
        <Card className="border-emerald-400/20 bg-emerald-400/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-300">Progresso salvo com sucesso.</p>
              <p className="text-xs text-slate-300">
                Seus exercicios marcados e anotacoes continuam salvos.
              </p>
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
              <p className="text-sm font-semibold text-emerald-200">Medalha de persistencia</p>
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
                Voce ja concluiu o treino disponivel. O proximo treino sera liberado em{" "}
                {formatDateKeyPtBr(journey.lockedUntilDate) ?? "breve"}.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Link href="/aluno/evolucao">Ver evolucao</Link>
              </Button>
              <Button
                asChild
                className="bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20 hover:bg-yellow-300"
              >
                <Link href="/aluno/materiais">Ver materiais</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ChecklistForm
          currentStatus={currentStatus}
          difficultyLevel={difficultyLevel}
          energyLevel={energyLevel}
          hasPendingTraining={hasPendingTraining}
          initialExerciseChecks={exerciseChecks}
          initialHabitChecks={habitChecks}
          lockedUntilLabel={formatDateKeyPtBr(journey.lockedUntilDate)}
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
