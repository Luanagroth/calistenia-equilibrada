import { ArrowRight, Award, Bell, Clock, Dumbbell, Flame, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { InstallPromptBanner } from "@/components/install-prompt-dashboard";
import { getStudentProgressByDay, getStudentProgressSummary } from "@/lib/aluno/get-student-progress";
import { getUnreadStudentNotificationsCount } from "@/lib/aluno/get-student-notifications";
import { getBrazilDateKey } from "@/lib/jornada/calendar";
import { getJourneyAvailability } from "@/lib/jornada/progress-rules";
import { getTrainingDayPlan } from "@/lib/jornada/training-plan";

const levelRanges = [
  { min: 0, max: 4, label: "Iniciante", nextLevelAt: 5 },
  { min: 5, max: 9, label: "Em adaptacao", nextLevelAt: 10 },
  { min: 10, max: 14, label: "Constante", nextLevelAt: 15 },
  { min: 15, max: 19, label: "Intermediario", nextLevelAt: 20 },
  { min: 20, max: 24, label: "Evoluindo bem", nextLevelAt: 25 },
  { min: 25, max: 29, label: "Avancando", nextLevelAt: 30 },
  { min: 30, max: 30, label: "Jornada concluida", nextLevelAt: null },
] as const;

function formatDateKeyPtBr(dateKey: string | null) {
  if (!dateKey) {
    return null;
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
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

function getJourneyCardState({
  journey,
  progressStatus,
  completedToday,
  completedExerciseCount,
}: {
  journey: Awaited<ReturnType<typeof getJourneyAvailability>>;
  progressStatus: string | null;
  completedToday: boolean;
  completedExerciseCount: number;
}) {
  if (completedToday && progressStatus === "completed") {
    return "Concluido hoje";
  }

  if (progressStatus === "in_progress") {
    return completedExerciseCount > 0 ? "Em andamento" : "Pendente";
  }

  if (journey.isNextDayLocked) {
    return "Bloqueado";
  }

  return "Liberado";
}

function getJourneyBadgeClassName(status: string) {
  switch (status) {
    case "Concluido hoje":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "Em andamento":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    case "Pendente":
      return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
    case "Bloqueado":
      return "border-white/10 bg-white/5 text-slate-300";
    default:
      return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
  }
}

function getJourneyMessage({
  status,
  lockedUntilDate,
}: {
  status: string;
  lockedUntilDate: string | null;
}) {
  if (status === "Pendente") {
    return "Voce tem um treino pendente para finalizar.";
  }

  if (status === "Bloqueado" || status === "Concluido hoje") {
    return `Proximo treino libera em ${formatDateKeyPtBr(lockedUntilDate) ?? "breve"}.`;
  }

  if (status === "Em andamento") {
    return "Continue de onde voce parou na sua jornada.";
  }

  return "Seu treino de hoje ja esta liberado para seguir em frente.";
}

function getCurrentLevel(totalCompletedDays: number) {
  return (
    levelRanges.find((range) => totalCompletedDays >= range.min && totalCompletedDays <= range.max) ??
    levelRanges[0]
  );
}

function getCurrentLevelMessage(totalCompletedDays: number) {
  const currentLevel = getCurrentLevel(totalCompletedDays);

  if (currentLevel.nextLevelAt === null) {
    return "Voce concluiu a Jornada 30 Treinos.";
  }

  const remaining = currentLevel.nextLevelAt - totalCompletedDays;
  return `Faltam ${remaining} treino${remaining === 1 ? "" : "s"} para o proximo nivel.`;
}

export default async function DashboardPage() {
  const [summary, journey, unreadCount] = await Promise.all([
    getStudentProgressSummary(),
    getJourneyAvailability(),
    getUnreadStudentNotificationsCount(),
  ]);

  const plan = getTrainingDayPlan(journey.availableDay);
  const progress = await getStudentProgressByDay(journey.availableDay);

  if (!plan) {
    return null;
  }

  const checklist = (progress?.checklist as Record<string, unknown>) ?? {};
  const exerciseChecks = getExerciseChecks(checklist);
  const totalExerciseCount = plan.exercises.length;
  const completedExerciseCount = plan.exercises.filter((exercise) => exerciseChecks[exercise.id]).length;
  const progressValue =
    totalExerciseCount === 0 ? 0 : Math.round((completedExerciseCount / totalExerciseCount) * 100);
  const progressStatus = progress?.status ?? null;
  const completedToday =
    progressStatus === "completed" &&
    progress?.completed_at != null &&
    getBrazilDateKey(new Date(progress.completed_at)) === journey.todayDateKey;
  const journeyStatus = getJourneyCardState({
    journey,
    progressStatus,
    completedToday,
    completedExerciseCount,
  });
  const journeyMessage = getJourneyMessage({
    status: journeyStatus,
    lockedUntilDate: journey.lockedUntilDate,
  });
  const currentLevel = getCurrentLevel(summary.totalCompletedDays);
  const currentLevelMessage = getCurrentLevelMessage(summary.totalCompletedDays);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vinda a sua jornada</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Foco em mobilidade, controle e constancia. Cada dia e um passo para o equilibrio do seu corpo e da sua mente.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/aluno/notificacoes" className="relative">
            <Button variant="outline" size="icon" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Bell className="h-4 w-4" />
            </Button>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-slate-950">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
          <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
            Dia {String(journey.availableDay).padStart(2, "0")} de 30
          </Badge>
          <Button asChild className="bg-emerald-400 text-slate-950 hover:bg-emerald-400/90">
            <Link href="/aluno/checklist">
              Iniciar treino de hoje
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Progresso</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{summary.progressPercentage}%</div>
            <Progress
              value={summary.progressPercentage}
              className="mt-3 h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-emerald-400"
            />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Sequencia atual</CardTitle>
            <Flame className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{summary.totalCompletedDays} dias</div>
            <p className="text-xs text-slate-400">Treinos concluidos na jornada</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tempo estimado</CardTitle>
            <Clock className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{plan.duration}</div>
            <p className="text-xs text-slate-400">Para o treino atual</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Conquista</CardTitle>
            <Award className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-300">{currentLevel.label}</div>
            <p className="text-xs text-emerald-300">Nivel atual</p>
            <p className="mt-2 text-xs text-slate-400">{currentLevelMessage}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Dumbbell className="h-5 w-5 text-emerald-400" />
              Treino de hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-white">
                Dia {String(plan.day).padStart(2, "0")} - {plan.title}
              </h3>
              <p className="mt-2 text-sm text-slate-300">{plan.focus}</p>
            </div>
            <ul className="space-y-3">
              {plan.exercises.map((exercise) => (
                <li key={exercise.id} className="flex items-center gap-3 text-sm text-slate-200">
                  <span className="flex size-2 shrink-0 rounded-full bg-emerald-400" />
                  {exercise.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/20">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg text-white">Jornada de hoje</CardTitle>
              <Badge className="border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
                Treino {plan.day}/30
              </Badge>
              <Badge className={getJourneyBadgeClassName(journeyStatus)}>{journeyStatus}</Badge>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">{plan.title}</h3>
              <p className="text-sm text-slate-300">{journeyMessage}</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">
                  {completedExerciseCount} de {totalExerciseCount} exercicios concluidos
                </span>
                <span className="font-medium text-emerald-300">{progressValue}%</span>
              </div>
              <Progress
                value={progressValue}
                className="h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-yellow-400"
              />
            </div>

            {journeyStatus === "Bloqueado" || journeyStatus === "Concluido hoje" ? (
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20 hover:bg-yellow-300"
                >
                  <Link href="/aluno/evolucao">Ver evolucao</Link>
                </Button>
                <Link
                  href="/aluno/materiais"
                  className="block text-center text-sm font-medium text-slate-300 transition hover:text-yellow-300"
                >
                  Ver materiais
                </Link>
              </div>
            ) : (
              <Button
                asChild
                className="w-full bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20 hover:bg-yellow-300"
              >
                <Link href="/aluno/checklist">Abrir jornada</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      <InstallPromptBanner storageKey="install-prompt-dismissed-student" />
    </div>
  );
}
