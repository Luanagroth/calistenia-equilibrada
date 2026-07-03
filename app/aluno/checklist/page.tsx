import Link from "next/link";
import {
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  Dumbbell,
  Medal,
  PlayCircle,
  Shield,
  TriangleAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { getStudentProgressByDay } from "@/lib/aluno/get-student-progress";
import { getJourneyAvailability } from "@/lib/jornada/progress-rules";
import { getTrainingDayPlan, type TrainingExercise, type TrainingExerciseCategory } from "@/lib/jornada/training-plan";
import { RatingStars } from "./rating-stars";

import { saveDailyProgressAction } from "./actions";

type HabitId = "hydration" | "balancedFood" | "naturalFoods" | "respectedLimits" | "rest" | "reading";

const categoryMeta: Record<
  TrainingExerciseCategory,
  {
    label: string;
    badgeClassName: string;
    iconClassName: string;
  }
> = {
  aquecimento: {
    label: "Aquecimento",
    badgeClassName: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    iconClassName: "text-amber-300",
  },
  mobilidade: {
    label: "Mobilidade",
    badgeClassName: "border-sky-400/20 bg-sky-400/10 text-sky-300",
    iconClassName: "text-sky-300",
  },
  estabilidade: {
    label: "Estabilidade",
    badgeClassName: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    iconClassName: "text-emerald-300",
  },
  forca: {
    label: "Forca",
    badgeClassName: "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
    iconClassName: "text-yellow-300",
  },
  alongamento: {
    label: "Alongamento",
    badgeClassName: "border-violet-400/20 bg-violet-400/10 text-violet-300",
    iconClassName: "text-violet-300",
  },
  respiracao: {
    label: "Respiracao",
    badgeClassName: "border-indigo-400/20 bg-indigo-400/10 text-indigo-300",
    iconClassName: "text-indigo-300",
  },
};

const dailyHabits: Array<{
  id: HabitId;
  title: string;
  description: string;
}> = [
  {
    id: "hydration",
    title: "Bebi agua hoje",
    description: "A hidratacao ajuda o corpo a responder melhor ao treino e a se recuperar.",
  },
  {
    id: "balancedFood",
    title: "Fiz uma alimentacao equilibrada",
    description: "Comer bem ajuda energia, foco e constancia ao longo da jornada.",
  },
  {
    id: "naturalFoods",
    title: "Inclui frutas, verduras ou alimentos naturais",
    description: "Escolhas simples no dia ajudam a sustentar sua evolucao fora do treino.",
  },
  {
    id: "respectedLimits",
    title: "Respeitei meus limites",
    description: "O treino rende mais quando voce evolui sem brigar com o corpo.",
  },
  {
    id: "rest",
    title: "Descansei ou dormi bem",
    description: "Recuperacao tambem faz parte da pratica.",
  },
  {
    id: "reading",
    title: "Li ou revisei a orientacao do dia",
    description: "Revisar a orientacao ajuda a praticar com mais clareza e intencao.",
  },
];

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

function ExerciseCard({
  exercise,
  index,
  checked,
}: {
  exercise: TrainingExercise;
  index: number;
  checked: boolean;
}) {
  const meta = categoryMeta[exercise.category];

  return (
    <Card
      className={`border-white/10 bg-[#10161A] shadow-2xl shadow-black/20 transition ${
        checked ? "border-emerald-400/30 bg-emerald-400/[0.05]" : ""
      }`}
    >
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-slate-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Badge className={meta.badgeClassName}>{meta.label}</Badge>
              {checked && (
                <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                  Concluido
                </Badge>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">{exercise.summary}</p>
            </div>
          </div>

          <Dumbbell className={`mt-1 h-5 w-5 shrink-0 ${meta.iconClassName}`} />
        </div>

        <div className="grid gap-3 text-xs text-slate-300 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Series</p>
            <p className="mt-1 font-medium text-white">{exercise.sets}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Repeticoes</p>
            <p className="mt-1 font-medium text-white">{exercise.reps}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Descanso</p>
            <p className="mt-1 font-medium text-white">{exercise.rest}</p>
          </div>
        </div>

        <details className="group rounded-2xl border border-white/10 bg-white/[0.03]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-yellow-200">
            Como fazer
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </summary>
          <div className="space-y-4 border-t border-white/10 px-4 py-4 text-sm text-slate-300">
            <div>
              <p className="font-medium text-white">Passo a passo</p>
              <ol className="mt-2 space-y-2">
                {exercise.howTo.map((step, stepIndex) => (
                  <li key={`${exercise.id}-howto-${stepIndex}`} className="flex gap-2">
                    <span className="mt-0.5 text-yellow-300">{stepIndex + 1}.</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <p className="font-medium text-white">Erros comuns</p>
              <ul className="mt-2 space-y-2">
                {exercise.commonMistakes.map((mistake) => (
                  <li key={`${exercise.id}-${mistake}`} className="flex gap-2">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    <span className="leading-relaxed">{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Adaptacao</p>
                <p className="mt-2 leading-relaxed">{exercise.adaptation}</p>
              </div>
              <div className="rounded-2xl border border-rose-400/10 bg-rose-400/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-200">Cuidados</p>
                <p className="mt-2 leading-relaxed text-slate-300">{exercise.safetyNote}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-xs text-slate-400">
              {exercise.media?.videoSrc ? (
                <div className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Video demonstrativo
                  </p>
                  <video
                    src={exercise.media.videoSrc}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full rounded-2xl border border-white/10 bg-black"
                  />
                </div>
              ) : (
                "Video demonstrativo sera adicionado em breve."
              )}
            </div>
          </div>
        </details>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-white/20">
          <Checkbox
            name={`exercise:${exercise.id}`}
            defaultChecked={checked}
            className="mt-0.5 data-checked:border-emerald-400 data-checked:bg-emerald-400"
          />
          <div>
            <p className="text-sm font-medium text-white">Concluir exercicio</p>
            <p className="mt-1 text-xs text-slate-400">
              Marque quando terminar este exercicio com boa tecnica e dentro do seu limite.
            </p>
          </div>
        </label>
      </CardContent>
    </Card>
  );
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
  const completedExerciseCount = plan.exercises.filter((exercise) => exerciseChecks[exercise.id]).length;
  const totalExerciseCount = plan.exercises.length;
  const progressPercentage = totalExerciseCount === 0 ? 0 : Math.round((completedExerciseCount / totalExerciseCount) * 100);
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

      <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-yellow-400/20 bg-yellow-400/10 text-yellow-300">
                  Treino {String(plan.day).padStart(2, "0")} de 30
                </Badge>
                <Badge className={getStatusClasses(currentStatus)}>{currentStatus}</Badge>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-white">{plan.title}</h2>
                <p className="text-sm font-medium text-yellow-200">{plan.focus}</p>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-300">{plan.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
                <Clock3 className="h-3.5 w-3.5 text-yellow-300" />
                <span>{plan.duration}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
                <PlayCircle className="h-3.5 w-3.5 text-emerald-300" />
                <span>{completedExerciseCount} de {totalExerciseCount} exercicios concluidos</span>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Progresso do treino atual</span>
              <span className="font-medium text-emerald-300">{progressPercentage}%</span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-emerald-400"
            />
            <p className="text-xs leading-relaxed text-slate-300">
              {hasPendingTraining
                ? "Voce tem um treino pendente. Continue de onde parou."
                : journey.message}
            </p>
          </div>
        </CardContent>
      </Card>

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
        <form action={saveDailyProgressAction} className="space-y-8">
          <input type="hidden" name="journeyDay" value={selectedDay} />

          <section className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-white">Exercicios de hoje</h3>
              <p className="text-sm text-slate-400">
                Faca na ordem indicada. Comece leve, respeite seus limites e marque cada exercicio ao concluir.
              </p>
            </div>

            <div className="space-y-4">
              {plan.exercises.map((exercise, index) => (
                <ExerciseCard
                  key={`${plan.day}-${exercise.id}`}
                  exercise={exercise}
                  index={index}
                  checked={exerciseChecks[exercise.id] ?? false}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-white">Checklist de habitos</h3>
              <p className="text-sm text-slate-400">
                Esses habitos ajudam a sustentar sua evolucao fora do treino.
              </p>
            </div>

            <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/20">
              <CardContent className="grid gap-3 p-5 md:grid-cols-2">
                {dailyHabits.map((habit) => (
                  <label
                    key={habit.id}
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20"
                  >
                    <Checkbox
                      name={habit.id}
                      defaultChecked={Boolean(checklist[habit.id])}
                      className="mt-0.5 data-checked:border-emerald-400 data-checked:bg-emerald-400"
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">{habit.title}</p>
                      <p className="text-xs leading-relaxed text-slate-400">{habit.description}</p>
                    </div>
                  </label>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-white">Como voce se sentiu</h3>
              <p className="text-sm text-slate-400">
                Registre como foi sua pratica. Isso ajuda voce a perceber evolucao, limites e constancia.
              </p>
            </div>

            <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/20">
              <CardContent className="grid gap-5 p-5 lg:grid-cols-2">
                <div className="space-y-4">
                  <RatingStars
                    title="Energia"
                    name="energyLevel"
                    defaultValue={energyLevel}
                    options={[
                      { value: 1, label: "Baixa" },
                      { value: 2, label: "Regular" },
                      { value: 3, label: "Boa" },
                      { value: 4, label: "Muito boa" },
                      { value: 5, label: "Excelente" },
                    ]}
                  />

                  <RatingStars
                    title="Dificuldade"
                    name="difficultyLevel"
                    defaultValue={difficultyLevel}
                    options={[
                      { value: 1, label: "Muito leve" },
                      { value: 2, label: "Leve" },
                      { value: 3, label: "Moderada" },
                      { value: 4, label: "Dificil" },
                      { value: 5, label: "Muito dificil" },
                    ]}
                  />

                  <RatingStars
                    title="Desconforto/dor"
                    name="painLevel"
                    defaultValue={painLevel}
                    options={[
                      { value: 1, label: "Baixo" },
                      { value: 2, label: "Leve" },
                      { value: 3, label: "Moderado" },
                      { value: 4, label: "Alto" },
                      { value: 5, label: "Muito alto" },
                    ]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-xs text-slate-300">Anotacoes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    defaultValue={notes}
                    placeholder="Ex: tive mais facilidade na mobilidade, senti cansaco, percebi menos desconforto..."
                    className="min-h-[220px] border-white/10 bg-white/5 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                  />
                  <p className="text-[11px] text-slate-500">
                    Esse registro e privado e ajuda voce a perceber evolucao, limites e constancia.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="submit"
              name="intent"
              value="complete"
              className="bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20"
            >
              Concluir treino
            </Button>
          </div>
        </form>
      )}

      <Card className="border-rose-400/10 bg-rose-400/5">
        <CardContent className="flex items-start gap-3 p-5">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-200">Pratique com seguranca</p>
            <p className="text-xs leading-relaxed text-slate-400">
              Dor aguda, tontura, formigamento ou desconforto intenso sao sinais para interromper o exercicio. O objetivo e evoluir com controle, nao forcar o corpo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
