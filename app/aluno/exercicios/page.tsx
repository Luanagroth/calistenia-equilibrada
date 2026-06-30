"use client";

import { ArrowRight, BookOpen, Dumbbell, Info, Play, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Category = "Todos" | "Mobilidade" | "Estabilidade" | "Força funcional" | "Recuperação";
type Level = "Base" | "Inicial" | "Progressivo";

interface Exercise {
  name: string;
  category: Category;
  level: Level;
  duration: string;
  goal: string;
  muscles: string[];
  tags: string[];
}

const exercises: Exercise[] = [
  {
    name: "Mobilidade cervical",
    category: "Mobilidade",
    level: "Base",
    duration: "5 min",
    goal: "Liberar tensão do pescoço e melhorar amplitude de movimento.",
    muscles: ["Cervical", "Trapézio superior"],
    tags: ["baixo impacto", "sem equipamento"],
  },
  {
    name: "Rotação de ombros",
    category: "Mobilidade",
    level: "Base",
    duration: "3 min",
    goal: "Preparar a articulação do ombro para movimentos do dia a dia.",
    muscles: ["Ombros", "Escápula"],
    tags: ["controle", "baixo impacto"],
  },
  {
    name: "Alongamento torácico",
    category: "Mobilidade",
    level: "Inicial",
    duration: "4 min",
    goal: "Abrir o peito e melhorar a postura geral.",
    muscles: ["Peito", "Ombros", "Coluna torácica"],
    tags: ["baixo impacto", "postura"],
  },
  {
    name: "Agachamento profundo assistido",
    category: "Mobilidade",
    level: "Progressivo",
    duration: "3 séries de 8 repetições",
    goal: "Melhorar mobilidade de quadril, tornozelos e controle corporal.",
    muscles: ["Quadril", "Joelhos", "Tornozelos", "Core"],
    tags: ["controle", "equipamento leve"],
  },
  {
    name: "Mobilidade de tornozelo",
    category: "Mobilidade",
    level: "Base",
    duration: "3 min",
    goal: "Ampliar movimento do tornozelo para suportar cargas.",
    muscles: ["Tornozelos", "Pés"],
    tags: ["baixo impacto", "sem equipamento"],
  },
  {
    name: "Gato e camelo",
    category: "Estabilidade",
    level: "Base",
    duration: "4 min",
    goal: "Mobilizar a coluna e criar consciência corporal.",
    muscles: ["Coluna vertebral", "Core"],
    tags: ["controle", "sem equipamento"],
  },
  {
    name: "Prancha com joelhos",
    category: "Estabilidade",
    level: "Inicial",
    duration: "3 séries de 30s",
    goal: "Ativar o core sem impacto sobre a lombar.",
    muscles: ["Core", "Quadríceps", "Ombros"],
    tags: ["controle", "baixo impacto"],
  },
  {
    name: "Ponte de glúteos",
    category: "Força funcional",
    level: "Base",
    duration: "3 séries de 12 repetições",
    goal: "Fortalecer glúteos e posteriores de coxa.",
    muscles: ["Glúteos", "Isquiotibiais", "Core"],
    tags: ["sem equipamento", "controle"],
  },
  {
    name: "Bird dog",
    category: "Estabilidade",
    level: "Progressivo",
    duration: "3 séries de 8 repetições por lado",
    goal: "Melhorar estabilidade e coordenação entre core e membros.",
    muscles: ["Core", "Glúteos", "Ombros", "Quadril"],
    tags: ["controle", "baixo impacto"],
  },
  {
    name: "Flexão na parede",
    category: "Força funcional",
    level: "Inicial",
    duration: "3 séries de 8 repetições",
    goal: "Introduzir o padrão de flexão com apoio.",
    muscles: ["Peito", "Tríceps", "Ombros", "Core"],
    tags: ["sem equipamento", "iniciante"],
  },
  {
    name: "Flexão inclinada",
    category: "Força funcional",
    level: "Progressivo",
    duration: "3 séries de 10 repetições",
    goal: "Progressão da flexão com menos carga corporal.",
    muscles: ["Peito", "Tríceps", "Ombros", "Core"],
    tags: ["sem equipamento", "progressivo"],
  },
  {
    name: "Respiração e relaxamento",
    category: "Recuperação",
    level: "Base",
    duration: "5 min",
    goal: "Reduzir tensão e ativar o sistema nervoso parassimpático.",
    muscles: ["Diafragma", "Intercostais", "Core"],
    tags: ["baixo impacto", "sem equipamento", "recuperação"],
  },
];

const categoryBadgeVariant = (category: Category) => {
  switch (category) {
    case "Mobilidade":
      return "bg-sky-400/10 text-sky-300 border-sky-400/20";
    case "Estabilidade":
      return "bg-violet-400/10 text-violet-300 border-violet-400/20";
    case "Força funcional":
      return "bg-amber-400/10 text-amber-300 border-amber-400/20";
    case "Recuperação":
      return "bg-emerald-400/10 text-emerald-300 border-emerald-400/20";
    case "Todos":
      return "bg-slate-400/10 text-slate-300 border-slate-400/20";
  }
};

const levelBadgeVariant = (level: Level) => {
  switch (level) {
    case "Base":
      return "border-emerald-400/30 bg-emerald-400/5 text-emerald-300";
    case "Inicial":
      return "border-sky-400/30 bg-sky-400/5 text-sky-300";
    case "Progressivo":
      return "border-amber-400/30 bg-amber-400/5 text-amber-300";
  }
};

export default function ExerciciosPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca de exercícios</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Consulte os movimentos da jornada por categoria, nível e objetivo.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
            Base do método
          </Badge>
          <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            Ver treino de hoje
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="Todos" className="w-full">
        <TabsList variant="line" className="w-full justify-start overflow-x-auto">
          {(["Todos", "Mobilidade", "Estabilidade", "Força funcional", "Recuperação"] as Category[]).map((category) => (
            <TabsTrigger key={category} value={category} className="text-sm">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {(["Todos", "Mobilidade", "Estabilidade", "Força funcional", "Recuperação"] as Category[]).map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {exercises
                .filter((exercise) => category === "Todos" || exercise.category === category)
                .map((exercise) => (
                  <Card key={exercise.name} className="bg-white/5 border-white/10 transition-colors hover:border-white/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-base font-semibold text-slate-100">{exercise.name}</CardTitle>
                        <Badge variant="outline" className={`${categoryBadgeVariant(exercise.category)} border text-[10px] px-1.5 py-0`}>
                          {exercise.category}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Badge variant="outline" className={`${levelBadgeVariant(exercise.level)} border text-[10px] px-1.5 py-0`}>
                          {exercise.level}
                        </Badge>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Dumbbell className="h-3 w-3 text-emerald-400" />
                          {exercise.duration}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-300">{exercise.goal}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {exercise.muscles.map((muscle) => (
                          <span
                            key={muscle}
                            className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-400"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {exercise.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2 py-0.5 text-[10px] text-emerald-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Button variant="outline" className="mt-1 w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                        Ver detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              Como usar a biblioteca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                Comece pelos exercícios do seu treino do dia.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                Faça movimentos lentos e controlados.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                Não force amplitude com dor.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-2 shrink-0 rounded-full bg-emerald-400" />
                Use as versões mais fáceis quando necessário.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-emerald-400" />
              Regra de segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-slate-300">
              Dor leve de alongamento pode acontecer, mas dor aguda, formigamento, tontura ou desconforto intenso são sinais para interromper o exercício.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-emerald-400/20 bg-emerald-400/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Play className="h-5 w-5 text-emerald-400" />
            Exercício recomendado hoje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Agachamento profundo assistido</h3>
            <p className="mt-1 text-sm text-slate-300">
              Melhorar mobilidade de quadril, tornozelos e controle corporal.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
              <Dumbbell className="h-3 w-3 text-emerald-400" />
              3 séries de 8 repetições
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
              <BookOpen className="h-3 w-3 text-emerald-400" />
              Mobilidade
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button className="bg-emerald-400 text-slate-950 hover:bg-emerald-400/90">
              Adicionar ao treino de hoje
              <Play className="ml-2 h-4 w-4 fill-current" />
            </Button>
            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              Ver execução
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
