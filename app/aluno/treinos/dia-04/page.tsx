"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, Dumbbell, Play, Shield, Trophy, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

type ExerciseStatus = "pending" | "completed";

interface ExerciseItem {
  id: string;
  number: number;
  name: string;
  duration: string;
  category: string;
  status: ExerciseStatus;
}

const initialExercises: ExerciseItem[] = [
  { id: "1", number: 1, name: "Mobilidade cervical", duration: "2 min", category: "Aquecimento", status: "pending" },
  { id: "2", number: 2, name: "Rotação de ombros", duration: "2 min", category: "Aquecimento", status: "pending" },
  { id: "3", number: 3, name: "Alongamento torácico", duration: "4 min", category: "Circuito principal", status: "pending" },
  { id: "4", number: 4, name: "Prancha com joelhos", duration: "3 séries de 30s", category: "Circuito principal", status: "pending" },
  { id: "5", number: 5, name: "Ponte de glúteos", duration: "3 séries de 12 repetições", category: "Circuito principal", status: "pending" },
  { id: "6", number: 6, name: "Respiração e relaxamento", duration: "5 min", category: "Finalização", status: "pending" },
];

const categories = ["Aquecimento", "Circuito principal", "Finalização"];

export default function TreinoDia04Page() {
  const [exercises, setExercises] = useState<ExerciseItem[]>(initialExercises);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleExercise = (id: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id ? { ...ex, status: ex.status === "pending" ? "completed" : "pending" } : ex
      )
    );
    setShowSuccess(false);
  };

  const completedCount = exercises.filter((ex) => ex.status === "completed").length;
  const allCompleted = completedCount === exercises.length;

  const handleComplete = () => {
    if (allCompleted) {
      setShowSuccess(true);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/aluno/treinos">
          <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dia 04 — Mobilidade + Estabilidade</h1>
          <p className="mt-1 text-slate-300">Treino base para melhorar mobilidade, ativar o core e criar consciência corporal.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge className="border-yellow-400/30 bg-yellow-400/10 text-yellow-300">Nível Base</Badge>
        <span className="flex items-center gap-1.5 text-sm text-slate-400">
          <Clock className="h-4 w-4 text-yellow-400" />
          20 min
        </span>
      </div>

      <Card className="border-emerald-400/20 bg-emerald-400/5">
        <CardContent className="flex items-start gap-3 p-5">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-200">Treine com segurança</p>
            <p className="text-xs leading-relaxed text-slate-400">
              Faça os movimentos com calma. Se sentir dor aguda, tontura, formigamento ou desconforto intenso, interrompa o exercício.
            </p>
          </div>
        </CardContent>
      </Card>

      {showSuccess && (
        <Card className="border-yellow-400/20 bg-yellow-400/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-slate-950">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-yellow-300">Treino concluído!</p>
              <p className="text-xs text-slate-300">Sua jornada foi atualizada. Continue assim!</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {categories.map((category) => {
          const categoryExercises = exercises.filter((ex) => ex.category === category);
          if (categoryExercises.length === 0) return null;

          return (
            <div key={category} className="space-y-4">
              <h2 className="text-lg font-semibold text-white">{category}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryExercises.map((exercise) => (
                  <Card
                    key={exercise.id}
                    className={`bg-[#10161A] border-white/10 shadow-2xl shadow-black/30 transition-colors ${
                      exercise.status === "completed" ? "border-emerald-400/30 bg-emerald-400/5" : ""
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-yellow-400">
                          {String(exercise.number).padStart(2, "0")}
                        </div>
                        <Checkbox
                          checked={exercise.status === "completed"}
                          onCheckedChange={() => toggleExercise(exercise.id)}
                          className="data-checked:bg-emerald-400 data-checked:border-emerald-400"
                        />
                      </div>
                      <CardTitle className={`text-base font-semibold leading-tight ${exercise.status === "completed" ? "text-emerald-300 line-through" : "text-white"}`}>
                        {exercise.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-yellow-400" />
                          {exercise.duration}
                        </span>
                        <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-300 text-[10px] px-1.5 py-0">
                          {exercise.category}
                        </Badge>
                      </div>
                      <Button variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                        Ver execução
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">
          {completedCount} de {exercises.length} exercícios concluídos
        </p>
        <Button
          onClick={handleComplete}
          disabled={!allCompleted}
          className={`w-full sm:w-auto ${
            allCompleted
              ? "bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20"
              : "bg-white/10 text-slate-500 cursor-not-allowed"
          }`}
        >
          {allCompleted ? "Concluir treino" : "Complete todos os exercícios"}
          {allCompleted && <Trophy className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
