"use client";

import { ArrowRight, Award, Clock, Dumbbell, Flame, TrendingUp, Bell, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

const workoutExercises = [
  "Mobilidade cervical",
  "Rotação de ombros",
  "Alongamento torácico",
  "Prancha com joelhos",
  "Ponte de glúteos",
];

const habits = [
  { id: "treino", label: "Treino do dia", checked: true },
  { id: "mobilidade", label: "Mobilidade", checked: true },
  { id: "agua", label: "Água", checked: false },
  { id: "sono", label: "Sono", checked: false },
  { id: "postura", label: "Postura", checked: false },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">Bem-vinda à sua jornada 👋</h1>
            <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-white hover:bg-white/10">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-2 max-w-xl text-slate-300">
            Foco em mobilidade, controle e constância. Cada dia é um passo para o equilíbrio do seu corpo e da sua mente.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-yellow-400/30 bg-yellow-400/10 text-yellow-300">
            Dia 04 de 30
          </Badge>
          <Button className="bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
            Iniciar treino de hoje
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Progresso</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">13%</div>
            <Progress value={13} className="mt-3 h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-yellow-400" />
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Sequência atual</CardTitle>
            <Flame className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3 dias</div>
            <p className="text-xs text-slate-400">Continue assim</p>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tempo estimado</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">20 min</div>
            <p className="text-xs text-slate-400">Por sessão</p>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Conquista</CardTitle>
            <Award className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Iniciante</div>
            <p className="text-xs text-slate-400">Nível atual</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Dumbbell className="h-5 w-5 text-yellow-400" />
              Treino de hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                <Dumbbell className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-white">Dia 04 — Mobilidade + estabilidade</h3>
                <p className="text-sm text-slate-300">
                  Faça os movimentos com calma. A meta é executar bem, não fazer rápido.
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {workoutExercises.map((exercise) => (
                <li key={exercise} className="flex items-center gap-3 text-sm text-slate-200">
                  <span className="flex size-2 shrink-0 rounded-full bg-emerald-400" />
                  {exercise}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 pt-2">
              <Button className="bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
                Iniciar treino de hoje
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
                Ver detalhes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="text-lg text-white">Checklist diário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Progresso do dia</span>
                <span className="font-medium text-emerald-300">2/5</span>
              </div>
              <Progress value={40} className="h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-emerald-400" />
            </div>

            <div className="space-y-4">
              {habits.map((habit) => (
                <label
                  key={habit.id}
                  className="flex items-center gap-3 text-sm text-slate-200"
                >
                  <Checkbox
                    checked={habit.checked}
                    className="data-checked:bg-emerald-400 data-checked:border-emerald-400"
                  />
                  {habit.label}
                </label>
              ))}
            </div>

            <Button variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
              Ver checklist completo
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border-yellow-400/20 shadow-2xl shadow-black/30">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-slate-950">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-yellow-300">Você está criando ritmo!</p>
            <p className="text-xs text-slate-300">Continue sem pressa. A consistência é mais importante que a intensidade.</p>
          </div>
          <Button variant="ghost" className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10">
            Ver minhas conquistas
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
