import { ArrowLeft, CheckCircle2, Dumbbell, Droplets, Footprints, HeartPulse, Lightbulb, Moon, Shield, TrendingUp, Trophy, Lock as LockIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { getStudentProgressByDay, getStudentProgressSummary } from "@/lib/aluno/get-student-progress";
import { getJourneyAvailability } from "@/lib/jornada/progress-rules";
import { getTrainingDayPlan } from "@/lib/jornada/training-plan";
import { saveDailyProgressAction } from "./actions";

type HabitId = "warmup" | "mobility" | "strength" | "stretching" | "breathing" | "reading";

const habits: { id: HabitId; title: string; description: string; icon: React.ReactNode }[] = [
  {
    id: "warmup",
    title: "Aquecimento feito",
    description: "Completei o aquecimento preparatório do dia.",
    icon: <TrendingUp className="h-4 w-4 text-yellow-400" />,
  },
  {
    id: "mobility",
    title: "Mobilidade feita",
    description: "Pelo menos os exercícios de mobilidade do dia.",
    icon: <TrendingUp className="h-4 w-4 text-sky-400" />,
  },
  {
    id: "strength",
    title: "Força/controle corporal feito",
    description: "Completei a sessão principal de força.",
    icon: <Dumbbell className="h-4 w-4 text-amber-400" />,
  },
  {
    id: "stretching",
    title: "Alongamento feito",
    description: "Finalizei com os alongamentos indicados.",
    icon: <HeartPulse className="h-4 w-4 text-emerald-400" />,
  },
  {
    id: "breathing",
    title: "Respiração/relaxamento feito",
    description: "Reservei um momento para respiração e relaxamento.",
    icon: <Moon className="h-4 w-4 text-indigo-400" />,
  },
  {
    id: "reading",
    title: "Leitura/orientação do dia feita",
    description: "Li a orientação e o conteúdo do dia.",
    icon: <Lightbulb className="h-4 w-4 text-violet-400" />,
  },
];

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR");
}

function isDayLocked(day: number, journey: {
  availableDay: number;
  suggestedDay: number;
  isNextDayLocked: boolean;
  lockedUntilDate: string | null;
  todayDateKey: string;
  message: string;
  isJourneyCompleted: boolean;
}, progressList: { journey_day: number; status: string }[]): boolean {
  if (day === journey.availableDay && !journey.isNextDayLocked) return false;

  const dayProgress = progressList.find((p) => p.journey_day === day);
  if (dayProgress?.status === "in_progress") return false;
  if (dayProgress?.status === "completed") return false;

  if (day < journey.availableDay) return false;

  return true;
}

export default async function ChecklistPage({
  searchParams,
}: {
  searchParams: Promise<{ dia?: string; success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const dayParam = params.dia;
  const selectedDay = dayParam ? Math.min(30, Math.max(1, parseInt(dayParam, 10) || 1)) : 1;

  const progress = await getStudentProgressByDay(selectedDay);
  const summary = await getStudentProgressSummary();
  const journey = await getJourneyAvailability();

  const checklist = (progress?.checklist as Record<string, boolean>) ?? {};
  const energyLevel = progress?.energy_level ?? null;
  const difficultyLevel = progress?.difficulty_level ?? null;
  const painLevel = progress?.pain_level ?? null;
  const notes = progress?.notes ?? "";

  const completedHabits = habits.filter((h) => checklist[h.id]).length;
  const totalHabits = habits.length;
  const progressPercentage = Math.round((completedHabits / totalHabits) * 100);

  const dayNumbers = Array.from({ length: 30 }, (_, i) => i + 1);

  const locked = isDayLocked(selectedDay, journey, summary.progressList);
  const showLockedError = params.error === "day-locked";

  const getDayLabel = (day: number) => {
    const dayProgress = summary.progressList.find((p) => p.journey_day === day);
    if (dayProgress?.status === "completed") return "Concluído";
    if (dayProgress?.status === "in_progress") return "Em andamento";
    if (isDayLocked(day, journey, summary.progressList)) return "Bloqueado";
    return "Pendente";
  };

  const getDayBadgeVariant = (day: number) => {
    const dayProgress = summary.progressList.find((p) => p.journey_day === day);
    if (dayProgress?.status === "completed") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    if (dayProgress?.status === "in_progress") return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    if (isDayLocked(day, journey, summary.progressList)) return "border-white/10 bg-white/5 text-slate-500";
    return "border-white/10 bg-white/5 text-slate-300";
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Jornada do dia</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Registre sua prática, acompanhe sua evolução e avance no tempo certo.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-yellow-400/30 bg-yellow-400/10 text-yellow-300">
            Dia {String(selectedDay).padStart(2, "0")} de 30
          </Badge>
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
              <p className="text-xs text-slate-300">Seus hábitos e métricas foram registrados.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {showLockedError && (
        <Card className="border-amber-400/20 bg-amber-400/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
              <LockIcon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-300">Dia bloqueado</p>
              <p className="text-xs text-slate-300">Esse dia ainda não está liberado. Continue a jornada no próximo dia válido.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {locked && selectedDay !== journey.availableDay && (
        <Card className="border-amber-400/20 bg-amber-400/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
              <LockIcon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-300">Dia bloqueado</p>
              <p className="text-xs text-slate-300">{journey.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="text-lg text-white">Selecione o dia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {dayNumbers.map((day) => (
              <Link
                key={day}
                href={`/aluno/checklist?dia=${day}`}
                className={`flex h-9 min-w-[2.5rem] items-center justify-center rounded-lg border px-3 text-xs transition ${
                  selectedDay === day
                    ? "border-yellow-400 bg-yellow-400/10 text-yellow-300"
                    : `${getDayBadgeVariant(day)}`
                }`}
              >
                {String(day).padStart(2, "0")}
              </Link>
            ))}
          </div>
          {locked && (
            <p className="mt-2 text-[11px] text-amber-400">
              {journey.message}
            </p>
          )}
        </CardContent>
      </Card>

      {(() => {
        const plan = getTrainingDayPlan(selectedDay);

        if (!plan) return null;

        return (
          <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">
                  Treino de hoje — Dia {String(plan.day).padStart(2, "0")}
                </CardTitle>
                <Badge className="border-yellow-400/30 bg-yellow-400/10 text-yellow-300">
                  {plan.duration}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">{plan.focus}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-300">{plan.description}</p>

              <div className="space-y-3">
                {plan.steps.map((step) => (
                  <div key={step.label} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-[10px] font-semibold text-yellow-400">
                      {step.label.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">{step.label}</p>
                      <p className="text-xs text-slate-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-1">
                <p className="text-[11px] font-medium text-slate-300">Adaptação recomendada</p>
                <p className="text-[11px] text-slate-400">{plan.adaptation}</p>
              </div>

              <div className="rounded-xl border border-rose-400/10 bg-rose-400/5 p-3 space-y-1">
                <p className="text-[11px] font-medium text-rose-300">Cuidado</p>
                <p className="text-[11px] text-slate-400">{plan.safetyNote}</p>
              </div>

              {locked && (
                <div className="rounded-xl border border-amber-400/10 bg-amber-400/5 p-3">
                  <p className="text-xs text-amber-300">
                    Você pode visualizar o roteiro, mas o registro só será liberado no próximo dia válido.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })()}

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Sua consistência no dia {String(selectedDay).padStart(2, "0")}</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-white">
              {completedHabits} de {totalHabits} hábitos concluídos
            </div>
            <div className="text-sm text-slate-400">{progressPercentage}%</div>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-emerald-400" />
          <p className="text-xs text-slate-400 italic">
            Você está criando ritmo. Continue sem pressa.
          </p>
        </CardContent>
      </Card>

      {locked ? (
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-10">
            <LockIcon className="h-10 w-10 text-amber-400" />
            <p className="text-sm font-medium text-white">Dia bloqueado</p>
            <p className="text-xs text-slate-400 text-center max-w-md">{journey.message}</p>
            {journey.lockedUntilDate && (
              <p className="text-[11px] text-slate-500">
                Liberação prevista: {new Date(journey.lockedUntilDate + "T00:00:00").toLocaleDateString("pt-BR")}
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <form action={saveDailyProgressAction} className="grid gap-6 lg:grid-cols-2">
          <input type="hidden" name="journeyDay" value={selectedDay} />

          <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
            <CardHeader>
              <CardTitle className="text-lg text-white">Hábitos do dia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {habits.map((habit) => (
                  <label
                    key={habit.id}
                    className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:border-white/10 cursor-pointer"
                  >
                    <Checkbox
                      name={habit.id}
                      defaultChecked={checklist[habit.id] ?? false}
                      className="mt-0.5 data-checked:bg-emerald-400 data-checked:border-emerald-400"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
                          {habit.icon}
                          {habit.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{habit.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
              <CardHeader>
                <CardTitle className="text-lg text-white">Como você se sentiu hoje?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="energyLevel" className="text-xs text-slate-300">Nível de energia (1 a 5)</Label>
                  <select
                    id="energyLevel"
                    name="energyLevel"
                    defaultValue={energyLevel ?? ""}
                    className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-slate-200 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20 outline-none"
                  >
                    <option value="">Selecione...</option>
                    <option value="1">1 - Muito baixa</option>
                    <option value="2">2 - Baixa</option>
                    <option value="3">3 - Regular</option>
                    <option value="4">4 - Boa</option>
                    <option value="5">5 - Muito boa</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficultyLevel" className="text-xs text-slate-300">Nível de dificuldade (1 a 5)</Label>
                  <select
                    id="difficultyLevel"
                    name="difficultyLevel"
                    defaultValue={difficultyLevel ?? ""}
                    className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-slate-200 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20 outline-none"
                  >
                    <option value="">Selecione...</option>
                    <option value="1">1 - Muito fácil</option>
                    <option value="2">2 - Fácil</option>
                    <option value="3">3 - Moderado</option>
                    <option value="4">4 - Difícil</option>
                    <option value="5">5 - Muito difícil</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="painLevel" className="text-xs text-slate-300">Nível de dor/desconforto (0 a 5)</Label>
                  <select
                    id="painLevel"
                    name="painLevel"
                    defaultValue={painLevel ?? ""}
                    className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-slate-200 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20 outline-none"
                  >
                    <option value="">Selecione...</option>
                    <option value="0">0 - Sem dor</option>
                    <option value="1">1 - Muito leve</option>
                    <option value="2">2 - Leve</option>
                    <option value="3">3 - Moderado</option>
                    <option value="4">4 - Intenso</option>
                    <option value="5">5 - Muito intenso</option>
                  </select>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="notes" className="text-xs text-slate-300">Anotações do dia</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    defaultValue={notes}
                    placeholder="Ex: senti mais mobilidade no quadril, tive dificuldade na prancha, dormi pouco..."
                    className="min-h-[100px] border-white/10 bg-white/5 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                  />
                  <p className="text-[11px] text-slate-500">
                    Este registro é privado e ajuda você a identificar padrões ao longo da semana.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button type="submit" name="intent" value="save" className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
                Salvar progresso
              </Button>
              <Button type="submit" name="intent" value="complete" variant="outline" className="border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10">
                Concluir dia
              </Button>
            </div>
          </div>
        </form>
      )}

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Shield className="h-5 w-5 text-yellow-400" />
            Regra de segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-slate-300">
            Dor aguda, tontura, formigamento ou desconforto intenso são sinais para interromper o exercício. O objetivo é evoluir com controle, não forçar o corpo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
