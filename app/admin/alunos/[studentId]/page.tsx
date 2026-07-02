import { ArrowLeft, Calendar, CheckCircle2, HeartPulse, Lightbulb, Shield, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { getStudents } from "@/lib/admin/get-students";
import { getAdminStudentProgress } from "@/lib/admin/get-student-progress";
import { getStudentJourneyAlerts } from "@/lib/jornada/student-alerts";

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR");
}

export default async function AdminAlunoDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const resolvedParams = await params;
  const studentId = resolvedParams.studentId;

  const students = await getStudents();
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/alunos">
            <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Aluno não encontrado</h1>
          </div>
        </div>
      </div>
    );
  }

  const progress = await getAdminStudentProgress(studentId);
  const { totalCompletedDays, totalInProgressDays, progressPercentage, lastCompletedDay, progressList } = progress;

  const alerts = await getStudentJourneyAlerts({
    daysRemaining: student.daysRemaining,
    accessEndsAt: student.endsAt ?? new Date(),
    accessStartsAt: student.startsAt ?? new Date(),
    progressList: progressList as Array<{
      journey_day: number;
      status: string;
      updated_at: string | null;
      completed_at: string | null;
      created_at: string;
    }>,
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/alunos">
          <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{student.fullName}</h1>
          <p className="mt-1 text-sm text-slate-400">{student.email}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Treinos concluídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-300">{totalCompletedDays}</div>
            <p className="text-xs text-slate-400">de 30 treinos</p>
          </CardContent>
        </Card>
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Progresso da jornada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{progressPercentage}%</div>
            <Progress value={progressPercentage} className="mt-2 h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-yellow-400" />
          </CardContent>
        </Card>
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Treinos em andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-300">{totalInProgressDays}</div>
            <p className="text-xs text-slate-400">treinos iniciados</p>
          </CardContent>
        </Card>
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Último treino concluído</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{lastCompletedDay ? `Treino ${lastCompletedDay}` : "—"}</div>
            <p className="text-xs text-slate-400">
              Status atual: <span className="text-slate-300">{student.profileStatus === "blocked" ? "bloqueado" : student.isAccessActive ? "ativo" : "vencido"}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Status do acesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-medium text-white capitalize">{student.profileStatus === "blocked" ? "Bloqueado" : student.isAccessActive ? "Ativo" : "Vencido"}</p>
              <p className="text-[11px] text-slate-500">
                {student.isAccessActive && student.daysRemaining > 0
                  ? `${student.daysRemaining} dias de acesso restantes`
                  : "Sem acesso ativo"}
              </p>
              <p className="text-[11px] text-slate-500">
                Vencimento: {formatDate(student.endsAt)} • {student.source ?? "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30 sm:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Ações rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link href={`/admin/alunos?search=${encodeURIComponent(student.email)}`}>
                <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                  Voltar para lista
                </Button>
              </Link>
              <Link href={`/admin/alunos?search=${encodeURIComponent(student.email)}#student-${student.id}`}>
                <Button variant="outline" size="sm" className="border-yellow-400/40 text-yellow-300 hover:bg-yellow-400/10">
                  Ações do aluno
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Shield className="h-5 w-5 text-yellow-400" />
            Avisos do aluno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 rounded-xl border p-4 ${
                  alert.type === "danger"
                    ? "border-rose-400/20 bg-rose-400/5"
                    : alert.type === "warning"
                      ? "border-amber-400/20 bg-amber-400/5"
                      : alert.type === "success"
                        ? "border-emerald-400/20 bg-emerald-400/5"
                        : "border-white/10 bg-white/5"
                }`}
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                  <Shield className="h-4 w-4 text-yellow-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">{alert.title}</p>
                  <p className="text-xs text-slate-300">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Calendar className="h-5 w-5 text-yellow-400" />
            Treinos da jornada
          </CardTitle>
          <p className="text-xs text-slate-400">Acompanhe o progresso treino a treino deste aluno</p>
        </CardHeader>
        <CardContent>
          {progressList.length === 0 ? (
            <p className="text-xs text-slate-400">Este aluno ainda não iniciou nenhum treino.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const dayProgress = progressList.find((p) => p.journey_day === day);
                if (!dayProgress) return null;

                const statusVariant = dayProgress.status === "completed"
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                  : "border-amber-400/30 bg-amber-400/10 text-amber-300";

                return (
                  <div key={day} className={`rounded-xl border p-3 ${statusVariant}`}>
                    <p className="text-sm font-medium text-white">Treino {String(day).padStart(2, "0")}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{dayProgress.status === "completed" ? "Concluído" : "Em andamento"}</p>
                    {dayProgress.completed_at && (
                      <p className="text-[10px] text-slate-500">{formatDate(dayProgress.completed_at)}</p>
                    )}
                    {dayProgress.energy_level && (
                      <p className="text-[10px] text-slate-400">Energia: {dayProgress.energy_level}/5</p>
                    )}
                    {dayProgress.difficulty_level && (
                      <p className="text-[10px] text-slate-400">Dificuldade: {dayProgress.difficulty_level}/5</p>
                    )}
                    {dayProgress.pain_level !== null && (
                      <p className="text-[10px] text-slate-400">Dor: {dayProgress.pain_level}/5</p>
                    )}
                    {dayProgress.notes && (
                      <p className="text-[10px] text-slate-400 line-clamp-2">{dayProgress.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

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
