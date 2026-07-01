import { createClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/auth/get-user-access";
import { createSupportTicketAction } from "./actions";

import { ArrowLeft, HelpCircle, Mail, MessageSquare, Send, Shield, Clock, CheckCircle2, AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

type SupportType = "acesso" | "material" | "exercicio" | "plataforma" | "sugestao" | "outro";

const supportTypes: { value: SupportType; label: string }[] = [
  { value: "acesso", label: "Problema de acesso" },
  { value: "material", label: "Dúvida sobre material" },
  { value: "exercicio", label: "Dúvida sobre exercício" },
  { value: "plataforma", label: "Dificuldade com a plataforma" },
  { value: "sugestao", label: "Sugestão" },
  { value: "outro", label: "Outro" },
];

const faqs = [
  {
    question: "Por quanto tempo tenho acesso ao Espaço do Aluno?",
    answer: "A Jornada tem duração de 30 dias, com acesso à plataforma por tempo limitado conforme a oferta.",
  },
  {
    question: "Os eBooks ficam disponíveis?",
    answer: "Os materiais digitais fazem parte da compra e devem ser acessados conforme as regras do produto na Hotmart.",
  },
  {
    question: "Posso refazer os treinos?",
    answer: "Sim. Você pode revisar os treinos dentro do período de acesso.",
  },
  {
    question: "Senti dor em um exercício. O que fazer?",
    answer: "Interrompa o movimento, escolha uma versão mais leve e procure orientação profissional se a dor for intensa ou persistente.",
  },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "answered":
      return "border-emerald-400/30 bg-emerald-400/5 text-emerald-300";
    case "reviewing":
      return "border-amber-400/30 bg-amber-400/5 text-amber-300";
    case "closed":
      return "border-white/10 bg-white/5 text-slate-300";
    default:
      return "border-rose-400/30 bg-rose-400/5 text-rose-300";
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case "open":
      return "aberto";
    case "reviewing":
      return "em análise";
    case "answered":
      return "respondido";
    case "closed":
      return "fechado";
    default:
      return status;
  }
};

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR");
}

export default async function AlunoSuportePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const access = await getUserAccess();
  const supabase = await createClient();

  let tickets: {
    id: string;
    type: string;
    subject: string;
    message: string;
    status: string;
    created_at: string;
  }[] = [];

  if (access.user) {
    const { data } = await supabase
      .from("support_tickets")
      .select("id, type, subject, message, status, created_at")
      .eq("user_id", access.user.id)
      .order("created_at", { ascending: false });

    tickets = data ?? [];
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Suporte</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Precisa de ajuda com acesso, materiais, plataforma ou dúvidas sobre a jornada? Envie sua solicitação.
          </p>
        </div>
        <Badge className="border-yellow-400/30 bg-yellow-400/10 text-yellow-300">
          Atendimento ao aluno
        </Badge>
      </div>

      {params.success === "ticket-created" && (
        <Card className="border-emerald-400/20 bg-emerald-400/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-300">Solicitação registrada.</p>
              <p className="text-xs text-slate-300">Nossa equipe retornará em breve.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {params.error && (
        <Card className="border-rose-400/20 bg-rose-400/5">
          <CardContent className="p-3 text-xs text-rose-300">
            {params.error === "missing-type" && "Selecione o tipo de dúvida."}
            {params.error === "missing-subject" && "Informe um assunto válido."}
            {params.error === "missing-message" && "Descreva sua dúvida com mais detalhes."}
            {params.error === "ticket-error" && "Erro ao enviar solicitação. Tente novamente mais tarde."}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <MessageSquare className="h-5 w-5 text-yellow-400" />
              Abrir solicitação
            </CardTitle>
            <p className="text-xs text-slate-400">Preencha os dados abaixo e entraremos em contato.</p>
          </CardHeader>
          <CardContent>
            <form action={createSupportTicketAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-xs text-slate-300">Tipo de dúvida</Label>
                <select
                  id="type"
                  name="type"
                  required
                  className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-slate-200 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20 outline-none"
                >
                  <option value="" disabled>Selecione...</option>
                  {supportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-xs text-slate-300">Assunto</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Resumo da sua dúvida"
                  required
                  className="border-white/10 bg-white/5 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs text-slate-300">Mensagem</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Descreva sua dúvida ou problema com o máximo de detalhes possível..."
                  required
                  className="min-h-[140px] border-white/10 bg-white/5 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20"
              >
                <Send className="mr-2 h-4 w-4" />
                Enviar solicitação
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <HelpCircle className="h-5 w-5 text-yellow-400" />
                Antes de enviar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                  Verifique se está usando o mesmo e-mail da compra
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                  Confira sua caixa de spam ou promoções
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                  Descreva o problema com detalhes
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                  Em dúvidas sobre exercício, informe em qual movimento sentiu dificuldade
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Mail className="h-5 w-5 text-yellow-400" />
                Canais de atendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">E-mail</p>
                  <p className="text-sm font-medium text-white">suporte@calisteniaequilibrada.com</p>
                </div>
                <Badge className="border-yellow-400/30 bg-yellow-400/10 text-yellow-300 text-[10px] px-1.5 py-0">
                  Responderemos em breve
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">Prazo de resposta</p>
                  <p className="text-sm font-medium text-white">Até 2 dias úteis</p>
                </div>
                <Clock className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="text-sm font-medium text-white">Atendimento em horário comercial</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Clock className="h-5 w-5 text-yellow-400" />
            Histórico de solicitações
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="text-xs text-slate-400">Você ainda não abriu nenhuma solicitação.</p>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{ticket.subject}</p>
                      <Badge variant="outline" className={`${statusBadgeVariant(ticket.status)} border text-[10px] px-1.5 py-0`}>
                        {statusLabel(ticket.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1">{ticket.message}</p>
                    <p className="text-[10px] text-slate-500">
                      {supportTypes.find((st) => st.value === ticket.type)?.label ?? ticket.type} • {formatDate(ticket.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-rose-400/10 bg-rose-400/5">
        <CardContent className="flex items-start gap-3 p-5">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-200">Sobre dores e limitações</p>
            <p className="text-xs leading-relaxed text-slate-400">
              Este suporte não substitui avaliação médica, fisioterapêutica ou acompanhamento de profissional de educação física. Dor aguda, tontura, formigamento, falta de ar intensa ou desconforto forte são sinais para interromper o exercício e procurar orientação profissional.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
