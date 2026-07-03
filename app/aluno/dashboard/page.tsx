"use client";

import { ArrowRight, Award, Clock, Dumbbell, Flame, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

const workoutExercises = [
  "Mobilidade cervical",
  "Rotacao de ombros",
  "Alongamento toracico",
  "Prancha com joelhos",
  "Ponte de gluteos",
];

const habits = [
  { id: "treino", label: "Treino do dia", checked: true },
  { id: "mobilidade", label: "Mobilidade", checked: true },
  { id: "agua", label: "Agua", checked: false },
  { id: "sono", label: "Sono", checked: false },
  { id: "postura", label: "Postura", checked: false },
];

export default function DashboardPage() {
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
          <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
            Dia 04 de 30
          </Badge>
          <Button className="bg-emerald-400 text-slate-950 hover:bg-emerald-400/90">
            Iniciar treino de hoje
            <ArrowRight className="ml-2 h-4 w-4" />
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
            <div className="text-2xl font-bold text-white">13%</div>
            <Progress
              value={13}
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
            <div className="text-2xl font-bold text-white">3 dias</div>
            <p className="text-xs text-slate-400">Continue assim</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tempo estimado</CardTitle>
            <Clock className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">20 min</div>
            <p className="text-xs text-slate-400">Por sessao</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Conquista</CardTitle>
            <Award className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Iniciante</div>
            <p className="text-xs text-slate-400">Nivel atual</p>
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
              <h3 className="font-semibold text-white">Dia 04 - Mobilidade + estabilidade</h3>
              <p className="mt-2 text-sm text-slate-300">
                Faca os movimentos com calma. A meta e executar bem, nao fazer rapido.
              </p>
            </div>
            <ul className="space-y-3">
              {workoutExercises.map((exercise) => (
                <li key={exercise} className="flex items-center gap-3 text-sm text-slate-200">
                  <span className="flex size-2 shrink-0 rounded-full bg-emerald-400" />
                  {exercise}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-lg text-white">Jornada de hoje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Progresso da jornada</span>
                <span className="font-medium text-emerald-300">2/5</span>
              </div>
              <Progress
                value={40}
                className="h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-yellow-400"
              />
            </div>

            <div className="space-y-4">
              {habits.map((habit) => (
                <label
                  key={habit.id}
                  className="flex items-center gap-3 text-sm text-slate-200"
                >
                  <Checkbox
                    checked={habit.checked}
                    className="data-checked:border-emerald-400 data-checked:bg-emerald-400"
                  />
                  {habit.label}
                </label>
              ))}
            </div>

            <Button
              asChild
              className="w-full cursor-pointer border border-white/10 bg-white/5 text-slate-100 hover:border-yellow-400/30 hover:bg-yellow-400/10 hover:text-white"
            >
              <Link href="/aluno/checklist">Abrir jornada</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
