import { ArrowLeft, Calendar, CheckCircle2, Clock, Mail, MessageSquare, Shield, ShieldCheck, TrendingUp, User, AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { getAdminStudentDetail } from "@/lib/admin/get-admin-student-detail";
import {
  adjustStudentAccessAction,
  blockStudentAccessAction,
  disableStudentAccountAction,
  replyStudentTicketAction,
  resetStudentAccountAction,
  resetStudentPasswordAction,
  sendStudentResetLinkAction,
  setStudentAccessEndDateAction,
  unblockStudentAccessAction,
  updateStudentEmailAction,
} from "./actions";

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR");
}

function formatDateTime(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleString("pt-BR");
}

const statusBadgeVariant = (isAccessActive: boolean, profileStatus: string) => {
  if (profileStatus === "blocked") {
    return "border-amber-400/30 bg-amber-400/10 text-amber-300";
  }
  if (!isAccessActive) {
    return "border-rose-400/30 bg-rose-400/10 text-rose-300";
  }
  return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
};

const statusLabel = (isAccessActive: boolean, profileStatus: string) => {
  if (profileStatus === "blocked") return "Bloqueado";
  if (!isAccessActive) return "Vencido";
  return "Ativo";
};

const mobilityLabel = (level: number | null) => {
  if (level === null) return "Não informado";
  if (level === 0) return "Sem limitação";
  if (level === 1) return "Leve";
  if (level === 2) return "Moderada";
  if (level === 3) return "Significativa";
  if (level === 4) return "Alta";
  return "Muito alta";
};

const supportTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    acesso: "Acesso",
    material: "Material",
    exercicio: "Exercício",
    plataforma: "Plataforma",
    sugestao: "Sugestão",
    outro: "Outro",
  };
  return map[type] ?? type;
};

const supportStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    open: "Aberto",
    reviewing: "Em análise",
    answered: "Respondido",
    closed: "Fechado",
  };
  return map[status] ?? status;
};

const supportStatusBadge = (status: string) => {
  switch (status) {
    case "open":
      return "border-rose-400/30 bg-rose-400/10 text-rose-300";
    case "reviewing":
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    case "answered":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "closed":
      return "border-white/10 bg-white/5 text-slate-300";
    default:
      return "border-white/10 bg-white/5 text-slate-300";
  }
};

export default async function AdminAlunoDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const resolvedParams = await params;
  const studentId = resolvedParams.studentId;
  const resolvedSearchParams = await searchParams;

  const student = await getAdminStudentDetail(studentId);

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

  const successMessage = resolvedSearchParams.success
    ? {
        "email-updated": "E-mail atualizado com sucesso.",
        "password-reset": "Senha provisória redefinida com sucesso.",
        "reset-link-sent": "Link de redefinição enviado.",
        "access-extended": "Acesso ajustado com sucesso.",
        "end-date-set": "Data final do acesso atualizada.",
        "student-blocked": "Aluno bloqueado.",
        "student-unblocked": "Aluno reativado.",
        "student-disabled": "Conta desativada.",
        "account-reset": "Conta resetada com sucesso.",
        "ticket-replied": "Resposta enviada ao aluno.",
      }[resolvedSearchParams.success]
    : null;

  const errorMessage = resolvedSearchParams.error
    ? {
        "email-invalid": "Informe um e-mail válido.",
        "email-exists": "Este e-mail já está em uso por outro usuário.",
        "email-error": "Erro ao atualizar e-mail do aluno.",
        "password-short": "A senha deve ter pelo menos 6 caracteres.",
        "password-error": "Erro ao redefinir senha do aluno.",
        "reset-link-error": "Não foi possível enviar o link agora.",
        "access-error": "Erro ao ajustar acesso do aluno.",
        "end-date-past": "A data final não pode ser anterior a hoje.",
        "end-date-invalid": "Data inválida.",
        "end-date-error": "Erro ao definir data final.",
        "block-error": "Erro ao bloquear aluno.",
        "unblock-error": "Erro ao reativar aluno.",
        "disable-error": "Erro ao desativar conta.",
        "reset-confirm-error": 'Confirmação inválida. Digite "RESETAR" para continuar.',
        "reset-progress-error": "Erro ao remover progresso do aluno.",
        "reset-evolution-error": "Erro ao remover evolução do aluno.",
        "ticket-reply-error": "Erro ao responder ticket.",
        "ticket-notification-error": "Resposta salva, mas não foi possível gerar notificação.",
        "days-invalid": "Valor de dias inválido.",
      }[resolvedSearchParams.error]
    : null;

  const { access, progress, evolution, supportTickets } = student;
  const inProgressDays = progress.list.filter((p) => p.status === "in_progress");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/alunos">
            <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Central do aluno</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-300">
              Gerencie acesso, progresso, suporte e dados gerais deste aluno.
            </p>
          </div>
        </div>
        <Badge className={`w-fit border px-2 py-1 ${statusBadgeVariant(access.isActive, student.profileStatus)}`}>
          {statusLabel(access.isActive, student.profileStatus)}
        </Badge>
      </div>

      {successMessage && (
        <Card className="border-emerald-400/20 bg-emerald-400/5">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            <p className="text-sm text-emerald-300">{successMessage}</p>
          </CardContent>
        </Card>
      )}

      {errorMessage && (
        <Card className="border-rose-400/20 bg-rose-400/5">
          <CardContent className="flex items-center gap-3 p-4">
            <Shield className="h-5 w-5 shrink-0 text-rose-400" />
            <p className="text-sm text-rose-300">{errorMessage}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <User className="h-5 w-5 text-yellow-400" />
              Dados do aluno
            </CardTitle>
            <p className="text-xs text-slate-400">Informações de acesso e identificação</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Nome</p>
                <p className="text-sm font-medium text-white">{student.fullName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400">E-mail</p>
                <p className="text-sm font-medium text-white break-all">{student.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Papel</p>
                <p className="text-sm font-medium text-white capitalize">{student.role}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Status da conta</p>
                <p className="text-sm font-medium text-white capitalize">{student.profileStatus}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Acesso</p>
                <p className="text-sm font-medium text-white">{access.isActive ? "Ativo" : "Inativo"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Dias restantes</p>
                <p className="text-sm font-medium text-white">{access.daysRemaining > 0 ? `${access.daysRemaining} dias` : "Sem acesso"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Criado em</p>
                <p className="text-sm font-medium text-white">{formatDateTime(student.createdAt)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Auth criado em</p>
                <p className="text-sm font-medium text-white">{formatDateTime(student.authCreatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Mail className="h-5 w-5 text-yellow-400" />
              Acesso e autenticação
            </CardTitle>
            <p className="text-xs text-slate-400">Gerencie e-mail e senha de acesso</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={updateStudentEmailAction} className="space-y-2">
              <input type="hidden" name="studentId" value={student.id} />
              <div className="space-y-1">
                <Label htmlFor="newEmail" className="text-xs text-slate-300">Alterar e-mail de acesso</Label>
                <Input
                  id="newEmail"
                  name="newEmail"
                  type="email"
                  defaultValue={student.email}
                  className="border-white/10 bg-white/5 text-sm text-slate-200"
                />
              </div>
              <Button type="submit" variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                Salvar e-mail
              </Button>
            </form>

            <form action={resetStudentPasswordAction} className="space-y-2">
              <input type="hidden" name="studentId" value={student.id} />
              <div className="space-y-1">
                <Label htmlFor="newPassword" className="text-xs text-slate-300">Redefinir senha provisória</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Nova senha"
                  className="border-white/10 bg-white/5 text-sm text-slate-200"
                />
              </div>
              <Button type="submit" variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                Redefinir senha
              </Button>
            </form>

            <form action={sendStudentResetLinkAction} className="space-y-2">
              <input type="hidden" name="studentId" value={student.id} />
              <p className="text-[11px] text-slate-400">Enviar/regerar link de redefinição por e-mail.</p>
              <Button type="submit" variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                Enviar link de redefinição
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <User className="h-5 w-5 text-yellow-400" />
              Aspectos gerais
            </CardTitle>
            <p className="text-xs text-slate-400">Perfil e dados autorrelatados do aluno</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Idade</p>
                <p className="text-sm font-medium text-white">{student.age ? `${student.age} anos` : "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Altura</p>
                <p className="text-sm font-medium text-white">{student.heightCm ? `${student.heightCm} cm` : "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Peso atual</p>
                <p className="text-sm font-medium text-white">{evolution.currentWeightKg ? `${evolution.currentWeightKg} kg` : "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Mobilidade atual</p>
                <p className="text-sm font-medium text-white">{mobilityLabel(evolution.currentMobilityLevel)}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-xs text-slate-400">Objetivo principal</p>
                <p className="text-sm font-medium text-white">{student.mainGoal || "—"}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-xs text-slate-400">Limitações / observações</p>
                <p className="text-sm font-medium text-white">{student.limitations || "—"}</p>
              </div>
            </div>
            {student.avatarUrl && (
              <div className="mt-4">
                <p className="mb-2 text-xs text-slate-400">Avatar</p>
                <img src={student.avatarUrl} alt="Avatar" className="h-16 w-16 rounded-full border border-white/10 object-cover" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
              Progresso da Jornada
            </CardTitle>
            <p className="text-xs text-slate-400">
              Treino {progress.totalCompletedDays}/30 • {progress.progressPercentage}% concluído
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-slate-400">Concluídos</p>
                <p className="text-lg font-bold text-emerald-300">{progress.totalCompletedDays}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-slate-400">Em andamento</p>
                <p className="text-lg font-bold text-amber-300">{progress.totalInProgressDays}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-slate-400">Último treino</p>
                <p className="text-lg font-bold text-white">{progress.lastCompletedDay ? `Treino ${String(progress.lastCompletedDay).padStart(2, "0")}` : "—"}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Jornada</span>
                <span>{progress.progressPercentage}%</span>
              </div>
              <Progress value={progress.progressPercentage} className="h-2 bg-white/10 [&_[data-slot=progress-indicator]]:bg-yellow-400" />
            </div>

            {inProgressDays.length > 0 && (
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
                <p className="text-xs text-amber-300">
                  Aluno possui {inProgressDays.length} treino(s) em andamento/pendente(s).
                </p>
              </div>
            )}

            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const dayProgress = progress.list.find((p) => p.journey_day === day);
                if (!dayProgress) return null;

                const statusVariant = dayProgress.status === "completed"
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                  : "border-amber-400/30 bg-amber-400/10 text-amber-300";

                return (
                  <div key={day} className={`rounded-xl border p-3 ${statusVariant}`}>
                    <p className="text-sm font-medium text-white">Treino {String(day).padStart(2, "0")}</p>
                    <p className="text-[10px] text-slate-400 capitalize">
                      {dayProgress.status === "completed" ? "Concluído" : "Em andamento"}
                    </p>
                    {dayProgress.completed_at && (
                      <p className="text-[10px] text-slate-500">{formatDate(dayProgress.completed_at)}</p>
                    )}
                    {dayProgress.notes && (
                      <p className="text-[10px] text-slate-400 line-clamp-2">{dayProgress.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
              Evolução percebida
            </CardTitle>
            <p className="text-xs text-slate-400">Dados autorrelatados pelo aluno</p>
          </CardHeader>
          <CardContent>
            {evolution.checkins.length === 0 ? (
              <p className="text-xs text-slate-400">Nenhum check-in de evolução registrado.</p>
            ) : (
              <div className="space-y-3">
                {evolution.checkins.slice(0, 5).map((checkin) => (
                  <div key={checkin.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-medium text-white">{formatDateTime(checkin.created_at)}</p>
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div>
                        <p className="text-[10px] text-slate-400">Peso</p>
                        <p className="text-sm text-white">{checkin.weight_kg ? `${checkin.weight_kg} kg` : "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Mobilidade</p>
                        <p className="text-sm text-white">{mobilityLabel(checkin.mobility_level)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Disposição</p>
                        <p className="text-sm text-white">{checkin.energy_level ? `${checkin.energy_level}/5` : "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Dor / desconforto</p>
                        <p className="text-sm text-white">{checkin.pain_level !== null ? `${checkin.pain_level}/5` : "—"}</p>
                      </div>
                    </div>
                    {checkin.notes && (
                      <p className="mt-2 text-xs text-slate-300 line-clamp-2">{checkin.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Mail className="h-5 w-5 text-yellow-400" />
              Acesso
            </CardTitle>
            <p className="text-xs text-slate-400">Gerencie o período de acesso do aluno</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-white">Dias restantes</p>
                  <p className="text-xs text-slate-400">
                    {access.isActive && access.daysRemaining > 0
                      ? `${access.daysRemaining} dias`
                      : "Sem acesso ativo"}
                  </p>
                </div>
                <Badge className={`border ${statusBadgeVariant(access.isActive, student.profileStatus)}`}>
                  {statusLabel(access.isActive, student.profileStatus)}
                </Badge>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                Vencimento: {formatDate(access.endsAt)} • Fonte: {access.source ?? "—"}
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <form action={adjustStudentAccessAction} className="space-y-2">
                <input type="hidden" name="studentId" value={student.id} />
                <div className="space-y-1">
                  <Label className="text-[10px] text-slate-400">Ajustar dias</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" name="days" value="10" variant="ghost" size="sm" className="border border-emerald-400/30 text-emerald-300 hover:bg-emerald-400/10">
                      +10
                    </Button>
                    <Button type="submit" name="days" value="45" variant="ghost" size="sm" className="border border-emerald-400/30 text-emerald-300 hover:bg-emerald-400/10">
                      +45
                    </Button>
                    <Button type="submit" name="days" value="-10" variant="ghost" size="sm" className="border border-rose-400/30 text-rose-300 hover:bg-rose-400/10">
                      -10
                    </Button>
                    <Button type="submit" name="days" value="-20" variant="ghost" size="sm" className="border border-rose-400/30 text-rose-300 hover:bg-rose-400/10">
                      -20
                    </Button>
                    <Button type="submit" name="days" value="-30" variant="ghost" size="sm" className="border border-rose-400/30 text-rose-300 hover:bg-rose-400/10">
                      -30
                    </Button>
                  </div>
                </div>
              </form>

              <form action={setStudentAccessEndDateAction} className="space-y-2">
                <input type="hidden" name="studentId" value={student.id} />
                <div className="space-y-1">
                  <Label htmlFor="endDate" className="text-[10px] text-slate-400">Definir data final manualmente</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    className="border-white/10 bg-white/5 text-xs text-slate-200"
                  />
                  <Button type="submit" variant="outline" size="sm" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                    Salvar data
                  </Button>
                </div>
              </form>
            </div>

            <div className="flex flex-wrap gap-2">
              {student.profileStatus === "blocked" ? (
                <form action={unblockStudentAccessAction}>
                  <input type="hidden" name="studentId" value={student.id} />
                  <Button type="submit" variant="outline" className="border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10">
                    Reativar acesso
                  </Button>
                </form>
              ) : (
                <form action={blockStudentAccessAction}>
                  <input type="hidden" name="studentId" value={student.id} />
                  <Button type="submit" variant="outline" className="border-amber-400/40 text-amber-300 hover:bg-amber-400/10">
                    Bloquear acesso
                  </Button>
                </form>
              )}
              <form action={disableStudentAccountAction}>
                <input type="hidden" name="studentId" value={student.id} />
                <Button type="submit" variant="outline" className="border-rose-400/40 text-rose-300 hover:bg-rose-400/10">
                  Desativar conta
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <MessageSquare className="h-5 w-5 text-yellow-400" />
              Suporte do aluno
            </CardTitle>
            <p className="text-xs text-slate-400">Chamados abertos por este aluno</p>
          </CardHeader>
          <CardContent>
            {supportTickets.length === 0 ? (
              <p className="text-xs text-slate-400">Nenhum ticket de suporte encontrado.</p>
            ) : (
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-white">{ticket.subject}</p>
                      <Badge variant="outline" className={`${supportStatusBadge(ticket.status)} border px-1.5 py-0 text-[10px]`}>
                        {supportStatusLabel(ticket.status)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {supportTypeLabel(ticket.type)} • {formatDate(ticket.created_at)}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">{ticket.message}</p>
                    {ticket.admin_notes && (
                      <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3">
                        <p className="text-xs font-medium text-emerald-300">Resposta do suporte</p>
                        <p className="mt-1 text-xs text-slate-300">{ticket.admin_notes}</p>
                      </div>
                    )}
                    {(ticket.status === "open" || ticket.status === "reviewing") && (
                      <form action={replyStudentTicketAction} className="mt-3 space-y-2">
                        <input type="hidden" name="studentId" value={student.id} />
                        <input type="hidden" name="ticketId" value={ticket.id} />
                        <Textarea
                          name="replyMessage"
                          placeholder="Escreva sua resposta..."
                          className="min-h-[80px] border-white/10 bg-white/5 text-sm text-slate-200 placeholder:text-slate-500"
                        />
                        <Button type="submit" variant="outline" className="border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10">
                          Responder ticket
                        </Button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-rose-400/10 bg-rose-400/5">
        <CardContent className="flex items-start gap-3 p-5">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-200">Aviso sobre dor e limitações</p>
            <p className="text-xs leading-relaxed text-slate-400">
              Evolução não significa forçar mais. Se houver dor aguda, tontura, formigamento ou desconforto intenso, interrompa o exercício e procure orientação profissional.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-400/10 bg-amber-400/5">
        <CardContent className="flex items-start gap-3 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-200">Zona de perigo</p>
            <p className="text-xs leading-relaxed text-slate-400">
              Ações abaixo são irreversíveis ou afetam diretamente o aluno. Use apenas se necessário e com clareza.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#10161A] border-rose-400/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            Resetar conta do zero
          </CardTitle>
          <p className="text-xs text-slate-400">
            Esta ação remove progresso e check-ins do aluno. Use apenas se necessário.
          </p>
        </CardHeader>
        <CardContent>
          <form action={resetStudentAccountAction} className="space-y-2">
            <input type="hidden" name="studentId" value={student.id} />
            <div className="space-y-1">
              <Label htmlFor="confirmation" className="text-xs text-slate-300">
                Digite RESETAR para confirmar
              </Label>
              <Input
                id="confirmation"
                name="confirmation"
                placeholder="RESETAR"
                className="border-white/10 bg-white/5 text-sm text-slate-200"
              />
            </div>
            <Button type="submit" variant="destructive" className="w-full border-rose-400/40 bg-rose-400/10 text-rose-300 hover:bg-rose-400/20">
              Resetar conta do zero
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
