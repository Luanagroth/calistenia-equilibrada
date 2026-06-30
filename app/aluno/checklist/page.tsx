"use client";

import { CheckCircle2, Dumbbell, Droplets, Footprints, HeartPulse, Lightbulb, Moon, Shield, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

type HabitStatus = "completed" | "pending" | "skipped";

interface Habit {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: HabitStatus;
}

interface MoodMetric {
  label: string;
  value: number;
  max: number;
  icon: React.ReactNode;
  color: string;
}

const habits: Habit[] = [
  {
    id: "treino",
    title: "Fiz o treino de hoje",
    description: "Completei a sessão planejada para o dia.",
    icon: <Dumbbell className="h-4 w-4 text-emerald-400" />,
    status: "completed",
  },
  {
    id: "mobilidade",
    title: "Fiz mobilidade",
    description: "Pelo menos 5 minutos de mobilidade.",
    icon: <TrendingUp className="h-4 w-4 text-sky-400" />,
    status: "completed",
  },
  {
    id: "agua",
    title: "Bebi água",
    description: "Ao menos 2 litros ao longo do dia.",
    icon: <Droplets className="h-4 w-4 text-blue-400" />,
    status: "pending",
  },
  {
    id: "caminhada",
    title: "Caminhei ou me mantive ativo",
    description: "Movimentação além do treino formal.",
    icon: <Footprints className="h-4 w-4 text-violet-400" />,
    status: "completed",
  },
  {
    id: "sono",
    title: "Dormi bem",
    description: "Entre 7 e 9 horas de sono de qualidade.",
    icon: <Moon className="h-4 w-4 text-indigo-400" />,
    status: "pending",
  },
  {
    id: "proteina",
    title: "Comi uma fonte de proteína",
    description: "Incluí proteína em pelo menos uma refeição.",
    icon: <HeartPulse className="h-4 w-4 text-rose-400" />,
    status: "completed",
  },
  {
    id: "frutas",
    title: "Comi frutas ou vegetais",
    description: "Pelo menos uma porção de alimentos naturais.",
    icon: <HeartPulse className="h-4 w-4 text-emerald-400" />,
    status: "pending",
  },
  {
    id: "postura",
    title: "Cuidei da postura",
    description: "Evitei posturas inadequadas por longos períodos.",
    icon: <Lightbulb className="h-4 w-4 text-amber-400" />,
    status: "completed",
  },
  {
    id: "limites",
    title: "Respeitei meus limites",
    description: "Não forcei movimentos com dor aguda.",
    icon: <Shield className="h-4 w-4 text-emerald-400" />,
    status: "completed",
  },
];

const moodMetrics: MoodMetric[] = [
  {
    label: "Energia",
    value: 7,
    max: 10,
    icon: <TrendingUp className="h-4 w-4 text-emerald-400" />,
    color: "text-emerald-300",
  },
  {
    label: "Sono",
    value: 6,
    max: 10,
    icon: <Moon className="h-4 w-4 text-indigo-400" />,
    color: "text-indigo-300",
  },
  {
    label: "Dor / Desconforto",
    value: 2,
    max: 10,
    icon: <HeartPulse className="h-4 w-4 text-rose-400" />,
    color: "text-rose-300",
  },
  {
    label: "Disposição para treinar",
    value: 8,
    max: 10,
    icon: <Dumbbell className="h-4 w-4 text-amber-400" />,
    color: "text-amber-300",
  },
];

export default function ChecklistPage() {
  const completedCount = habits.filter((h) => h.status === "completed").length;
  const totalHabits = habits.length;
  const progressPercentage = Math.round((completedCount / totalHabits) * 100);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checklist diário</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Registre sua constância, acompanhe seus hábitos e observe como seu corpo responde ao longo da jornada.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
            Dia 04 de 30
          </Badge>
          <Button className="bg-emerald-400 text-slate-950 hover:bg-emerald-400/90">
            Salvar checklist
          </Button>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Sua consistência hoje</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">
              {completedCount} de {totalHabits} hábitos concluídos
            </div>
            <div className="text-sm text-slate-400">{progressPercentage}%</div>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-emerald-400" />
          <p className="text-xs text-slate-400 italic">
            Você está criando ritmo. Continue sem pressa.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Hábitos do dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {habits.map((habit) => (
                <label
                  key={habit.id}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:border-white/10"
                >
                  <Checkbox
                    checked={habit.status === "completed"}
                    className="mt-0.5 data-checked:bg-emerald-400 data-checked:border-emerald-400"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
                        {habit.icon}
                        {habit.title}
                      </span>
                      {habit.status === "completed" && (
                        <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300 text-[10px] px-1.5 py-0">
                          Concluído
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{habit.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Como você se sentiu hoje?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {moodMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs text-slate-400">
                        {metric.icon}
                        {metric.label}
                      </span>
                      <span className={`text-sm font-semibold ${metric.color}`}>
                        {metric.value}/{metric.max}
                      </span>
                    </div>
                    <Progress
                      value={(metric.value / metric.max) * 100}
                      className="h-1.5 bg-white/10 [&_[data-slot=progress-indicator]]:bg-emerald-400"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Observações do dia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Ex: senti mais mobilidade no quadril, tive dificuldade na prancha, dormi pouco..."
                className="min-h-[100px] border-white/10 bg-white/5 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-emerald-400/50 focus-visible:ring-emerald-400/20"
              />
              <p className="text-[11px] text-slate-500">
                Este registro é privado e ajuda você a identificar padrões ao longo da semana.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-emerald-400" />
              Regra de segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-slate-300">
              Dor aguda, tontura, formigamento ou desconforto intenso são sinais para interromper o exercício. O objetivo é evoluir com controle, não forçar o corpo.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Resumo da semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-slate-100">3</div>
                <p className="text-xs text-slate-400">Treinos concluídos</p>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-slate-100">4</div>
                <p className="text-xs text-slate-400">Checklists preenchidos</p>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-slate-100">3 dias</div>
                <p className="text-xs text-slate-400">Sequência atual</p>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-emerald-300">Mobilidade</div>
                <p className="text-xs text-slate-400">Melhor hábito</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
