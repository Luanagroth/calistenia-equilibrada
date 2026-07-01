import { ArrowLeft, Plus, Ban, CheckCircle2, AlertTriangle, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getStudents } from "@/lib/admin/get-students";
import { extendAccessAction, endAccessAction } from "./actions";

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR");
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
  if (profileStatus === "blocked") return "bloqueado";
  if (!isAccessActive) return "vencido";
  return "ativo";
};

export default async function AdminAcessosPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const students = await getStudents();

  const activeStudents = students.filter((s) => s.isAccessActive && s.profileStatus !== "blocked").length;
  const expiredStudents = students.filter((s) => !s.isAccessActive && s.profileStatus !== "blocked").length;
  const blockedStudents = students.filter((s) => s.profileStatus === "blocked").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Acessos</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Gerencie períodos de acesso dos alunos.
          </p>
        </div>
      </div>

      {params.success && (
        <Card className="bg-[#10161A] border-emerald-400/30 shadow-lg shadow-emerald-400/10">
          <CardContent className="py-3">
            <p className="text-sm text-emerald-300">
              {params.success === "access-extended" && "Acesso estendido com sucesso."}
              {params.success === "access-ended" && "Acesso encerrado com sucesso."}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-300">{activeStudents}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Vencidos/sem acesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-300">{expiredStudents}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Bloqueados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-300">{blockedStudents}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Calendar className="h-5 w-5 text-yellow-400" />
            Períodos de acesso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">{student.fullName}</p>
                  <p className="text-xs text-slate-400">
                    {formatDate(student.startsAt)} → {formatDate(student.endsAt)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge variant="outline" className={`${statusBadgeVariant(student.isAccessActive, student.profileStatus)} border text-[10px] px-1.5 py-0`}>
                      {statusLabel(student.isAccessActive, student.profileStatus)}
                    </Badge>
                    <span className="text-[11px] text-slate-400">
                      {student.isAccessActive && student.daysRemaining > 0
                        ? `${student.daysRemaining} dias restantes`
                        : "Sem acesso"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {student.profileStatus !== "blocked" && (
                    <form action={extendAccessAction}>
                      <input type="hidden" name="studentId" value={student.id} />
                      <Button type="submit" variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                        <Plus className="mr-1 h-4 w-4" />
                        Adicionar 45 dias
                      </Button>
                    </form>
                  )}
                  {student.profileStatus !== "blocked" && student.isAccessActive && (
                    <form action={endAccessAction}>
                      <input type="hidden" name="studentId" value={student.id} />
                      <Button type="submit" variant="outline" size="sm" className="border-rose-400/30 bg-rose-400/5 text-rose-300 hover:bg-rose-400/10">
                        <Ban className="mr-1 h-4 w-4" />
                        Encerrar acesso
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
