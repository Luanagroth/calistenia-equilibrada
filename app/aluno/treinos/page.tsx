"use client";

import { ArrowRight, CheckCircle2, Clock, Dumbbell, Flame, Lock, Play, Shield, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type DayStatus = "concluido" | "atual" | "disponivel" | "bloqueado" | "descanso";
type WorkoutType = "Mobilidade" | "Estabilidade" | "Força funcional" | "Recuperação" | "Avaliação";

interface WorkoutDay {
  day: number;
  title: string;
  type: WorkoutType;
  status: DayStatus;
  duration: string;
}

const workoutDays: WorkoutDay[] = [
  { day: 1, title: "Avaliação inicial", type: "Avaliação", status: "concluido", duration: "25 min" },
  { day: 2, title: "Mobilidade base", type: "Mobilidade", status: "concluido", duration: "15 min" },
  { day: 3, title: "Estabilidade leve", type: "Estabilidade", status: "concluido", duration: "18 min" },
  { day: 4, title: "Mobilidade + estabilidade", type: "Mobilidade", status: "atual", duration: "20 min" },
  { day: 5, title: "Força funcional leve", type: "Força funcional", status: "disponivel", duration: "22 min" },
  { day: 6, title: "Recuperação ativa", type: "Recuperação", status: "disponivel", duration: "15 min" },
  { day: 7, title: "Revisão da semana", type: "Avaliação", status: "bloqueado", duration: "20 min" },
  { day: 8, title: "Mobilidade intermediária", type: "Mobilidade", status: "bloqueado", duration: "20 min" },
  { day: 9, title: "Estabilidade média", type: "Estabilidade", status: "bloqueado", duration: "22 min" },
  { day: 10, title: "Força funcional moderada", type: "Força funcional", status: "bloqueado", duration: "25 min" },
  { day: 11, title: "Descanso ativo", type: "Recuperação", status: "descanso", duration: "10 min" },
  { day: 12, title: "Core iniciante", type: "Força funcional", status: "bloqueado", duration: "20 min" },
  { day: 13, title: "Mobilidade + alongamento", type: "Mobilidade", status: "bloqueado", duration: "18 min" },
  { day: 14, title: "Avaliação de evolução", type: "Avaliação", status: "bloqueado", duration: "25 min" },
  { day: 15, title: "Estabilidade dinâmica", type: "Estabilidade", status: "bloqueado", duration: "22 min" },
  { day: 16, title: "Força funcional intensiva", type: "Força funcional", status: "bloqueado", duration: "28 min" },
  { day: 17, title: "Recuperação profunda", type: "Recuperação", status: "bloqueado", duration: "15 min" },
  { day: 18, title: "Mobilidade avançada", type: "Mobilidade", status: "bloqueado", duration: "22 min" },
  { day: 19, title: "Core intermediário", type: "Força funcional", status: "bloqueado", duration: "25 min" },
  { day: 20, title: "Estabilidade unilateral", type: "Estabilidade", status: "bloqueado", duration: "20 min" },
  { day: 21, title: "Revisão da semana", type: "Avaliação", status: "bloqueado", duration: "20 min" },
  { day: 22, title: "Mobilidade + equilíbrio", type: "Mobilidade", status: "bloqueado", duration: "20 min" },
  { day: 23, title: "Força funcional completa", type: "Força funcional", status: "bloqueado", duration: "30 min" },
  { day: 24, title: "Recuperação ativa", type: "Recuperação", status: "bloqueado", duration: "15 min" },
  { day: 25, title: "Estabilidade complexa", type: "Estabilidade", status: "bloqueado", duration: "25 min" },
  { day: 26, title: "Avaliação de desempenho", type: "Avaliação", status: "bloqueado", duration: "25 min" },
  { day: 27, title: "Mobilidade final", type: "Mobilidade", status: "bloqueado", duration: "20 min" },
  { day: 28, title: "Força funcional desafio", type: "Força funcional", status: "bloqueado", duration: "30 min" },
  { day: 29, title: "Recuperação e alongamento", type: "Recuperação", status: "bloqueado", duration: "15 min" },
  { day: 30, title: "Conclusão da jornada", type: "Avaliação", status: "bloqueado", duration: "25 min" },
];

const typeBadgeVariant = (type: WorkoutType) => {
  switch (type) {
    case "Mobilidade":
      return "bg-sky-400/10 text-sky-300 border-sky-400/20";
    case "Estabilidade":
      return "bg-violet-400/10 text-violet-300 border-violet-400/20";
    case "Força funcional":
      return "bg-amber-400/10 text-amber-300 border-amber-400/20";
    case "Recuperação":
      return "bg-emerald-400/10 text-emerald-300 border-emerald-400/20";
    case "Avaliação":
      return "bg-slate-400/10 text-slate-300 border-slate-400/20";
  }
};

const statusConfig = (status: DayStatus) => {
  switch (status) {
    case "concluido":
      return {
        label: "Concluído",
        className: "border-emerald-400/30 bg-emerald-400/5",
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
      };
    case "atual":
      return {
        label: "Atual",
        className: "border-emerald-400 bg-emerald-400/10",
        icon: <Play className="h-4 w-4 text-emerald-400" />,
      };
    case "disponivel":
      return {
        label: "Disponível",
        className: "border-white/10 bg-white/5",
        icon: null,
      };
    case "bloqueado":
      return {
        label: "Bloqueado",
        className: "border-white/5 bg-white/[0.02]",
        icon: <Lock className="h-4 w-4 text-slate-500" />,
      };
    case "descanso":
      return {
        label: "Descanso",
        className: "border-slate-700 bg-slate-800/30",
        icon: null,
      };
  }
};

export default function TreinosPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plano de 30 dias</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Siga sua jornada no seu ritmo, respeitando seus limites e registando cada treino concluído.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
            Dia atual: 04
          </Badge>
          <Button className="bg-emerald-400 text-slate-950 hover:bg-emerald-400/90">
            Continuar treino de hoje
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Progresso geral</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-400" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">4 de 30 dias</div>
            <div className="text-sm text-slate-400">13%</div>
          </div>
          <Progress value={13} className="h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-emerald-400" />
          <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-emerald-400" />
              Sequência: 3 dias
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
              20 min por sessão
            </span>
            <span className="text-slate-500 italic">
              A meta é constância, não perfeição.
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Dumbbell className="h-5 w-5 text-emerald-400" />
              Jornada Calistenia Equilibrada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {workoutDays.map((day) => {
                const status = statusConfig(day.status);
                const isActionable = day.status === "atual" || day.status === "disponivel";

                return (
                  <div
                    key={day.day}
                    className={cn(
                      "group relative flex flex-col gap-2 rounded-xl border p-3 transition-colors",
                      status.className
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">
                        Dia {String(day.day).padStart(2, "0")}
                      </span>
                      {status.icon}
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm font-medium leading-tight text-slate-100 line-clamp-2">
                        {day.title}
                      </p>
                      <Badge variant="outline" className={`${typeBadgeVariant(day.type)} border text-[10px] px-1.5 py-0`}>
                        {day.type}
                      </Badge>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="h-3 w-3" />
                        {day.duration}
                      </span>
                      {isActionable && (
                        <Button
                          size="icon"
                          className="h-7 w-7 rounded-full bg-emerald-400 p-0 text-slate-950 hover:bg-emerald-400/90"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Dumbbell className="h-5 w-5 text-emerald-400" />
                Treino de hoje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Dia 04 — Mobilidade + estabilidade</h3>
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  Melhore a mobilidade, ative o core e crie consciência corporal.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                  <Clock className="h-3 w-3 text-emerald-400" />
                  20 min
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                  <Dumbbell className="h-3 w-3 text-emerald-400" />
                  Base
                </span>
              </div>

              <ul className="space-y-2.5">
                {[
                  "Mobilidade cervical",
                  "Rotação de ombros",
                  "Alongamento torácico",
                  "Prancha com joelhos",
                  "Ponte de glúteos",
                ].map((exercise) => (
                  <li key={exercise} className="flex items-center gap-3 text-sm text-slate-200">
                    <span className="flex size-2 shrink-0 rounded-full bg-emerald-400" />
                    {exercise}
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-emerald-400 text-slate-950 hover:bg-emerald-400/90">
                Iniciar treino
                <Play className="ml-2 h-4 w-4 fill-current" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="flex items-start gap-3 p-5">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-200">Treine com segurança</p>
                <p className="text-xs leading-relaxed text-slate-400">
                  Se sentir dor aguda, tontura, formigamento ou desconforto intenso, interrompa o exercício e procure orientação profissional.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
