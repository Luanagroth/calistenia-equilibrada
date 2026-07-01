"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Ban, CheckCircle2, AlertTriangle, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type AccessStatus = "ativo" | "vencendo" | "vencido" | "bloqueado";

interface AccessPeriod {
  id: string;
  studentName: string;
  status: AccessStatus;
  daysRemaining: number;
  startDate: string;
  endDate: string;
}

const initialAccesses: AccessPeriod[] = [
  { id: "1", studentName: "Ana Silva", status: "ativo", daysRemaining: 38, startDate: "2026-05-16", endDate: "2026-06-30" },
  { id: "2", studentName: "Carlos Lima", status: "vencendo", daysRemaining: 5, startDate: "2026-06-05", endDate: "2026-06-30" },
  { id: "3", studentName: "Marina Costa", status: "ativo", daysRemaining: 12, startDate: "2026-06-18", endDate: "2026-06-30" },
  { id: "4", studentName: "Pedro Santos", status: "vencido", daysRemaining: 0, startDate: "2026-04-01", endDate: "2026-05-01" },
  { id: "5", studentName: "Julia Alves", status: "bloqueado", daysRemaining: 0, startDate: "2026-05-10", endDate: "2026-06-10" },
  { id: "6", studentName: "Lucas Oliveira", status: "ativo", daysRemaining: 40, startDate: "2026-05-20", endDate: "2026-06-30" },
];

const summary = [
  { label: "Ativos", value: "4", variant: "emerald" as const },
  { label: "Vencendo em 7 dias", value: "1", variant: "amber" as const },
  { label: "Vencidos", value: "1", variant: "rose" as const },
  { label: "Bloqueados", value: "1", variant: "slate" as const },
];

export default function AdminAcessosPage() {
  const [accesses] = useState<AccessPeriod[]>(initialAccesses);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd45 = () => {
    showToast("45 dias adicionados (simulação).");
  };

  const handleEndAccess = () => {
    showToast("Acesso encerrado (simulação).");
  };

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label} className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{item.value}</div>
            </CardContent>
          </Card>
        ))}
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
            {accesses.map((access) => (
              <div
                key={access.id}
                className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">{access.studentName}</p>
                  <p className="text-xs text-slate-400">
                    {access.startDate} → {access.endDate}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge variant="outline" className={`border-${access.status === "ativo" ? "emerald" : access.status === "vencendo" ? "amber" : access.status === "vencido" ? "rose" : "slate"}-400/30 bg-${access.status === "ativo" ? "emerald" : access.status === "vencendo" ? "amber" : access.status === "vencido" ? "rose" : "slate"}-400/10 text-${access.status === "ativo" ? "emerald" : access.status === "vencendo" ? "amber" : access.status === "vencido" ? "rose" : "slate"}-300 border text-[10px] px-1.5 py-0`}>
                      {access.status}
                    </Badge>
                    <span className="text-[11px] text-slate-400">
                      {access.daysRemaining > 0 ? `${access.daysRemaining} dias restantes` : "Sem acesso"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                    onClick={handleAdd45}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Adicionar 45 dias
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-rose-400/30 bg-rose-400/5 text-rose-300 hover:bg-rose-400/10"
                    onClick={handleEndAccess}
                  >
                    <Ban className="mr-1 h-4 w-4" />
                    Encerrar acesso
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-400/10 bg-amber-400/5">
        <CardContent className="flex items-start gap-3 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-200">Aviso</p>
            <p className="text-xs leading-relaxed text-slate-400">
              Na versão final, essas ações atualizarão a tabela access_periods diretamente no Supabase.
            </p>
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
