"use client";

import { useState } from "react";
import { ArrowLeft, MessageSquare, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type TicketStatus = "aberto" | "em_analise" | "respondido";
type TicketType = "acesso" | "material" | "exercicio" | "plataforma";

interface Ticket {
  id: string;
  studentName: string;
  type: TicketType;
  subject: string;
  status: TicketStatus;
  date: string;
}

const initialTickets: Ticket[] = [
  { id: "TK-001", studentName: "Ana Silva", type: "acesso", subject: "Dúvida sobre acesso aos materiais", status: "respondido", date: "2026-06-28" },
  { id: "TK-002", studentName: "Carlos Lima", type: "exercicio", subject: "Dificuldade na prancha com joelhos", status: "em_analise", date: "2026-06-29" },
  { id: "TK-003", studentName: "Marina Costa", type: "material", subject: " eBook 4 não abre", status: "aberto", date: "2026-06-29" },
  { id: "TK-004", studentName: "Pedro Santos", type: "plataforma", subject: "Erro ao marcar checklist", status: "aberto", date: "2026-06-30" },
  { id: "TK-005", studentName: "Julia Alves", type: "acesso", subject: "Acesso expirou", status: "em_analise", date: "2026-06-30" },
];

const statusBadgeVariant = (status: TicketStatus) => {
  switch (status) {
    case "aberto":
      return "border-rose-400/30 bg-rose-400/10 text-rose-300";
    case "em_analise":
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    case "respondido":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
  }
};

export default function AdminSuportePage() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleMarkResolved = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "respondido" as TicketStatus } : t))
    );
    showToast(`Ticket ${id} marcado como respondido.`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Suporte</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Gerencie tickets de alunos e orientações.
          </p>
        </div>
      </div>

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <MessageSquare className="h-5 w-5 text-yellow-400" />
            Tickets de alunos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{ticket.studentName}</p>
                    <Badge variant="outline" className={`${statusBadgeVariant(ticket.status)} border text-[10px] px-1.5 py-0`}>
                      {ticket.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300">{ticket.subject}</p>
                  <p className="text-[11px] text-slate-500">
                    {ticket.id} • {ticket.type} • {ticket.date}
                  </p>
                </div>

                {ticket.status !== "respondido" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                    onClick={() => handleMarkResolved(ticket.id)}
                  >
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Marcar como respondido
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-400/10 bg-yellow-400/5">
        <CardContent className="flex items-start gap-3 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-200">Orientação</p>
            <p className="text-xs leading-relaxed text-slate-400">
              Dúvidas sobre dor ou limitação física devem receber orientação segura e recomendar acompanhamento profissional quando necessário.
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
