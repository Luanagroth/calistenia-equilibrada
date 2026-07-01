"use client";

import { ArrowRight, BookOpen, Download, Info, Shield, TrendingUp, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Ebook = {
  id: number;
  title: string;
  description: string;
  etapa: string;
  fileName: string;
};

const ebooks: Ebook[] = [
  {
    id: 1,
    title: "Descubra Seu Ponto de Partida",
    description: "Um guia inicial para entender seu corpo, suas limitações atuais e começar a jornada com consciência.",
    etapa: "Antes de começar",
    fileName: "/materiais/ebooks/01-descubra-seu-ponto-de-partida.pdf",
  },
  {
    id: 2,
    title: "Método Mobilidade, Força Funcional e Saúde",
    description: "A base do método para evoluir usando o peso do corpo, com foco em mobilidade, controle e constância.",
    etapa: "Fundamento da jornada",
    fileName: "/materiais/ebooks/02-metodo-mobilidade-forca-saude.pdf",
  },
  {
    id: 3,
    title: "Como Evoluir Sem Lesões e Sem Pressa",
    description: "Orientações para respeitar o próprio ritmo, evitar exageros e construir evolução sustentável.",
    etapa: "Segurança e progressão",
    fileName: "/materiais/ebooks/03-como-evoluir-sem-lesoes-e-sem-pressa.pdf",
  },
  {
    id: 4,
    title: "Os Melhores Exercícios para Mobilidade e Saúde",
    description: "Seleção de exercícios essenciais para melhorar mobilidade, consciência corporal e bem-estar.",
    etapa: "Prática guiada",
    fileName: "/materiais/ebooks/04-melhores-exercicios-mobilidade-saude.pdf",
  },
  {
    id: 5,
    title: "Novos Exercícios de Mobilidade, Força e Longevidade",
    description: "Exercícios complementares para ampliar repertório, força funcional e longevidade.",
    etapa: "Evolução prática",
    fileName: "/materiais/ebooks/05-novos-exercicios-mobilidade-forca-longevidade.pdf",
  },
  {
    id: 6,
    title: "Alimentação para Recuperação Muscular e Longevidade",
    description: "Conteúdo educativo sobre alimentação, recuperação e hábitos que apoiam a jornada.",
    etapa: "Recuperação e hábitos",
    fileName: "/materiais/ebooks/06-alimentacao-recuperacao-muscular-longevidade.pdf",
  },
  {
    id: 7,
    title: "Espaço do Leitor e Checklist Diário de Evolução",
    description: "Material de apoio para reflexão, acompanhamento e organização da evolução diária.",
    etapa: "Acompanhamento",
    fileName: "/materiais/ebooks/07-espaco-do-leitor-checklist-diario-evolucao.pdf",
  },
];

export default function MateriaisPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Materiais da jornada</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Acesse os 7 eBooks premium do Método Calistenia Equilibrada na ordem recomendada para acompanhar sua evolução.
          </p>
        </div>
        <Badge className="border-yellow-400/30 bg-yellow-400/10 text-yellow-300 w-fit">
          7 eBooks premium
        </Badge>
      </div>

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <BookOpen className="h-5 w-5 text-yellow-400" />
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
          <Card key={ebook.id} className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30 transition-colors hover:border-white/20 flex flex-col">
            <CardHeader className="pb-3 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-yellow-400/30 bg-yellow-400/10 text-xs font-semibold text-yellow-400">
                  {String(ebook.id).padStart(2, "0")}
                </div>
                <Badge variant="outline" className="border-yellow-400/30 bg-yellow-400/5 text-yellow-300 text-[10px] px-1.5 py-0">
                  {ebook.etapa}
                </Badge>
              </div>
              <div className="space-y-1 pt-2">
                <CardTitle className="text-base font-semibold text-white leading-tight">
                  {ebook.title}
                </CardTitle>
                <p className="text-[11px] text-slate-400">eBook {String(ebook.id).padStart(2, "0")} de 07</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-300">{ebook.description}</p>
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
                  <a href={ebook.fileName} target="_blank" rel="noopener noreferrer">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Abrir eBook
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                  <a href={ebook.fileName} download>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar PDF
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
              Ordem recomendada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                <div>
                  <span className="font-medium text-white">Dia 1:</span> eBook 1 + avaliação inicial
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                <div>
                  <span className="font-medium text-white">Dias 1 a 7:</span> eBooks 2, 3 e 4
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                <div>
                  <span className="font-medium text-white">Dias 8 a 20:</span> eBooks 4 e 5
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                <div>
                  <span className="font-medium text-white">Durante toda a jornada:</span> eBook 6 como apoio de recuperação
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                <div>
                  <span className="font-medium text-white">Dias 1 a 30:</span> eBook 7 como acompanhamento
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Shield className="h-5 w-5 text-yellow-400" />
              Importante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-slate-300">
              Os materiais são complementares à jornada dentro da plataforma. Em caso de dor forte, tontura, formigamento ou desconforto intenso, interrompa a prática e procure orientação profissional.
            </p>
            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Info className="mr-2 h-4 w-4" />
              Ler diretrizes completas
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Trophy className="h-5 w-5 text-yellow-400" />
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
