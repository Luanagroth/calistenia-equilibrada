import { ArrowLeft, Eye, User, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

import { getPendingStudents } from "@/lib/admin/get-pending-students";

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR");
}

export default async function PendingStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const pendingStudents = await getPendingStudents();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/alunos">
            <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Novos Alunos</h1>
            <p className="mt-2 max-w-xl text-slate-300">
              Alunos que finalizaram pagamento e aguardam liberação de acesso.
            </p>
          </div>
        </div>
        <Badge className="border-rose-400/30 bg-rose-400/10 text-rose-300 px-3 py-1">
          Alunos 🔴 {pendingStudents.length}
        </Badge>
      </div>

      {params.success && (
        <Card className="bg-[#10161A] border-emerald-400/30">
          <CardContent className="py-3">
            <p className="text-sm text-emerald-300">
              {params.success === "student-approved" && "Acesso liberado com sucesso!"}
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <User className="h-5 w-5 text-yellow-400" />
            Alunos pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingStudents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-300">Nenhum aluno pendente no momento.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">{student.name}</p>
                    <p className="text-xs text-slate-400">{student.email}</p>
                    {student.phone && (
                      <p className="text-xs text-slate-400">{student.phone}</p>
                    )}
                    <div className="flex items-center gap-2 pt-1">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span className="text-[11px] text-slate-400">
                        {formatDate(student.createdAt)}
                      </span>
                    </div>
                  </div>

                  <Link href={`/admin/alunos/pendentes/${student.id}`}>
                    <Button type="button" variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
                      <Eye className="mr-1 h-4 w-4" />
                      Ver detalhes
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}