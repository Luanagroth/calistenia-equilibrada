import { ArrowRight, Award, BookOpen, Calendar, CheckCircle2, Clock, Dumbbell, Flame, Lock as LockIcon, Shield, TrendingUp, Trophy, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getUserAccess } from "@/lib/auth/get-user-access";
import { getStudentProgressSummary } from "@/lib/aluno/get-student-progress";
import { getJourneyAvailability } from "@/lib/jornada/progress-rules";
import { getStudentJourneyAlerts } from "@/lib/jornada/student-alerts";
import Link from "next/link";

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function DashboardPage() {
  const access = await getUserAccess();
  const summary = await getStudentProgressSummary();
  const journey = await getJourneyAvailability();

  const alerts = await getStudentJourneyAlerts({
    daysRemaining: access.daysRemaining,
    accessEndsAt: access.access?.ends_at ?? new Date(),
    accessStartsAt: access.access?.starts_at ?? new Date(),
    progressList: summary.progressList as Array<{
      journey_day: number;
      status: string;
      updated_at: string | null;
      completed_at: string | null;
      created_at: string;
    }>,
  });

  const {
    totalCompletedDays,
    totalInProgressDays,
    progressPercentage,
    lastCompletedDay,
    progressList,
  } = summary;

  const recentDays = [...progressList]
    .sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  const greeting = access.profile?.full_name
    ? `Olá, ${access.profile.full_name.split(" ")[0]}`
    : "Olá";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">{greeting}</h1>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-yellow-400">
              {access.profile?.full_name ? getInitials(access.profile.full_name) : <User className="h-5 w-5" />}
            </div>
          </div>
          <p className="mt-2 max-w-xl text-slate-300">
            Continue sua jornada de mobilidade, força funcional e constância.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-yellow-400/30 bg-yellow-400/10 text-yellow-300">
            Dia {String(journey.suggestedDay).padStart(2, "0")} de 30
          </Badge>
          {!journey.isJourneyCompleted && !journey.isNextDayLocked && (
            <Link href={`/aluno/treinos/dia-${String(journey.availableDay).padStart(2, "0")}`}>
              <Button className="bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
                {journey.availableDay === journey.suggestedDay ? "Continuar treino" : "Iniciar treino"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
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
            <p className="mt-2 text-[10px] text-slate-400">{totalCompletedDays} de 30 dias concluídos</p>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Dias concluídos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalCompletedDays}</div>
            <p className="text-xs text-slate-400">Dias finalizados</p>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Em andamento</CardTitle>
            <Flame className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalInProgressDays}</div>
            <p className="text-xs text-slate-400">Dias iniciados</p>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Acesso restante</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{access.daysRemaining > 0 ? `${access.daysRemaining} dias` : "Encerrado"}</div>
            <p className="text-xs text-slate-400">
              {access.daysRemaining > 0 ? "Continue aproveitando" : "Renove seu acesso"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Shield className="h-5 w-5 text-yellow-400" />
            Avisos da jornada
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Dumbbell className="h-5 w-5 text-yellow-400" />
              Treino de hoje
            </CardTitle>
            <p className="text-xs text-slate-400">
              Dia {String(journey.suggestedDay).padStart(2, "0")} —{" "}
              {journey.isJourneyCompleted
                ? "Jornada concluída!"
                : journey.isNextDayLocked
                  ? "Aguardando próximo dia útil"
                  : journey.suggestedDay === 1
                    ? "Comece por aqui"
                    : "Continue de onde parou"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {journey.isJourneyCompleted ? (
              <div className="flex items-center gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 border border-emerald-400/20">
                  <Trophy className="h-8 w-8 text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-white">Parabéns! Você completou a jornada.</h3>
                  <p className="text-sm text-slate-300">
                    Revise sua evolução e prepare-se para os próximos passos.
                  </p>
                </div>
              </div>
            ) : journey.isNextDayLocked ? (
              <div className="flex items-center gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20">
                  <LockIcon className="h-8 w-8 text-amber-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-white">Próximo treino bloqueado</h3>
                  <p className="text-sm text-slate-300">{journey.message}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                    <Calendar className="h-8 w-8 text-yellow-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white">Dia {String(journey.availableDay).padStart(2, "0")} da jornada</h3>
                    <p className="text-sm text-slate-300">
                      Faça os movimentos com calma. A meta é executar bem, não fazer rápido.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Link href={`/aluno/treinos/dia-${String(journey.availableDay).padStart(2, "0")}`}>
                    <Button className="bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
                      {journey.availableDay === journey.suggestedDay ? "Continuar treino" : "Iniciar treino"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/aluno/checklist?dia=${journey.availableDay}`}>
                    <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                      Registrar progresso
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
              Últimos registros
            </CardTitle>
            <p className="text-xs text-slate-400">Seus últimos dias registrados</p>
          </CardHeader>
          <CardContent>
            {recentDays.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-300">
                  Você ainda não iniciou nenhum dia. Que tal começar agora?
                </p>
                {!journey.isNextDayLocked && journey.availableDay === 1 && (
                  <Link href="/aluno/checklist?dia=1">
                    <Button className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
                      Começar dia 1
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {recentDays.map((day) => (
                  <div
                    key={day.journey_day}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">Dia {String(day.journey_day).padStart(2, "0")}</p>
                        <Badge
                          variant="outline"
                          className={
                            day.status === "completed"
                              ? "border-emerald-400/30 bg-emerald-400/5 text-emerald-300"
                              : "border-amber-400/30 bg-amber-400/5 text-amber-300"
                          }
                        >
                          {day.status === "completed" ? "Concluído" : "Em andamento"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-[10px] text-slate-400">
                        {day.energy_level && <span>Energia: {day.energy_level}/5</span>}
                        {day.difficulty_level && <span>Dificuldade: {day.difficulty_level}/5</span>}
                        {day.pain_level !== null && <span>Dor: {day.pain_level}/5</span>}
                      </div>
                      {day.notes && <p className="text-[10px] text-slate-400 line-clamp-1">{day.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-3">
              <Link href="/aluno/evolucao">
                <Button variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                  Ver evolução completa
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-rose-400/10 bg-rose-400/5">
        <CardContent className="flex items-start gap-3 p-5">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-200">Evolução com segurança</p>
            <p className="text-xs leading-relaxed text-slate-400">
              Em caso de dor forte, tontura, formigamento ou desconforto intenso, interrompa a prática e procure orientação profissional.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
