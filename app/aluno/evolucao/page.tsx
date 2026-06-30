"use client";

import { ArrowRight, BarChart3, Calendar, CheckCircle2, Flag, HeartPulse, Lightbulb, Lock, Shield, Target, TrendingUp, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialAssessment = [
  { label: "Mobilidade dos ombros", value: 3, max: 5 },
  { label: "Mobilidade do quadril", value: 2, max: 5 },
  { label: "Mobilidade dos tornozelos", value: 2, max: 5 },
  { label: "Equilíbrio unilateral", value: 3, max: 5 },
];

const currentMetrics = [
  { label: "Energia", value: 7, max: 10, icon: <TrendingUp className="h-4 w-4 text-emerald-400" /> },
  { label: "Sono", value: 6, max: 10, icon: <HeartPulse className="h-4 w-4 text-indigo-400" /> },
  { label: "Dor / Desconforto", value: 2, max: 10, icon: <Shield className="h-4 w-4 text-rose-400" /> },
  { label: "Disposição para treinar", value: 8, max: 10, icon: <Target className="h-4 w-4 text-amber-400" /> },
];

const journeyComparison = [
  { label: "Energia", initial: 5, current: 7, max: 10 },
  { label: "Dor / Desconforto", initial: 5, current: 2, max: 10, inverse: true },
  { label: "Mobilidade percebida", initial: 4, current: 6, max: 10 },
  { label: "Constância", initial: 0, current: 4, max: 10, unit: "dias" },
];

const timelineEvents = [
  { day: 1, title: "Avaliação inicial concluída", description: "Ponto de partida registrado.", icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" /> },
  { day: 2, title: "Primeiro treino concluído", description: "Mobilidade base finalizada.", icon: <Flag className="h-4 w-4 text-sky-400" /> },
  { day: 3, title: "Checklist preenchido", description: "Hábitos do dia registrados.", icon: <Calendar className="h-4 w-4 text-violet-400" /> },
  { day: 4, title: "Sequência de 3 dias alcançada", description: "Constância em construção.", icon: <Trophy className="h-4 w-4 text-amber-400" /> },
];

export default function EvolucaoPage() {
  const initialScore = initialAssessment.reduce((acc, item) => acc + item.value, 0);
  const initialTotal = initialAssessment.reduce((acc, item) => acc + item.max, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sua evolução</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Acompanhe sua constância, compare seu ponto de partida e veja como pequenas melhorias se acumulam ao longo da jornada.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
            Dia 04 de 30
          </Badge>
          <Button className="bg-emerald-400 text-slate-950 hover:bg-emerald-400/90">
            Registrar evolução de hoje
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Progresso da jornada</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13%</div>
            <Progress value={13} className="mt-3 h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-emerald-400" />
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Treinos concluídos</CardTitle>
            <Flag className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-slate-400">Sessões finalizadas</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Checklists preenchidos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-slate-400">Registros de hábitos</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Sequência atual</CardTitle>
            <Trophy className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 dias</div>
            <p className="text-xs text-slate-400">Continue assim</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-emerald-400" />
              Ponto de partida
            </CardTitle>
            <p className="text-xs text-slate-400">Avaliação inicial — Dia 1</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {initialAssessment.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-xs text-slate-400">
                    {item.value}/{item.max}
                  </span>
                </div>
                <Progress
                  value={(item.value / item.max) * 100}
                  className="h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-emerald-400"
                />
              </div>
            ))}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
              <div>
                <p className="text-xs text-slate-400">Pontuação inicial</p>
                <p className="text-lg font-semibold text-slate-100">
                  {initialScore}/{initialTotal}
                </p>
              </div>
              <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                Base
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HeartPulse className="h-5 w-5 text-emerald-400" />
              Como você está hoje
            </CardTitle>
            <p className="text-xs text-slate-400">Dia 04 — dados atuais</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {currentMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-slate-400">
                      {metric.icon}
                      {metric.label}
                    </span>
                    <span className="text-sm font-semibold text-emerald-300">
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
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Comparativo da jornada
          </CardTitle>
          <p className="text-xs text-slate-400">Veja o quanto você já evoluiu desde o início</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {journeyComparison.map((item) => {
              const initialPercent = (item.initial / item.max) * 100;
              const currentPercent = (item.current / item.max) * 100;
              const unit = item.unit || "";

              return (
                <div key={item.label} className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium text-slate-200">{item.label}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Inicial</span>
                      <span className="text-slate-300">
                        {item.initial}{unit}
                      </span>
                    </div>
                    <Progress
                      value={initialPercent}
                      className="h-1.5 bg-white/10 [&_[data-slot=progress-indicator]]:bg-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-300">Atual</span>
                      <span className="text-emerald-300">
                        {item.current}{unit}
                      </span>
                    </div>
                    <Progress
                      value={currentPercent}
                      className="h-1.5 bg-white/10 [&_[data-slot=progress-indicator]]:bg-emerald-400"
                    />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-300">
                    <TrendingUp className="h-3 w-3" />
                    +{item.current - item.initial}{unit}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-emerald-400" />
            Linha do tempo
          </CardTitle>
          <p className="text-xs text-slate-400">Marcos da sua jornada até aqui</p>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-0">
            <div className="absolute inset-x-0 top-2 bottom-2 mx-auto w-px bg-white/10" />
            <div className="space-y-6">
              {timelineEvents.map((event) => (
                <div key={event.day} className="relative flex items-start gap-4">
                  <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-950">
                    {event.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-200">{event.title}</p>
                    </div>
                    <p className="text-xs text-slate-400">{event.description}</p>
                    <p className="text-[10px] text-slate-500">Dia {event.day}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-emerald-400" />
              Próxima reavaliação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-300">
              Recomendamos refazer a avaliação no Dia 15 e no Dia 30 para comparar sua evolução com mais clareza.
            </p>
            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              Ver avaliação inicial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-emerald-400" />
              Depois dos 30 dias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-300">
              Ao concluir a Jornada 30 Dias, você poderá revisar seu relatório final e continuar para o próximo nível quando estiver disponível.
            </p>
            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              Conhecer próximos passos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-rose-400/10 bg-rose-400/5">
        <CardContent className="flex items-start gap-3 p-5">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-200">Evolução com segurança</p>
            <p className="text-xs leading-relaxed text-slate-400">
              Evolução não significa forçar mais. Se houver dor aguda, tontura, formigamento ou desconforto intenso, interrompa o exercício e procure orientação profissional.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
