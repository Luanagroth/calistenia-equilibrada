import { ArrowRight, CheckCircle2, CircleDot, HelpCircle, Lightbulb, Route, Shield, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    title: "Veja o treino liberado",
    description: "A plataforma mostra qual treino seguir, sem você precisar escolher entre dezenas de opções.",
  },
  {
    title: "Faça no seu ritmo",
    description: "Treinos com peso do corpo, foco em mobilidade, força funcional e constância.",
  },
  {
    title: "Registre como foi",
    description: "Marque o que fez e registre energia, dificuldade, desconforto e anotações.",
  },
  {
    title: "Continue do ponto certo",
    description: "Sua evolução fica salva e o próximo treino libera no tempo certo.",
  },
];

const included = [
  {
    title: "30 treinos guiados",
    description: "Uma sequência progressiva para seguir sem montar treino do zero.",
  },
  {
    title: "Plataforma de acompanhamento",
    description: "Veja o treino liberado, seu progresso e seus dias de acesso.",
  },
  {
    title: "Registro de evolução",
    description: "Salve energia, dificuldade, desconforto e anotações depois da prática.",
  },
  {
    title: "Liberação organizada",
    description: "Avance um treino por vez, no tempo certo da jornada.",
  },
  {
    title: "7 eBooks complementares",
    description: "Materiais de apoio para estudar, revisar e acompanhar a prática.",
  },
  {
    title: "Suporte dentro da plataforma",
    description: "Abra chamados quando tiver dúvidas ou precisar de ajuda.",
  },
];


const faqs = [
  {
    question: "Preciso ter experiência com calistenia?",
    answer: "Não. A jornada começa com movimentos simples e progressivos.",
  },
  {
    question: "Preciso de equipamentos?",
    answer: "Não obrigatoriamente. A proposta usa principalmente o peso do corpo e apoios simples, como parede ou cadeira.",
  },
  {
    question: "Os treinos liberam todos de uma vez?",
    answer: "Não. A liberação é organizada para ajudar na constância e evitar pressa.",
  },
  {
    question: "E se eu perder alguns dias?",
    answer: "Você pode retomar do ponto em que parou, mas o acesso continua correndo por calendário.",
  },
  {
    question: "Os eBooks estão inclusos?",
    answer: "Sim. A jornada inclui 7 materiais complementares de apoio.",
  },
  {
    question: "Isso substitui acompanhamento profissional?",
    answer: "Não. É um conteúdo educativo e não substitui avaliação ou orientação profissional.",
  },
];

const appFeatures = [
  "Treinos concluídos",
  "Dias de acesso",
  "Próximo treino liberado",
  "Registro de energia, dificuldade e desconforto",
  "Evolução salva",
  "Materiais de apoio",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070A0D] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#070A0D]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 lg:px-20">
          <Link href="/" className="text-xl font-bold text-white hover:text-yellow-400 transition-colors">
            Calistenia Equilibrada
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <Link href="#como-funciona" className="hover:text-white transition-colors">
              Como funciona
            </Link>
            <Link href="#o-que-inclui" className="hover:text-white transition-colors">
              O que inclui
            </Link>
            <Link href="#faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
          </nav>

          <Button asChild className="bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
            <Link href="/login">Entrar</Link>
          </Button>
        </div>
      </header>

<section className="relative flex min-h-screen items-center px-6 pt-20 pb-16 md:px-10 lg:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.10),transparent_35%),radial-gradient(circle_at_top_left,rgba(250,204,21,0.08),transparent_30%)]" />

<div className="relative mx-auto grid max-w-screen-2xl items-center gap-20 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-base text-slate-300">
              Jornada 30 Treinos • Plataforma + 7 eBooks
            </div>

            <h1 className="max-w-5xl text-5xl font-bold tracking-tight text-white md:text-8xl">
              Pare de juntar vídeos. Comece a seguir um caminho.
            </h1>

            <p className="mt-8 max-w-4xl text-xl leading-8 text-slate-300">
              Uma jornada guiada para começar a se movimentar com clareza, registrar sua evolução e continuar sem depender de exercícios soltos.
            </p>

            <p className="mt-3 text-base text-slate-400">
              Treine com o peso do corpo, siga um treino por vez e acompanhe seu progresso dentro da plataforma.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="px-8 py-6 text-base bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
                <Link href="/login">
                  Começar por R$ 67
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="px-8 py-6 text-base border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <Link href="#como-funciona">
                  Ver como funciona
                </Link>
              </Button>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Acesso à plataforma • 30 treinos guiados • 7 eBooks inclusos
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Treino liberado no tempo certo
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Evolução salva
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Suporte dentro da plataforma
              </span>
            </div>
          </div>

          <div className="relative lg:order-2 lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/60">
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-yellow-400/10" />

              <video
                src="/videos/home/hero-desktop.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="hidden w-full h-auto md:block"
              />

              <video
                src="/videos/home/hero-mobile.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-auto md:hidden"
              />
            </div>
          </div>
        </div>
       </section>

      <section className="bg-[#0B1115] px-6 py-16 md:px-10 lg:px-20">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            <div className="order-2 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/40 lg:order-1">
              <Image
                src="/images/home/hero-treino-casa.png"
                alt="Treino em casa"
                width={1200}
                height={500}
                className="w-full h-auto max-h-[78vh] object-cover"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-yellow-400/10" />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#0B1115] to-transparent opacity-60" />
            </div>

            <div className="order-1 rounded-3xl border border-white/10 bg-[#10161A] p-10 shadow-2xl shadow-black/30 lg:order-2">
              <h2 className="text-4xl font-bold tracking-tight text-white">
                A internet já tem exercício demais. O que falta é sequência.
              </h2>
              <p className="mt-3 text-base text-slate-300">
                Você salva vídeos, promete que vai começar, faz um ou dois dias… e depois trava porque não sabe qual é o próximo passo.
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                O problema quase nunca é falta de vontade. É falta de um caminho simples para seguir.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <Route className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
                  <p className="text-base text-slate-300">Não sei o que fazer hoje</p>
                </div>
                <div className="flex items-start gap-4">
                  <Target className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
                  <p className="text-base text-slate-300">Começo e paro depois de poucos dias</p>
                </div>
                <div className="flex items-start gap-4">
                  <CircleDot className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
                  <p className="text-base text-slate-300">Fico perdido entre vídeos, dicas e planilhas</p>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/10">
                <p className="text-lg font-medium text-white">Vamos juntos nessa jornada?</p>
                <Button asChild variant="outline" className="mt-3 border-white/10 bg-white/5 text-white hover:bg-white/10 h-10 px-5 text-base">
                  <Link href="#como-funciona">
                    Ver como funciona
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="px-6 py-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-5xl">
              Um treino por vez. Uma evolução registrada.{' '}
              <span className="text-yellow-400">Um caminho mais claro.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-slate-300">
              A Calistenia Equilibrada organiza sua prática em uma jornada progressiva. Você acessa o treino liberado, faz no seu ritmo, registra como foi e acompanha sua evolução.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Card key={step.title} className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30 p-6">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 font-semibold text-base">
                      {index + 1}
                    </div>
                    <CardTitle className="text-lg text-white">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-slate-300">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0B1115] px-6 py-16 md:px-10 lg:px-20">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid gap-16 xl:gap-24 lg:grid-cols-[1.15fr_1fr] items-center">
            <div className="flex items-center justify-center">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/40 w-full">
                <Image
                  src="/images/home/mockup-desktop-plataforma.png"
                  alt="Mockup desktop da plataforma"
                  width={1800}
                  height={800}
                  className="hidden h-auto max-h-[95vh] w-full object-cover md:block"
                />
                <Image
                  src="/images/home/mockup-mobile-jornada.png"
                  alt="Mockup mobile da jornada"
                  width={900}
                  height={1400}
                  className="block h-auto w-full max-w-full object-cover md:hidden"
                />
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-yellow-400/10" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#0B1115] to-transparent opacity-60" />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-2xl space-y-8">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                  Tudo organizado em uma plataforma simples de acompanhar.
                </h2>
                <p className="text-lg md:text-xl leading-relaxed text-slate-300">
                  No Início, você vê o próximo treino. Na Jornada, registra sua prática. Na Evolução, acompanha seu histórico. Em Materiais, acessa os eBooks. Em Suporte, tira dúvidas quando precisar.
                </p>

                <ul className="space-y-4 text-base text-slate-300">
                  {appFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="o-que-inclui" className="bg-[#0B1115] px-6 py-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                  O que você recebe na Jornada 30 Treinos
                </h2>
                <p className="text-lg md:text-xl leading-relaxed text-slate-300">
                  Tudo o que precisa para começar com clareza, seguir uma sequência simples e acompanhar sua evolução em um só lugar.
                </p>
              </div>

              <ul className="space-y-4">
                {included.map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">{item.title}</p>
                      <p className="text-base text-slate-300">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#10161A] shadow-2xl shadow-black/40 p-8 md:p-10 space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-yellow-400/10 pointer-events-none" />

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge className="border-yellow-400/30 bg-yellow-400/10 text-yellow-300">Oferta</Badge>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                    Jornada 30 Treinos
                  </h3>
                  <p className="text-base text-slate-300">
                    Para começar com uma rotina simples, guiada e possível de manter.
                  </p>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-5xl md:text-6xl font-bold text-white">R$ 67</span>
                  <span className="text-base text-slate-400">compra única</span>
                </div>

                <ul className="space-y-3 text-base text-slate-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    Acesso à plataforma
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    30 treinos progressivos
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    7 eBooks inclusos
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    Evolução registrada
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    Suporte dentro da plataforma
                  </li>
                </ul>

                <Button size="lg" asChild className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 text-base py-6">
                  <Link href="/login">
                    Começar por R$ 67
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <p className="text-xs text-slate-400 text-center">
                  Após a liberação do acesso, você entra com e-mail e senha.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#0B1115] px-6 py-24 md:px-10 lg:px-20">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Dúvidas comuns antes de começar</h2>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-slate-300">
              Respostas rápidas para o que mais surge antes de dar o primeiro passo.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {faqs.map((item) => (
              <Card key={item.question} className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30 p-6 md:p-8">
                <CardHeader>
                  <CardTitle className="flex items-start gap-4 text-xl md:text-2xl text-white">
                    <HelpCircle className="mt-1 h-6 w-6 shrink-0 text-yellow-400" />
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base md:text-lg text-slate-300">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10 shadow-2xl shadow-black/30">
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-yellow-400/10 pointer-events-none" />
            <div className="relative flex items-start gap-4">
              <Shield className="mt-0.5 h-6 w-6 shrink-0 text-yellow-400" />
              <div>
                <h3 className="text-xl font-semibold text-white">Segurança</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-300">
                  Este conteúdo é educativo e não substitui avaliação ou acompanhamento de profissional de saúde, educação física ou fisioterapia. Em caso de dor forte, tontura, formigamento ou desconforto intenso, interrompa a prática e procure orientação profissional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0B1115] px-6 py-24 md:px-10 lg:px-20">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                  Comece com clareza. Siga um treino por vez.
                </h2>
                <p className="text-lg md:text-xl leading-relaxed text-slate-300">
                  Entre na jornada, registre sua prática e acompanhe sua evolução sem montar tudo do zero.
                </p>
              </div>

              <div className="space-y-4">
                <Button size="lg" asChild className="bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 text-base py-6 px-8">
                  <Link href="/login">
                    Começar por R$ 67
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <p className="text-sm text-slate-400">
                  Acesso à plataforma • 30 treinos guiados • 7 eBooks inclusos
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Card className="w-full max-w-lg bg-[#10161A] border-white/10 shadow-2xl shadow-black/40 rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-yellow-400/10 pointer-events-none" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <Lightbulb className="h-6 w-6 text-yellow-400" />
                    Lembre-se
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-base md:text-lg text-slate-300">
                    Você não precisa fazer tudo perfeito. Precisa de um caminho simples para continuar.
                  </p>
                  <p className="text-base md:text-lg text-slate-300">
                    O próximo treino aparece no tempo certo. A evolução fica salva.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
       </section>

      <footer className="border-t border-white/10 bg-[#070A0D] px-6 py-16 md:px-10 lg:px-20">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Calistenia Equilibrada</h3>
              <p className="text-base text-slate-300 max-w-xs">
                Jornada guiada de 30 treinos para começar com clareza, registrar sua evolução e seguir um treino por vez.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Navegação</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#como-funciona" className="text-base text-slate-300 hover:text-yellow-400 transition-colors">
                    Como funciona
                  </Link>
                </li>
                <li>
                  <Link href="#o-que-inclui" className="text-base text-slate-300 hover:text-yellow-400 transition-colors">
                    O que inclui
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-base text-slate-300 hover:text-yellow-400 transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Acesso / Suporte</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/login" className="text-base text-slate-300 hover:text-yellow-400 transition-colors">
                    Entrar na plataforma
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-base text-slate-300 hover:text-yellow-400 transition-colors">
                    Suporte
                  </Link>
                </li>
                <li>
                  <Link href="/politica-de-privacidade" className="text-base text-slate-300 hover:text-yellow-400 transition-colors">
                    Politica de Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/termos-de-uso" className="text-base text-slate-300 hover:text-yellow-400 transition-colors">
                    Termos de Uso
                  </Link>
                </li>
              </ul>
              <p className="text-sm text-slate-400">
                Após a liberação do acesso, você entra com e-mail e senha.
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © 2026 Calistenia Equilibrada. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
              <Link href="/politica-de-privacidade" className="transition-colors hover:text-yellow-300">
                Politica de Privacidade
              </Link>
              <Link href="/termos-de-uso" className="transition-colors hover:text-yellow-300">
                Termos de Uso
              </Link>
              <span>Conteúdo educativo. Não substitui avaliação ou orientação profissional.</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

