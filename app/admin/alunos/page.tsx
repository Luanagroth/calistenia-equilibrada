"use client";

import { useState } from "react";
import { ArrowLeft, Search, Eye, Plus, Ban, RotateCcw, CheckCircle2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type StudentStatus = "ativo" | "vencido" | "bloqueado";

interface Student {
  id: string;
  name: string;
  email: string;
  status: StudentStatus;
  daysRemaining: number;
  startDate: string;
  endDate: string;
}

const initialStudents: Student[] = [
  { id: "1", name: "Ana Silva", email: "ana@email.com", status: "ativo", daysRemaining: 38, startDate: "2026-05-16", endDate: "2026-06-30" },
  { id: "2", name: "Carlos Lima", email: "carlos@email.com", status: "ativo", daysRemaining: 25, startDate: "2026-06-05", endDate: "2026-06-30" },
  { id: "3", name: "Marina Costa", email: "marina@email.com", status: "ativo", daysRemaining: 12, startDate: "2026-06-18", endDate: "2026-06-30" },
  { id: "4", name: "Pedro Santos", email: "pedro@email.com", status: "vencido", daysRemaining: 0, startDate: "2026-04-01", endDate: "2026-05-01" },
  { id: "5", name: "Julia Alves", email: "julia@email.com", status: "bloqueado", daysRemaining: 0, startDate: "2026-05-10", endDate: "2026-06-10" },
  { id: "6", name: "Lucas Oliveira", email: "lucas@email.com", status: "ativo", daysRemaining: 40, startDate: "2026-05-20", endDate: "2026-06-30" },
];

const statusBadgeVariant = (status: StudentStatus) => {
  switch (status) {
    case "ativo":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "vencido":
      return "border-rose-400/30 bg-rose-400/10 text-rose-300";
    case "bloqueado":
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
  }
};

export default function AdminAlunosPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleExtend = (id: string) => {
    showToast(`Acesso estendido em 45 dias (simulação).`);
  };

  const handleBlock = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "bloqueado" as StudentStatus, daysRemaining: 0 } : s))
    );
    showToast("Aluno bloqueado (simulação).");
  };

  const handleReactivate = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "ativo" as StudentStatus, daysRemaining: 30 } : s))
    );
    showToast("Aluno reativado (simulação).");
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

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

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Search className="h-5 w-5 text-yellow-400" />
            Buscar aluno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-white/10 bg-white/5 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
          />
        </CardContent>
      </Card>

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="text-lg text-white">Lista de alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filtered.map((student) => (
              <div
                key={student.id}
                className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">{student.name}</p>
                  <p className="text-xs text-slate-400">{student.email}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge variant="outline" className={`${statusBadgeVariant(student.status)} border text-[10px] px-1.5 py-0`}>
                      {student.status}
                    </Badge>
                    <span className="text-[11px] text-slate-400">
                      {student.daysRemaining > 0 ? `${student.daysRemaining} dias restantes` : "Sem acesso"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {student.startDate} → {student.endDate}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
                    <Eye className="mr-1 h-4 w-4" />
                    Detalhes
                  </Button>
                  {student.status !== "bloqueado" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-300 hover:text-white hover:bg-white/10"
                      onClick={() => handleExtend(student.id)}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      45 dias
                    </Button>
                  )}
                  {student.status === "ativo" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
                      onClick={() => handleBlock(student.id)}
                    >
                      <Ban className="mr-1 h-4 w-4" />
                      Bloquear
                    </Button>
                  )}
                  {student.status === "bloqueado" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                      onClick={() => handleReactivate(student.id)}
                    >
                      <RotateCcw className="mr-1 h-4 w-4" />
                      Reativar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-6 py-4 shadow-2xl shadow-black/30">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <p className="text-sm text-emerald-300">{toast}</p>
          </div>
        </div>
      )}
    </div>
  );
}
