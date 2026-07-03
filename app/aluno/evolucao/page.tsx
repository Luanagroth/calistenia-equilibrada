import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ClipboardPenLine,
  Flag,
  HeartPulse,
  Lightbulb,
  Scale,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Link from "next/link";

import { createEvolutionCheckinAction } from "./actions";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { getEvolutionCheckins, type EvolutionCheckin } from "@/lib/aluno/get-evolution-checkins";
import { getStudentProgressSummary } from "@/lib/aluno/get-student-progress";

const mobilityOptions = [
  { value: 0, emoji: "😣", label: "Muito baixa" },
  { value: 1, emoji: "😕", label: "Baixa" },
  { value: 2, emoji: "🙂", label: "Limitada" },
  { value: 3, emoji: "😊", label: "Regular" },
  { value: 4, emoji: "🤸", label: "Boa" },
  { value: 5, emoji: "✨", label: "Muito boa" },
] as const;

const energyOptions = [
  { value: 1, emoji: "😴", label: "Baixa" },
  { value: 2, emoji: "😐", label: "Regular" },
  { value: 3, emoji: "🙂", label: "Boa" },
  { value: 4, emoji: "😄", label: "Muito boa" },
  { value: 5, emoji: "🔥", label: "Excelente" },
] as const;

const painOptions = [
  { value: 0, emoji: "✅", label: "Nenhum" },
  { value: 1, emoji: "🙂", label: "Baixo" },
  { value: 2, emoji: "😕", label: "Leve" },
  { value: 3, emoji: "😣", label: "Moderado" },
  { value: 4, emoji: "😖", label: "Alto" },
  { value: 5, emoji: "🚨", label: "Muito alto" },
] as const;

function getMessageFromError(error?: string) {
  switch (error) {
    case "invalid-weight":
      return "O peso atual deve ficar entre 20 e 300 kg.";
    case "invalid-mobility-level":
      return "A mobilidade percebida deve ficar entre 0 e 5.";
    case "invalid-energy-level":
      return "A disposicao/animo deve ficar entre 1 e 5.";
    case "invalid-pain-level":
      return "A dor ou desconforto geral deve ficar entre 0 e 5.";
    case "checkin-error":
      return "Nao foi possivel registrar seu check-in agora. Tente novamente.";
    default:
      return "Nao foi possivel processar seu check-in agora.";
  }
}

function formatDatePtBr(value: string) {
  return new Date(value).toLocaleDateString("pt-BR");
}

function formatWeightInput(value: number | null) {
  if (value === null) {
    return "";
  }

  return value.toFixed(2).replace(".", ",");
}

function formatLevel(value: number, total = 5) {
  return `${value}/${total}`;
}

function getOptionLabel(
  value: number,
  options: ReadonlyArray<{ value: number; label: string }>,
) {
  return options.find((option) => option.value === value)?.label ?? null;
}

function formatLevelWithLabel(
  value: number,
  options: ReadonlyArray<{ value: number; label: string }>,
  total = 5,
) {
  const label = getOptionLabel(value, options);
  return label ? `${formatLevel(value, total)} - ${label}` : formatLevel(value, total);
}

function formatAverageWithLabel(
  value: number | null,
  options: ReadonlyArray<{ value: number; label: string }>,
  total = 5,
) {
  if (value === null) {
    return "-";
  }

  const rounded = Math.round(value);
  const label = getOptionLabel(rounded, options);
  return label ? `${value.toFixed(1)}/${total} - ${label}` : `${value.toFixed(1)}/${total}`;
}

function formatWeightChange(initialValue: number, latestValue: number) {
  const delta = Number((latestValue - initialValue).toFixed(1));

  if (Math.abs(delta) < 0.1) {
    return "Voce registrou estabilidade no peso ao longo dos registros.";
  }

  if (delta < 0) {
    return `Voce registrou reducao de ${Math.abs(delta).toFixed(1)} kg.`;
  }

  return `Voce registrou aumento de ${delta.toFixed(1)} kg.`;
}

function formatMobilityChange(initialValue: number, latestValue: number) {
  if (initialValue === latestValue) {
    return `Sua mobilidade percebida se manteve em ${formatLevelWithLabel(latestValue, mobilityOptions)}.`;
  }

  return `Sua mobilidade percebida saiu de ${formatLevelWithLabel(initialValue, mobilityOptions)} para ${formatLevelWithLabel(latestValue, mobilityOptions)}.`;
}

function formatEnergyChange(initialValue: number, latestValue: number) {
  if (initialValue === latestValue) {
    return `Sua disposicao registrada se manteve em ${formatLevelWithLabel(latestValue, energyOptions)}.`;
  }

  return `Sua disposicao registrada ${latestValue > initialValue ? "melhorou" : "mudou"} de ${formatLevelWithLabel(initialValue, energyOptions)} para ${formatLevelWithLabel(latestValue, energyOptions)}.`;
}

function formatPainChange(initialValue: number, latestValue: number) {
  if (initialValue === latestValue) {
    return `Seu desconforto registrado se manteve em ${formatLevelWithLabel(latestValue, painOptions)}.`;
  }

  return latestValue < initialValue
    ? `Seu desconforto registrado reduziu de ${formatLevelWithLabel(initialValue, painOptions)} para ${formatLevelWithLabel(latestValue, painOptions)}.`
    : `Seu desconforto registrado aumentou de ${formatLevelWithLabel(initialValue, painOptions)} para ${formatLevelWithLabel(latestValue, painOptions)}.`;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "in_progress":
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    default:
      return "border-white/10 bg-white/5 text-slate-300";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "completed":
      return "Concluido";
    case "in_progress":
      return "Em andamento";
    default:
      return "Bloqueado/pendente";
  }
}

function renderCheckinDetails(checkin: EvolutionCheckin) {
  const items: string[] = [];

  if (checkin.weight_kg !== null) {
    items.push(`Peso: ${checkin.weight_kg} kg`);
  }

  if (checkin.mobility_level !== null) {
    items.push(`Mobilidade: ${formatLevelWithLabel(checkin.mobility_level, mobilityOptions)}`);
  }

  if (checkin.energy_level !== null) {
    items.push(`Disposicao/animo: ${formatLevelWithLabel(checkin.energy_level, energyOptions)}`);
  }

  if (checkin.pain_level !== null) {
    items.push(`Dor/desconforto: ${formatLevelWithLabel(checkin.pain_level, painOptions)}`);
  }

  return items;
}

export default async function EvolucaoPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const summary = await getStudentProgressSummary();
  const evolution = await getEvolutionCheckins();
  const { totalCompletedDays, totalInProgressDays, progressPercentage, lastCompletedDay, progressList } = summary;
  const { currentWeightKg, profile, checkins, trainingAverages } = evolution;

  const journeys = Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
    const found = progressList.find((progress) => progress.journey_day === day);
    if (found) {
      return { day, status: found.status, completed_at: found.completed_at, notes: found.notes };
    }

    return { day, status: "not_started" as const, completed_at: null, notes: null };
  });

  const latestCheckin = checkins[0] ?? null;
  const firstCheckin = checkins[checkins.length - 1] ?? null;
  const latestCheckinDetails = latestCheckin ? renderCheckinDetails(latestCheckin) : [];
  const baselineWeight = firstCheckin?.weight_kg ?? profile.weightKg;
  const baselineMobility = firstCheckin?.mobility_level ?? profile.mobilityLevel;
  const latestWeight = latestCheckin?.weight_kg ?? null;
  const latestMobility = latestCheckin?.mobility_level ?? null;
  const canCompareWeight =
    latestWeight !== null &&
    ((checkins.length > 1 && firstCheckin?.weight_kg !== null && firstCheckin?.weight_kg !== undefined) ||
      profile.weightKg !== null);
  const canCompareMobility =
    latestMobility !== null &&
    ((checkins.length > 1 &&
      firstCheckin?.mobility_level !== null &&
      firstCheckin?.mobility_level !== undefined) ||
      profile.mobilityLevel !== null);
  const canCompareEnergy =
    checkins.length > 1 &&
    firstCheckin?.energy_level !== null &&
    firstCheckin?.energy_level !== undefined &&
    latestCheckin?.energy_level !== null &&
    latestCheckin?.energy_level !== undefined;
  const canComparePain =
    checkins.length > 1 &&
    firstCheckin?.pain_level !== null &&
    firstCheckin?.pain_level !== undefined &&
    latestCheckin?.pain_level !== null &&
    latestCheckin?.pain_level !== undefined;

  const perceivedEvolutionMessages = [
    canCompareMobility && baselineMobility !== null && latestMobility !== null
      ? formatMobilityChange(baselineMobility, latestMobility)
      : "Registre sua mobilidade percebida para comparar sua evolucao percebida.",
    canCompareEnergy
      ? formatEnergyChange(firstCheckin!.energy_level!, latestCheckin!.energy_level!)
      : "Sua disposicao registrada sera comparada assim que houver registros suficientes.",
    canComparePain
      ? formatPainChange(firstCheckin!.pain_level!, latestCheckin!.pain_level!)
      : "Seu desconforto registrado podera ser comparado com mais clareza apos novos check-ins.",
    canCompareWeight && baselineWeight !== null && latestWeight !== null
      ? formatWeightChange(baselineWeight, latestWeight)
      : "Adicione peso atual nos check-ins para acompanhar essa percepcao ao longo do tempo.",
  ];

  const summaryLead =
    checkins.length === 0
      ? "Voce ainda nao registrou check-ins. Quando possivel, vamos usar os dados do seu perfil como ponto inicial."
      : checkins.length === 1
        ? "Seu primeiro check-in sera usado como ponto de partida para os proximos comparativos."
        : "Comparando seu primeiro e ultimo check-in, ja da para acompanhar como sua percepcao de evolucao esta caminhando.";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Sua evolucao</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Acompanhe sua constancia, registre check-ins e compare sua evolucao percebida ao longo da jornada.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-yellow-400/30 bg-yellow-400/10 text-yellow-300">
            Treino {lastCompletedDay ? String(lastCompletedDay).padStart(2, "0") : "00"} de 30
          </Badge>
          <Link href="/aluno/checklist">
            <Button className="bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20 hover:bg-yellow-300">
              Registrar evolucao de hoje
            </Button>
          </Link>
        </div>
      </div>

      {params.success === "checkin-created" && (
        <Card className="border-emerald-400/20 bg-emerald-400/5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-300">Check-in registrado com sucesso.</p>
              <p className="text-xs text-slate-300">
                Seu registro ja entrou no resumo da sua evolucao percebida.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {params.error && (
        <Card className="border-rose-400/20 bg-rose-400/5">
          <CardContent className="p-4 text-sm text-rose-200">{getMessageFromError(params.error)}</CardContent>
        </Card>
      )}

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-white">Progresso da Jornada</h2>
          <p className="text-sm text-slate-300">Acompanhe sua evolucao dentro dos 30 treinos.</p>
        </div>

        <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="text-sm text-slate-300">{totalCompletedDays}/30 treinos concluidos</p>
                <div className="text-4xl font-bold text-white">{progressPercentage}%</div>
                <p className="text-sm text-slate-400">{totalInProgressDays} treino(s) em andamento</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:min-w-[420px]">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                    <Flag className="h-4 w-4 text-yellow-400" />
                    Treinos concluidos
                  </div>
                  <p className="mt-3 text-2xl font-bold text-white">{totalCompletedDays}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Em andamento
                  </div>
                  <p className="mt-3 text-2xl font-bold text-white">{totalInProgressDays}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                    <TrendingUp className="h-4 w-4 text-yellow-400" />
                    Progresso
                  </div>
                  <p className="mt-3 text-2xl font-bold text-white">{progressPercentage}%</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Barra da jornada</span>
                <span className="font-medium text-yellow-300">{totalCompletedDays}/30</span>
              </div>
              <Progress
                value={progressPercentage}
                className="h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-yellow-400"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Calendar className="h-5 w-5 text-yellow-400" />
              Ultimo check-in
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestCheckin ? (
              <>
                <p className="text-sm text-slate-300">
                  Seu ultimo check-in foi realizado em {formatDatePtBr(latestCheckin.created_at)}.
                </p>
                <div className="space-y-2">
                  {latestCheckinDetails.map((detail) => (
                    <div
                      key={detail}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-200"
                    >
                      {detail}
                    </div>
                  ))}
                  {latestCheckin.notes && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-200">
                      Observacoes: {latestCheckin.notes}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-slate-300">
                Voce ainda nao registrou nenhum check-in. Faca o primeiro para criar seu ponto de partida.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              Resumo da sua evolucao
            </CardTitle>
            <p className="text-xs text-slate-400">{summaryLead}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              {perceivedEvolutionMessages.map((message) => (
                <div
                  key={message}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-200"
                >
                  {message}
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                  <Flag className="h-4 w-4 text-yellow-400" />
                  Treinos concluidos
                </div>
                <p className="mt-3 text-2xl font-bold text-white">{totalCompletedDays}</p>
                <p className="text-xs text-slate-400">{progressPercentage}% da jornada</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                  <HeartPulse className="h-4 w-4 text-emerald-400" />
                  Energia media
                </div>
                <p className="mt-3 text-xl font-bold text-white">
                  {formatAverageWithLabel(trainingAverages.energy, energyOptions)}
                </p>
                <p className="text-xs text-slate-400">Baseada nos treinos concluidos</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                  <Target className="h-4 w-4 text-yellow-400" />
                  Dificuldade media
                </div>
                <p className="mt-3 text-2xl font-bold text-white">
                  {trainingAverages.difficulty === null ? "-" : `${trainingAverages.difficulty.toFixed(1)}/5`}
                </p>
                <p className="text-xs text-slate-400">Percepcao durante os treinos</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                  <Scale className="h-4 w-4 text-emerald-400" />
                  Dor media
                </div>
                <p className="mt-3 text-xl font-bold text-white">
                  {formatAverageWithLabel(trainingAverages.pain, painOptions)}
                </p>
                <p className="text-xs text-slate-400">Dados autorrelatados nos treinos concluidos</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-emerald-400/5 p-4">
              <p className="text-xs leading-relaxed text-slate-300">
                Esses dados sao autorrelatados e servem apenas para acompanhar sua percepcao de evolucao. Eles nao substituem avaliacao profissional.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.35fr]">
        <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <ClipboardPenLine className="h-5 w-5 text-yellow-400" />
              Registrar check-in
            </CardTitle>
            <p className="text-xs text-slate-400">
              Crie uma nova linha de evolucao para comparar sua percepcao ao longo da jornada.
            </p>
          </CardHeader>
          <CardContent>
            <form action={createEvolutionCheckinAction} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weightKg" className="text-xs text-slate-300">
                    Peso atual
                  </Label>
                  <Input
                    id="weightKg"
                    name="weightKg"
                    type="text"
                    inputMode="decimal"
                    defaultValue={formatWeightInput(currentWeightKg)}
                    placeholder="Ex: 52,50"
                    className="h-11 border-white/10 bg-white/5 text-slate-100 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-300">Mobilidade percebida</Label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {mobilityOptions.map((option) => (
                      <label key={option.value} className="relative cursor-pointer">
                        <input
                          type="radio"
                          name="mobilityLevel"
                          value={option.value}
                          defaultChecked={profile.mobilityLevel === option.value}
                          className="peer sr-only"
                        />
                        <div className="flex min-h-[108px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center transition hover:border-yellow-400/40 hover:bg-yellow-400/5 peer-checked:border-yellow-400 peer-checked:bg-yellow-400/10 peer-checked:shadow-lg peer-checked:shadow-yellow-400/10">
                          <span className="text-2xl">{option.emoji}</span>
                          <span className="mt-2 text-sm font-medium text-white">{option.label}</span>
                          <span className="mt-1 text-[11px] text-slate-300">{option.value}/5</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-300">Disposicao/animo</Label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {energyOptions.map((option) => (
                      <label key={option.value} className="relative cursor-pointer">
                        <input type="radio" name="energyLevel" value={option.value} className="peer sr-only" />
                        <div className="flex min-h-[108px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center transition hover:border-yellow-400/40 hover:bg-yellow-400/5 peer-checked:border-yellow-400 peer-checked:bg-yellow-400/10 peer-checked:shadow-lg peer-checked:shadow-yellow-400/10">
                          <span className="text-2xl">{option.emoji}</span>
                          <span className="mt-2 text-sm font-medium text-white">{option.label}</span>
                          <span className="mt-1 text-[11px] text-slate-300">{option.value}/5</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-300">Dor/desconforto geral</Label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {painOptions.map((option) => (
                      <label key={option.value} className="relative cursor-pointer">
                        <input type="radio" name="painLevel" value={option.value} className="peer sr-only" />
                        <div className="flex min-h-[108px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center transition hover:border-yellow-400/40 hover:bg-yellow-400/5 peer-checked:border-yellow-400 peer-checked:bg-yellow-400/10 peer-checked:shadow-lg peer-checked:shadow-yellow-400/10">
                          <span className="text-2xl">{option.emoji}</span>
                          <span className="mt-2 text-sm font-medium text-white">{option.label}</span>
                          <span className="mt-1 text-[11px] text-slate-300">{option.value}/5</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes" className="text-xs text-slate-300">
                    Observacoes
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Ex: estou me sentindo mais solto, mais disposto ou mais travado hoje..."
                    className="min-h-[130px] border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-400 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20 hover:bg-yellow-300 sm:w-auto"
              >
                Registrar check-in
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
              Linha de evolucao
            </CardTitle>
            <p className="text-xs text-slate-400">
              Seus check-ins aparecem aqui do mais recente para o mais antigo.
            </p>
          </CardHeader>
          <CardContent>
            {checkins.length === 0 ? (
              <p className="text-sm text-slate-300">
                Seus check-ins aparecerao aqui conforme voce registrar sua evolucao.
              </p>
            ) : (
              <div className="space-y-4">
                {checkins.map((checkin) => {
                  const details = renderCheckinDetails(checkin);

                  return (
                    <div
                      key={checkin.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <p className="text-sm font-semibold text-white">{formatDatePtBr(checkin.created_at)}</p>
                      <div className="mt-3 space-y-2 text-sm text-slate-300">
                        {details.map((detail) => (
                          <p key={detail}>{detail}</p>
                        ))}
                        {checkin.notes && <p>Observacoes: {checkin.notes}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Treinos da jornada
          </CardTitle>
          <p className="text-xs text-slate-400">Acompanhe o status real de cada treino de 1 a 30.</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {journeys.map((journey) => (
              <div
                key={journey.day}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">Treino {String(journey.day).padStart(2, "0")}</p>
                  <Badge
                    variant="outline"
                    className={`${getStatusBadge(journey.status)} border px-1.5 py-0 text-[10px]`}
                  >
                    {getStatusLabel(journey.status)}
                  </Badge>
                  {journey.status === "completed" && journey.completed_at && (
                    <p className="text-[10px] text-slate-400">{formatDatePtBr(journey.completed_at)}</p>
                  )}
                  {journey.notes && <p className="line-clamp-2 text-[10px] text-slate-400">{journey.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              Proxima reavaliacao
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-300">
              Recomendamos refazer a avaliacao no Treino 15 e no Treino 30 para comparar sua evolucao com mais clareza.
            </p>
            <Link href="/aluno/checklist">
              <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                Ver jornada de hoje
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Target className="h-5 w-5 text-yellow-400" />
              Depois dos 30 dias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-300">
              Ao concluir a Jornada 30 Dias, voce podera revisar seu relatorio final e continuar para o proximo nivel quando estiver disponivel.
            </p>
            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10" disabled>
              Conhecer proximos passos
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-rose-400/10 bg-rose-400/5">
        <CardContent className="flex items-start gap-3 p-5">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-200">Evolucao com seguranca</p>
            <p className="text-xs leading-relaxed text-slate-400">
              Evolucao nao significa forcar mais. Se houver dor aguda, tontura, formigamento ou desconforto intenso, interrompa o exercicio e procure orientacao profissional.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
