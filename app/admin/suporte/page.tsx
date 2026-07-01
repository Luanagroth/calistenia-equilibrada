import { ArrowLeft, MessageSquare, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getSupportTickets } from "@/lib/admin/get-support-tickets";
import { markTicketReviewingAction, markTicketAnsweredAction, closeTicketAction } from "./actions";

type TicketStatus = "open" | "reviewing" | "answered" | "closed";

const statusBadgeVariant = (status: TicketStatus) => {
  switch (status) {
    case "open":
      return "border-rose-400/30 bg-rose-400/10 text-rose-300";
    case "reviewing":
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    case "answered":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "closed":
      return "border-white/10 bg-white/5 text-slate-300";
  }
};

const statusLabel = (status: TicketStatus) => {
  switch (status) {
    case "open":
      return "Aberto";
    case "reviewing":
      return "Em análise";
    case "answered":
      return "Respondido";
    case "closed":
      return "Fechado";
  }
};

export default async function AdminSuportePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const tickets = await getSupportTickets();

  const counts = {
    open: tickets.filter((t) => t.status === "open").length,
    reviewing: tickets.filter((t) => t.status === "reviewing").length,
    answered: tickets.filter((t) => t.status === "answered").length,
    closed: tickets.filter((t) => t.status === "closed").length,
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
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      {params.success && (
        <Card className="border-emerald-400/20 bg-emerald-400/5">
          <CardContent className="p-3 text-xs text-emerald-300">
            {params.success === "mark-reviewing" && "Ticket marcado como em análise."}
            {params.success === "mark-answered" && "Ticket marcado como respondido."}
            {params.success === "mark-closed" && "Ticket fechado."}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Abertos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-300">{counts.open}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Em análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-300">{counts.reviewing}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Respondidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-300">{counts.answered}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Fechados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-300">{counts.closed}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <MessageSquare className="h-5 w-5 text-yellow-400" />
            Tickets de alunos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="text-xs text-slate-400">Nenhum ticket encontrado.</p>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{ticket.aluno}</p>
                      <span className="text-[10px] text-slate-500">{ticket.email}</span>
                      <Badge variant="outline" className={`${statusBadgeVariant(ticket.status as TicketStatus)} border text-[10px] px-1.5 py-0`}>
                        {statusLabel(ticket.status as TicketStatus)}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-300">{ticket.assunto}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{ticket.mensagem}</p>
                    <p className="text-[10px] text-slate-500">
                      {ticket.tipo} • {ticket.id.slice(0, 8)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {ticket.status === "open" && (
                      <form action={markTicketReviewingAction}>
                        <input type="hidden" name="ticketId" value={ticket.id} />
                        <Button type="submit" variant="outline" size="sm" className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10">
                          Marcar em análise
                        </Button>
                      </form>
                    )}
                    {ticket.status === "reviewing" && (
                      <form action={markTicketAnsweredAction}>
                        <input type="hidden" name="ticketId" value={ticket.id} />
                        <Button type="submit" variant="outline" size="sm" className="border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10">
                          Marcar respondido
                        </Button>
                      </form>
                    )}
                    {(ticket.status === "answered" || ticket.status === "reviewing") && (
                      <form action={closeTicketAction}>
                        <input type="hidden" name="ticketId" value={ticket.id} />
                        <Button type="submit" variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                          Fechar
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
    </div>
  );
}
