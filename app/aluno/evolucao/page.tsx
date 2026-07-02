import { ArrowRight, BarChart3, Calendar, CheckCircle2, Flag, HeartPulse, Lightbulb, Lock, Shield, Target, TrendingUp, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { getStudentProgressSummary } from "@/lib/aluno/get-student-progress";

const MOCK_INITIAL_SCORE = 0;
const MOCK_INITIAL_TOTAL = 20;

export default async function EvolucaoPage() {
  const summary = await getStudentProgressSummary();
  const { totalCompletedDays, totalInProgressDays, progressPercentage, lastCompletedDay, progressList } = summary;

  const journeys = Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
    const found = progressList.find((p) => p.journey_day === day);
    if (found) {
      return { day, status: found.status, completed_at: found.completed_at, notes: found.notes };
    }
    return { day, status: "not_started" as const, completed_at: null, notes: null };
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
      case "in_progress":
        return "border-amber-400/30 bg-amber-400/10 text-amber-300";
      default:
        return "border-white/10 bg-white/5 text-slate-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Treino concluído";
      case "in_progress":
        return "Treino em andamento";
      default:
        return "Não iniciado";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Sua evolução</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Acompanhe sua constância, compare seu ponto de partida e veja como pequenas melhorias se acumulam ao longo da jornada.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-yellow-400/30 bg-yellow-400/10 text-yellow-300">
            Treino {lastCompletedDay ? String(lastCompletedDay).padStart(2, "0") : "00"} de 30
          </Badge>
          <Link href="/aluno/checklist">
            <Button className="bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
              Registrar evolução de hoje
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Progresso da jornada</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{progressPercentage}%</div>
            <Progress value={progressPercentage} className="mt-3 h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-yellow-400" />
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Treinos concluídos</CardTitle>
            <Flag className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalCompletedDays}</div>
            <p className="text-xs text-slate-400">Treinos finalizados</p>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Treinos em andamento</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalInProgressDays}</div>
            <p className="text-xs text-slate-400">Treinos iniciados</p>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Último treino concluído</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{lastCompletedDay ? `Treino ${lastCompletedDay}` : "—"}</div>
            <p className="text-xs text-slate-400">Continue assim</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Calendar className="h-5 w-5 text-yellow-400" />
            Treinos da jornada
          </CardTitle>
          <p className="text-xs text-slate-400">Acompanhe o status de cada treino de 1 a 30</p>
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
                  <Badge variant="outline" className={`${getStatusBadge(journey.status)} border text-[10px] px-1.5 py-0`}>
                    {getStatusLabel(journey.status)}
                  </Badge>
                  {journey.status === "completed" && journey.completed_at && (
                    <p className="text-[10px] text-slate-500">
                      {new Date(journey.completed_at).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                  {journey.notes && (
                    <p className="text-[10px] text-slate-400 line-clamp-2">{journey.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              Próxima reavaliação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-300">
              Recomendamos refazer a avaliação no Treino 15 e no Treino 30 para comparar sua evolução com mais clareza.
            </p>
            <Link href="/aluno/checklist">
              <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                Ver jornada de hoje
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Depois dos 30 dias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-300">
              Ao concluir a Jornada 30 Dias, você poderá revisar seu relatório final e continuar para o próximo nível quando estiver disponível.
            </p>
            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10" disabled>
              Conhecer próximos passos
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
