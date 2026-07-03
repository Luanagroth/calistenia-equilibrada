import {
  ChevronDown,
  CheckCircle2,
  Clock,
  HelpCircle,
  Mail,
  MessageSquare,
  Send,
  Shield,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getUserAccess } from "@/lib/auth/get-user-access";
import { createClient } from "@/lib/supabase/server";

import { createSupportTicketAction } from "./actions";

type SupportType = "acesso" | "material" | "exercicio" | "plataforma" | "sugestao" | "outro";

const supportTypes: { value: SupportType; label: string }[] = [
  { value: "acesso", label: "Problema de acesso" },
  { value: "material", label: "Duvida sobre material" },
  { value: "exercicio", label: "Duvida sobre exercicio" },
  { value: "plataforma", label: "Dificuldade com a plataforma" },
  { value: "sugestao", label: "Sugestao" },
  { value: "outro", label: "Outro" },
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
      return "em analise";
    case "answered":
      return "respondido";
    case "closed":
      return "fechado";
    default:
      return status;
  }
};

function formatDate(value: string | null) {
  if (!value) return "-";
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
    <div className="min-w-0 space-y-8">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-white">Suporte</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Precisa de ajuda com acesso, materiais, plataforma ou duvidas sobre a jornada? Envie sua solicitacao.
          </p>
        </div>
        <Badge className="w-fit border-yellow-400/30 bg-yellow-400/10 text-yellow-300">
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
              <p className="text-sm font-medium text-emerald-300">Solicitacao registrada.</p>
              <p className="text-xs text-slate-300">Nossa equipe retornara em breve.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {params.error && (
        <Card className="border-rose-400/20 bg-rose-400/5">
          <CardContent className="p-3 text-xs text-rose-300">
            {params.error === "missing-type" && "Selecione o tipo de duvida."}
            {params.error === "missing-subject" && "Informe um assunto valido."}
            {params.error === "missing-message" && "Descreva sua duvida com mais detalhes."}
            {params.error === "ticket-error" && "Erro ao enviar solicitacao. Tente novamente mais tarde."}
          </CardContent>
        </Card>
      )}

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <Card className="min-w-0 border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <MessageSquare className="h-5 w-5 text-yellow-400" />
              Abrir solicitacao
            </CardTitle>
            <p className="text-xs text-slate-400">Preencha os dados abaixo e entraremos em contato.</p>
          </CardHeader>
          <CardContent className="min-w-0">
            <form action={createSupportTicketAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-xs text-slate-300">Tipo de duvida</Label>
                <div className="relative">
                  <select
                    id="type"
                    name="type"
                    required
                    defaultValue=""
                    className="h-10 w-full max-w-full appearance-none rounded-xl border border-white/10 bg-[#10161A] px-3 pr-10 text-sm text-slate-100 outline-none transition focus:border-[#FACC15] focus:ring-2 focus:ring-[#FACC15]/20"
                  >
                    <option value="" disabled className="bg-[#10161A] text-slate-300">
                      Selecione...
                    </option>
                    {supportTypes.map((type) => (
                      <option
                        key={type.value}
                        value={type.value}
                        className="bg-[#10161A] text-slate-100"
                      >
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-xs text-slate-300">Assunto</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Resumo da sua duvida"
                  required
                  className="w-full max-w-full border-white/10 bg-white/5 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs text-slate-300">Mensagem</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Descreva sua duvida ou problema com o maximo de detalhes possivel..."
                  required
                  className="min-h-[140px] w-full max-w-full border-white/10 bg-white/5 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20 hover:bg-yellow-300 sm:w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                Enviar solicitacao
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-6">
          <Card className="min-w-0 border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
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
                  <span className="min-w-0 break-words">Verifique se esta usando o mesmo e-mail da compra</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                  <span className="min-w-0 break-words">Confira sua caixa de spam ou promocoes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                  <span className="min-w-0 break-words">Descreva o problema com detalhes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                  <span className="min-w-0 break-words">
                    Em duvidas sobre exercicio, informe em qual movimento sentiu dificuldade
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="min-w-0 border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Mail className="h-5 w-5 text-yellow-400" />
                Canais de atendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <p className="text-xs text-slate-400">E-mail</p>
                  <p className="break-all text-sm font-medium text-white">
                    suporte@calisteniaequilibrada.com
                  </p>
                </div>
                <Badge className="w-fit border-yellow-400/30 bg-yellow-400/10 px-1.5 py-0 text-[10px] text-yellow-300">
                  Responderemos em breve
                </Badge>
              </div>

              <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <p className="text-xs text-slate-400">Prazo de resposta</p>
                  <p className="break-words text-sm font-medium text-white">Ate 2 dias uteis</p>
                </div>
                <Clock className="h-4 w-4 shrink-0 text-yellow-400" />
              </div>

              <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="break-words text-sm font-medium text-white">
                    Atendimento em horario comercial
                  </p>
                </div>
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="min-w-0 border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Clock className="h-5 w-5 text-yellow-400" />
            Historico de solicitacoes
          </CardTitle>
        </CardHeader>
        <CardContent className="min-w-0">
          {tickets.length === 0 ? (
            <p className="text-xs text-slate-400">Voce ainda nao abriu nenhuma solicitacao.</p>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="min-w-0 space-y-2">
                    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                      <p className="min-w-0 break-words text-sm font-medium text-white">{ticket.subject}</p>
                      <Badge
                        variant="outline"
                        className={`${statusBadgeVariant(ticket.status)} w-fit border px-1.5 py-0 text-[10px]`}
                      >
                        {statusLabel(ticket.status)}
                      </Badge>
                    </div>
                    <p className="break-words text-xs leading-relaxed text-slate-300">{ticket.message}</p>
                    <p className="break-words text-[10px] leading-relaxed text-slate-400">
                      {supportTypes.find((st) => st.value === ticket.type)?.label ?? ticket.type} •{" "}
                      {formatDate(ticket.created_at)}
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
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium text-slate-200">Sobre dores e limitacoes</p>
            <p className="break-words text-xs leading-relaxed text-slate-400">
              Este suporte nao substitui avaliacao medica, fisioterapeutica ou acompanhamento de profissional de educacao fisica. Dor aguda, tontura, formigamento, falta de ar intensa ou desconforto forte sao sinais para interromper o exercicio e procurar orientacao profissional.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
