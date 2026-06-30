"use client";

import { ArrowRight, HelpCircle, Mail, MessageSquare, Send, Shield, Clock, CheckCircle2, AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

const tickets = [
  {
    id: "TK-001",
    title: "Dúvida sobre acesso aos materiais",
    status: "respondido",
    date: "Há 2 dias",
  },
  {
    id: "TK-002",
    title: "Dificuldade na prancha com joelhos",
    status: "em_analise",
    date: "Há 5 horas",
  },
];

export default function SuportePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suporte</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Precisa de ajuda com acesso, materiais, plataforma ou dúvidas sobre a jornada? Envie sua solicitação.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
            Atendimento ao aluno
          </Badge>
          <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            Ver perguntas frequentes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-emerald-400" />
              Abrir solicitação
            </CardTitle>
            <p className="text-xs text-slate-400">Preencha os dados abaixo e entraremos em contato.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs text-slate-300">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  className="border-white/10 bg-white/5 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-emerald-400/50 focus-visible:ring-emerald-400/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-slate-300">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="border-white/10 bg-white/5 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-emerald-400/50 focus-visible:ring-emerald-400/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-300">Tipo de dúvida</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {supportTypes.map((type) => (
                  <div
                    key={type.value}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition-colors hover:border-emerald-400/30 hover:bg-emerald-400/5"
                  >
                    <span className="flex size-3 shrink-0 rounded-full border border-white/20" />
                    {type.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-xs text-slate-300">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Descreva sua dúvida ou problema com o máximo de detalhes possível..."
                className="min-h-[120px] border-white/10 bg-white/5 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-emerald-400/50 focus-visible:ring-emerald-400/20"
              />
            </div>

            <Button className="w-full bg-emerald-400 text-slate-950 hover:bg-emerald-400/90">
              <Send className="mr-2 h-4 w-4" />
              Enviar solicitação
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="h-5 w-5 text-emerald-400" />
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

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-emerald-400" />
                Canais de atendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">E-mail</p>
                  <p className="text-sm font-medium text-slate-200">suporte@calisteniaequilibrada.com</p>
                </div>
                <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300 text-[10px] px-1.5 py-0">
                  Responderemos em breve
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">Prazo de resposta</p>
                  <p className="text-sm font-medium text-slate-200">Até 2 dias úteis</p>
                </div>
                <Clock className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="text-sm font-medium text-slate-200">Atendimento em horário comercial</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <HelpCircle className="h-5 w-5 text-emerald-400" />
            Perguntas frequentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question} className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-slate-200">{faq.question}</p>
                <p className="text-xs leading-relaxed text-slate-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-emerald-400" />
            Histórico de solicitações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-200">{ticket.title}</p>
                  <p className="text-[10px] text-slate-500">{ticket.id} • {ticket.date}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    ticket.status === "respondido"
                      ? "border-emerald-400/30 bg-emerald-400/5 text-emerald-300"
                      : "border-amber-400/30 bg-amber-400/5 text-amber-300"
                  }
                >
                  {ticket.status === "respondido" ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Respondido
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Em análise
                    </span>
                  )}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-rose-400/10 bg-rose-400/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-rose-400" />
            Sobre dores e limitações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-slate-300">
            Este suporte não substitui avaliação médica, fisioterapêutica ou acompanhamento de profissional de educação física. Dor aguda, tontura, formigamento, falta de ar intensa ou desconforto forte são sinais para interromper o exercício e procurar orientação profissional.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
