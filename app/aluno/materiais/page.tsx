"use client";

import { ArrowRight, BookOpen, Download, FileText, Info, Lock, Play, Shield, TrendingUp, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type MaterialStatus = "Recomendado para começar" | "Essencial" | "Em uso na jornada" | "Complementar" | "Apoio" | "Acompanhamento";

interface Ebook {
  id: number;
  title: string;
  category: string;
  description: string;
  status: MaterialStatus;
}

const ebooks: Ebook[] = [
  {
    id: 1,
    title: "Descubra Seu Ponto de Partida",
    category: "Avaliação inicial",
    description: "Faça os testes iniciais e registre sua condição atual antes de começar.",
    status: "Recomendado para começar",
  },
  {
    id: 2,
    title: "O Método para Desenvolver Mobilidade, Força Funcional e Saúde",
    category: "Fundamentos",
    description: "Entenda a proposta da Calistenia Equilibrada e os pilares do método.",
    status: "Essencial",
  },
  {
    id: 3,
    title: "Como Evoluir Sem Lesões e Sem Pressa",
    category: "Progressão segura",
    description: "Aprenda como avançar com consistência, respeitando seus limites.",
    status: "Essencial",
  },
  {
    id: 4,
    title: "Os Melhores Exercícios para Mobilidade e Saúde",
    category: "Exercícios principais",
    description: "Consulte os movimentos base da jornada e o plano prático.",
    status: "Em uso na jornada",
  },
  {
    id: 5,
    title: "Novos Exercícios de Mobilidade, Força e Longevidade",
    category: "Exercícios complementares",
    description: "Aprofunde sua prática com novos movimentos por categoria.",
    status: "Complementar",
  },
  {
    id: 6,
    title: "Alimentação para Recuperação Muscular e Longevidade",
    category: "Recuperação",
    description: "Veja orientações simples sobre proteína, carboidratos, hidratação e sono.",
    status: "Apoio",
  },
  {
    id: 7,
    title: "Seção Premium — Espaço do Leitor e Checklist Diário de Evolução",
    category: "Acompanhamento",
    description: "Use os registros, metas e checklists para acompanhar sua transformação.",
    status: "Acompanhamento",
  },
];

const statusBadgeVariant = (status: MaterialStatus) => {
  switch (status) {
    case "Recomendado para começar":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "Essencial":
      return "border-sky-400/30 bg-sky-400/10 text-sky-300";
    case "Em uso na jornada":
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    case "Complementar":
      return "border-violet-400/30 bg-violet-400/10 text-violet-300";
    case "Apoio":
      return "border-indigo-400/30 bg-indigo-400/10 text-indigo-300";
    case "Acompanhamento":
      return "border-rose-400/30 bg-rose-400/10 text-rose-300";
  }
};

export default function MateriaisPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Materiais da jornada</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Acesse os 7 eBooks premium do Método Calistenia Equilibrada na ordem recomendada para acompanhar sua evolução.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
            7 eBooks premium
          </Badge>
          <Button className="bg-emerald-400 text-slate-950 hover:bg-emerald-400/90">
            Continuar de onde parei
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            Como usar os materiais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-300">
            Os eBooks aprofundam o conteúdo da jornada. Use o Espaço do Aluno para acompanhar os treinos do dia e os materiais para entender o método, revisar exercícios e registrar sua evolução.
          </p>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
              Comece pelo ponto de partida
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
              Siga a ordem da jornada
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
              Use os checklists para registrar evolução
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ebooks.map((ebook) => (
          <Card key={ebook.id} className="bg-white/5 border-white/10 transition-colors hover:border-white/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-semibold text-slate-400">
                  {String(ebook.id).padStart(2, "0")}
                </div>
                <Badge variant="outline" className={`${statusBadgeVariant(ebook.status)} border text-[10px] px-1.5 py-0`}>
                  {ebook.status}
                </Badge>
              </div>
              <div className="space-y-1 pt-2">
                <CardTitle className="text-base font-semibold text-slate-100 leading-tight">
                  {ebook.title}
                </CardTitle>
                <p className="text-[11px] text-slate-400">{ebook.category}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-300">{ebook.description}</p>
              <div className="flex flex-col gap-2">
                <Button className="w-full bg-emerald-400 text-slate-950 hover:bg-emerald-400/90">
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  Abrir material
                </Button>
                <Button variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Ordem recomendada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                <div>
                  <span className="font-medium text-slate-200">Dia 1:</span> eBook 1 + avaliação inicial
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                <div>
                  <span className="font-medium text-slate-200">Dias 1 a 7:</span> eBooks 2, 3 e 4
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                <div>
                  <span className="font-medium text-slate-200">Dias 8 a 20:</span> eBooks 4 e 5
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                <div>
                  <span className="font-medium text-slate-200">Dias 1 a 30:</span> eBook 7 como acompanhamento
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                <div>
                  <span className="font-medium text-slate-200">Durante toda a jornada:</span> eBook 6 como apoio de recuperação
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-emerald-400" />
              Importante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-slate-300">
              Os materiais são educativos e não substituem avaliação médica, fisioterapêutica, nutricional ou acompanhamento de profissional de educação física. Respeite seus limites durante toda a jornada.
            </p>
            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Info className="mr-2 h-4 w-4" />
              Ler diretrizes completas
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-emerald-400" />
            Depois dos 30 dias
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-300">
            Ao concluir a jornada, você poderá revisar seus materiais, comparar sua evolução e se preparar para o próximo nível quando estiver disponível.
          </p>
          <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            Ver próximos passos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
