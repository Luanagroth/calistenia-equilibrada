import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Dumbbell, Play, Shield, AlertTriangle, TrendingDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExerciseDetail {
  slug: string;
  name: string;
  category: string;
  level: string;
  duration: string;
  goal: string;
  muscles: string[];
  steps: string[];
  commonErrors: string[];
  easierVersion: string;
  whenToStop: string;
  safety: string;
}

const exercises: ExerciseDetail[] = [
  {
    slug: "mobilidade-cervical",
    name: "Mobilidade cervical",
    category: "Mobilidade",
    level: "Base",
    duration: "5 min",
    goal: "Liberar tensão do pescoço e melhorar amplitude de movimento.",
    muscles: ["Cervical", "Trapézio superior"],
    steps: [
      "Sentado ou em pé, mantenha a coluna ereta.",
      "Incline a cabeça lentamente para o lado direito, aproximando a orelha do ombro.",
      "Mantenha a posição por 20 a 30 segundos.",
      "Repita para o lado esquerdo.",
      "Faça movimentos circulares lentos para cada lado.",
    ],
    commonErrors: [
      "Forçar a amplitude além do conforto",
      "Levantar o ombro durante a inclinação",
      "Fazer movimentos rápidos e bruscos",
    ],
    easierVersion: "Apoie a cabeça com a mão durante a inclinação para reduzir o peso.",
    whenToStop: "Se sentir dor aguda, formigamento ou tontura.",
    safety: "Dor leve de alongamento pode acontecer, mas dor aguda, formigamento ou desconforto intenso são sinais para interromper o exercício.",
  },
  {
    slug: "rotacao-de-ombros",
    name: "Rotação de ombros",
    category: "Mobilidade",
    level: "Base",
    duration: "3 min",
    goal: "Preparar a articulação do ombro para movimentos do dia a dia.",
    muscles: ["Ombros", "Escápula"],
    steps: [
      "Fique em pé ou sentado com os braços relaxados ao lado do corpo.",
      "Leve os ombros para frente em movimento circular.",
      "Faça 10 rotações para frente.",
      "Repita 10 rotações para trás.",
      "Mantenha o ritmo lento e controlado.",
    ],
    commonErrors: [
      "Elevar os ombros em direção às orelhas",
      "Fazer rotações muito rápidas",
      "Usar impulso do corpo",
    ],
    easierVersion: "Reduza a amplitude do movimento se sentir tensão.",
    whenToStop: "Se sentir dor no ombro ou na região cervical.",
    safety: "Interrompa se houver dor aguda. Consulte um profissional se a dor persistir.",
  },
  {
    slug: "alongamento-toracico",
    name: "Alongamento torácico",
    category: "Mobilidade",
    level: "Inicial",
    duration: "4 min",
    goal: "Abrir o peito e melhorar a postura geral.",
    muscles: ["Peito", "Ombros", "Coluna torácica"],
    steps: [
      "Fique em pé ou sentado com a coluna ereta.",
      "Entrelace os dedos das mãos atrás das costas.",
      "Leve os braços para trás e para cima, abrindo o peito.",
      "Mantenha a posição por 20 a 30 segundos.",
      "Repita 3 vezes.",
    ],
    commonErrors: [
      "Arquear a lombar excessivamente",
      "Prender a respiração",
      "Fazer o movimento com impulso",
    ],
    easierVersion: "Mantenha os braços na altura da cintura se não conseguir levantar.",
    whenToStop: "Se sentir dor na lombar ou nos ombros.",
    safety: "Respeite seus limites. Não force a amplitude.",
  },
  {
    slug: "prancha-com-joelhos",
    name: "Prancha com joelhos",
    category: "Estabilidade",
    level: "Inicial",
    duration: "3 séries de 30s",
    goal: "Ativar o core sem impacto sobre a lombar.",
    muscles: ["Core", "Quadríceps", "Ombros"],
    steps: [
      "Apoie os antebraços no chão, alinhados com os ombros.",
      "Apoie os joelhos no chão, mantendo o corpo em linha reta.",
      "Mantenha o abdômen contraído e a coluna neutra.",
      "Segure a posição pelo tempo indicado.",
      "Repita as séries com descanso de 30s entre elas.",
    ],
    commonErrors: [
      "Deixar a região lombar cair",
      "Levantar o quadril excessivamente",
      "Prender a respiração",
    ],
    easierVersion: "Reduza o tempo de cada série para 15 ou 20 segundos.",
    whenToStop: "Se sentir dor na lombar ou no pescoço.",
    safety: "Se houver dor aguda, pare imediatamente.",
  },
  {
    slug: "ponte-de-gluteos",
    name: "Ponte de glúteos",
    category: "Força funcional",
    level: "Base",
    duration: "3 séries de 12 repetições",
    goal: "Fortalecer glúteos e posteriores de coxa.",
    muscles: ["Glúteos", "Isquiotibiais", "Core"],
    steps: [
      "Deite-se de costas com os joelhos flexionados e os pés apoiados no chão.",
      "Levante o quadril até formar uma linha reta dos ombros aos joelhos.",
      "Mantenha a posição por 1 a 2 segundos no topo.",
      "Desça lentamente sem tocar o chão com o quadril.",
      "Repita as repetições e séries indicadas.",
    ],
    commonErrors: [
      "Arquear a lombar no topo do movimento",
      "Levantar o quadril muito alto",
      "Fazer o movimento rápido demais",
    ],
    easierVersion: "Faça séries com menos repetições ou segure a posição por menos tempo.",
    whenToStop: "Se sentir dor na lombar ou nos joelhos.",
    safety: "Controle o movimento. Não use impulso.",
  },
  {
    slug: "agachamento-profundo-assistido",
    name: "Agachamento profundo assistido",
    category: "Mobilidade",
    level: "Progressivo",
    duration: "3 séries de 8 repetições",
    goal: "Melhorar mobilidade de quadril, tornozelos e controle corporal.",
    muscles: ["Quadril", "Joelhos", "Tornozelos", "Core"],
    steps: [
      "Apoie-se em um apoio estável (parede, cadeira ou barra).",
      "Posicione os pés na largura dos ombros.",
      "Desça lentamente até onde for confortável.",
      "Mantenha o peito aberto e o peso nos calcanhares.",
      "Suba controlando o movimento.",
    ],
    commonErrors: [
      "Deixar os joelhos caírem para dentro",
      "Levantar os calcanhares do chão",
      "Inclinar o tronco excessivamente para frente",
    ],
    easierVersion: "Use um apoio mais alto ou reduza a amplitude do agachamento.",
    whenToStop: "Se sentir dor nos joelhos, tornozelos ou na região lombar.",
    safety: "Respeite seus limites. O agachamento profundo não deve causar dor.",
  },
  {
    slug: "flexao-inclinada",
    name: "Flexão inclinada",
    category: "Força funcional",
    level: "Progressivo",
    duration: "3 séries de 10 repetições",
    goal: "Progressão da flexão com menos carga corporal.",
    muscles: ["Peito", "Tríceps", "Ombros", "Core"],
    steps: [
      "Apoie as mãos em uma superfície elevada (cadeira, mesa ou parede).",
      "Mantenha o corpo em linha reta da cabeça aos pés.",
      "Desça o peito em direção à superfície.",
      "Mantenha os cotovelos próximos ao corpo.",
      "Empurre de volta à posição inicial.",
    ],
    commonErrors: [
      "Deixar a lombar cair",
      "Levantar o quadril excessivamente",
      "Afastar os cotovelos do corpo",
    ],
    easierVersion: "Aumente a altura do apoio para reduzir a dificuldade.",
    whenToStop: "Se sentir dor nos ombros, punhos ou na região lombar.",
    safety: "Controle a descida. Não deixe o corpo cair.",
  },
];

const getExercise = (slug: string): ExerciseDetail | undefined => {
  return exercises.find((ex) => ex.slug === slug);
};

export default function ExercicioDetalhePage({ params }: { params: { slug: string } }) {
  const exercise = getExercise(params.slug);

  if (!exercise) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/aluno/exercicios">
          <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{exercise.name}</h1>
          <p className="mt-1 text-slate-300">{exercise.goal}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="border-sky-400/30 bg-sky-400/10 text-sky-300">
          {exercise.category}
        </Badge>
        <Badge variant="outline" className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
          {exercise.level}
        </Badge>
        <span className="flex items-center gap-1.5 text-sm text-slate-400">
          <Clock className="h-4 w-4 text-yellow-400" />
          {exercise.duration}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Dumbbell className="h-5 w-5 text-yellow-400" />
              Áreas trabalhadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {exercise.muscles.map((muscle) => (
                <span
                  key={muscle}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Passo a passo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-slate-300">
              {exercise.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-yellow-400">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              Erros comuns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-slate-300">
              {exercise.commonErrors.map((error, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 flex size-2 shrink-0 rounded-full bg-orange-400" />
                  {error}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <TrendingDown className="h-5 w-5 text-sky-400" />
              Versão mais fácil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300">{exercise.easierVersion}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Shield className="h-5 w-5 text-yellow-400" />
              Quando parar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300">{exercise.whenToStop}</p>
          </CardContent>
        </Card>

        <Card className="border-rose-400/10 bg-rose-400/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Shield className="h-5 w-5 text-rose-400" />
              Aviso de segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-slate-300">{exercise.safety}</p>
          </CardContent>
        </Card>
      </div>

      <Button className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
        <Play className="mr-2 h-4 w-4 fill-current" />
        Adicionar ao treino de hoje
      </Button>
    </div>
  );
}
