import { ArrowLeft, Search, Eye, Plus, Ban, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { getStudents } from "@/lib/admin/get-students";
import { extendStudentAccessAction, blockStudentAction, reactivateStudentAction } from "./actions";

const formatDate = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR");
};

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

export default async function AdminAlunosPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; success?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";

  const students = await getStudents();

  const filtered = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.isAccessActive && s.profileStatus !== "blocked").length;
  const expiredStudents = students.filter((s) => !s.isAccessActive && s.profileStatus !== "blocked").length;
  const blockedStudents = students.filter((s) => s.profileStatus === "blocked").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Alunos</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Gerencie alunos, status de acesso e períodos de validade.
          </p>
        </div>
        <Link href="/admin/alunos/novo">
          <Button className="bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
            <Plus className="mr-2 h-4 w-4" />
            Liberar novo aluno
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total de alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalStudents}</div>
          </CardContent>
        </Card>
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

      {params.success && (
        <Card className="bg-[#10161A] border-emerald-400/30 shadow-lg shadow-emerald-400/10">
          <CardContent className="py-3">
            <p className="text-sm text-emerald-300">
              {params.success === "access-extended" && "Acesso estendido por 45 dias."}
              {params.success === "student-blocked" && "Aluno bloqueado com sucesso."}
              {params.success === "student-reactivated" && "Aluno reativado com sucesso."}
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Search className="h-5 w-5 text-yellow-400" />
            Buscar aluno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form method="get" className="flex gap-2">
            <Input
              name="search"
              placeholder="Buscar por nome ou e-mail..."
              defaultValue={search}
              className="border-white/10 bg-white/5 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
            />
            <Button type="submit" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="text-lg text-white">Lista de alunos</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-slate-300">Você ainda não tem alunos cadastrados.</p>
              <Link href="/admin/alunos/novo">
                <Button className="bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
                  <Plus className="mr-2 h-4 w-4" />
                  Liberar primeiro aluno
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">{student.fullName}</p>
                  <p className="text-xs text-slate-400">{student.email}</p>
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
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <span className="text-[11px] text-slate-400">
                      Progresso: {student.progressPercentage}%
                    </span>
                    <span className="text-[11px] text-slate-500">
                      [{student.completedDays}/30]
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {formatDate(student.endsAt)} • {student.source ?? "—"}
                  </p>
                </div>

                   <div className="flex flex-wrap gap-2">
                     <Link href={`/admin/alunos/${student.id}`}>
                       <Button type="button" variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
                         <Eye className="mr-1 h-4 w-4" />
                         Ver detalhes
                       </Button>
                     </Link>
                     {student.profileStatus !== "blocked" && (
                       <form action={extendStudentAccessAction}>
                         <input type="hidden" name="studentId" value={student.id} />
                         <Button type="submit" variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10">
                           <Plus className="mr-1 h-4 w-4" />
                           45 dias
                         </Button>
                       </form>
                     )}
                     {student.profileStatus !== "blocked" && student.isAccessActive && (
                       <form action={blockStudentAction}>
                         <input type="hidden" name="studentId" value={student.id} />
                         <Button type="submit" variant="outline" size="sm" className="border-red-500/40 text-red-300 hover:bg-red-500/10">
                           <Ban className="mr-1 h-4 w-4" />
                           Bloquear
                         </Button>
                       </form>
                     )}
                     {!student.isAccessActive && (
                       <form action={reactivateStudentAction}>
                         <input type="hidden" name="studentId" value={student.id} />
                         <Button type="submit" variant="outline" size="sm" className="border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10">
                           <RotateCcw className="mr-1 h-4 w-4" />
                           Reativar
                         </Button>
                       </form>
                     )}
                   </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
