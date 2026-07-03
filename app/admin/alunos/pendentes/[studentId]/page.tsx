import { ArrowLeft, CheckCircle2, User, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

import { getPendingStudentById } from "@/lib/admin/get-pending-students";
import { approvePendingStudentAction } from "./actions";

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR");
}

export default async function PendingStudentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const resolvedParams = await params;
  const studentId = resolvedParams.studentId;
  const resolvedSearchParams = await searchParams;

  const student = await getPendingStudentById(studentId);

  if (!student) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/alunos/pendentes">
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/alunos/pendentes">
            <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Detalhes do aluno</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-300">
              Verifique os dados e libere o acesso após validar o pagamento.
            </p>
          </div>
        </div>
        <Badge className="border-rose-400/30 bg-rose-400/10 text-rose-300 px-3 py-1">
          Pendente
        </Badge>
      </div>

      {resolvedSearchParams.error && (
        <Card className="border-rose-400/30 bg-rose-400/10">
          <CardContent className="py-3">
            <p className="text-sm text-rose-300">
              {resolvedSearchParams.error === "invalid-id" && "ID inválido."}
              {resolvedSearchParams.error === "student-not-found" && "Aluno não encontrado."}
              {resolvedSearchParams.error === "create-failed" && "Erro ao criar usuário no Supabase Auth."}
              {resolvedSearchParams.error === "profile-failed" && "Erro ao criar perfil do aluno."}
              {resolvedSearchParams.error === "access-failed" && "Erro ao criar período de acesso."}
              {resolvedSearchParams.error === "update-failed" && "Erro ao atualizar status do aluno."}
            </p>
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
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="text-xs text-slate-400">Nome completo</p>
              <p className="text-sm font-medium text-white">{student.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400">E-mail</p>
              <p className="text-sm font-medium text-white">{student.email}</p>
            </div>

            {student.phone && (
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Telefone</p>
                <p className="text-sm font-medium text-white">{student.phone}</p>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-xs text-slate-400">Data da solicitação</p>
              <p className="text-sm font-medium text-white">{formatDate(student.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        {student.receiptUrl && (
          <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <FileText className="h-5 w-5 text-yellow-400" />
                Comprovante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={student.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-yellow-400 hover:text-yellow-300 underline"
              >
                Ver comprovante
              </a>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardContent className="p-6">
          <form action={approvePendingStudentAction}>
            <input type="hidden" name="studentId" value={student.id} />
            <Button
              type="submit"
              className="bg-emerald-400 text-slate-950 hover:bg-emerald-400/90 shadow-lg shadow-emerald-400/20"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Liberar acesso
            </Button>
          </form>
          <p className="mt-3 text-xs text-slate-400">
            Isso criará um usuário com senha temporária "calistenia123" e dará 45 dias de acesso.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}