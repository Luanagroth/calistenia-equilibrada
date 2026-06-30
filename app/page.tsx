import { ArrowRight, CheckCircle2, Dumbbell, ShieldCheck, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  "7 eBooks premium em ordem lógica",
  "Plano guiado de 30 dias",
  "Área do aluno com login",
  "Checklist diário de evolução",
  "Biblioteca de exercícios",
  "Acompanhamento de progresso",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden px-6 py-10 md:px-10 lg:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_35%),radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              Método digital para iniciantes
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
              Jornada 30 Dias para destravar seu corpo com calistenia equilibrada
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Receba 7 eBooks premium + acesso ao Espaço do Aluno para seguir
              treinos, registrar hábitos, acompanhar sua evolução e criar uma
              rotina de mobilidade e força funcional pelo celular.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                Começar por R$67
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                Ver como funciona
              </Button>
            </div>

            <p className="mt-4 text-sm text-slate-400">
              Programa de 30 dias com acesso à plataforma por tempo limitado.
            </p>
          </div>

          <Card className="border-white/10 bg-white/10 text-white shadow-2xl backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-300">Espaço do Aluno</p>
                  <h2 className="text-2xl font-semibold">Dia 04 de 30</h2>
                </div>

                <div className="rounded-2xl bg-emerald-400 p-3 text-slate-950">
                  <Smartphone className="h-6 w-6" />
                </div>
              </div>

              <div className="mb-6 rounded-2xl bg-slate-950/70 p-5">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-slate-300">Progresso da jornada</span>
                  <span className="text-emerald-300">13%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[13%] rounded-full bg-emerald-400" />
                </div>
              </div>

              <div className="space-y-3">
                {benefits.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl bg-white/5 p-3 text-sm text-slate-200"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex items-center gap-3">
                  <Dumbbell className="h-5 w-5 text-emerald-300" />
                  <div>
                    <p className="font-medium">Treino de hoje</p>
                    <p className="text-sm text-slate-300">
                      Mobilidade + estabilidade • 20 minutos
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}