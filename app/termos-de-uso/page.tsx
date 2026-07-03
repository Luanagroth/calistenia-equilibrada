import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

const sections = [
  {
    title: "1. Aceitacao dos termos",
    body: [
      "Ao acessar a plataforma Calistenia Equilibrada, o usuario declara ciencia destes Termos de Uso e da Politica de Privacidade.",
    ],
  },
  {
    title: "2. Sobre o Calistenia Equilibrada",
    body: [
      "A plataforma e um produto digital educativo com jornada de treinos, mobilidade, habitos, materiais e acompanhamento de evolucao percebida.",
    ],
  },
  {
    title: "3. Acesso a plataforma",
    body: [
      "O acesso e individual, realizado por e-mail e senha. Em alguns casos, uma senha provisoria pode ser enviada no primeiro acesso.",
      "O usuario deve trocar a senha quando necessario, proteger seus dados de acesso e nao compartilhar a conta com terceiros.",
    ],
  },
  {
    title: "4. PIN de acesso rapido",
    body: [
      "O PIN e opcional, funciona apenas no dispositivo e nao substitui o login com e-mail e senha.",
      "Se o usuario sair da conta, sera necessario fazer login novamente para voltar a utilizar a plataforma.",
    ],
  },
  {
    title: "5. Conteudo educativo e responsabilidade",
    body: [
      "Os exercicios e orientacoes sao gerais e nao substituem avaliacao medica, fisioterapeutica, nutricional ou de educador fisico.",
      "O usuario deve respeitar seus limites e interromper a pratica se sentir dor forte, tontura, falta de ar, formigamento, mal-estar ou desconforto intenso.",
      "Pessoas com condicoes de saude, gravidez, lesoes ou limitacoes devem buscar orientacao profissional antes de praticar.",
    ],
  },
  {
    title: "6. Uso adequado",
    body: [
      "O usuario concorda em usar a plataforma de forma pessoal, nao compartilhar login, nao copiar, revender ou distribuir os materiais, nao tentar acessar areas restritas e nao usar o servico de forma ilegal ou prejudicial.",
    ],
  },
  {
    title: "7. Materiais digitais",
    body: [
      "eBooks, videos, textos e demais conteudos sao protegidos e destinados ao uso pessoal do aluno.",
    ],
  },
  {
    title: "8. Suporte",
    body: [
      "O suporte pode ser feito pela plataforma ou pelo e-mail suporte@calisteniaequilibrada.com.br.",
    ],
  },
  {
    title: "9. Disponibilidade e atualizacoes",
    body: [
      "A plataforma pode receber melhorias, correcoes e atualizacoes ao longo do tempo. Tambem podem ocorrer instabilidades temporarias.",
    ],
  },
  {
    title: "10. Cancelamento, prazo de acesso e reembolsos",
    body: [
      "O prazo de acesso segue a oferta adquirida. Pedidos de cancelamento ou reembolso seguem as regras da plataforma de pagamento ou da oferta vigente.",
      "Detalhes comerciais podem ser informados no momento da compra.",
    ],
  },
  {
    title: "11. Limitacao de responsabilidade",
    body: [
      "A plataforma nao garante resultados especificos, como emagrecimento, ganho de massa, cura de dores ou melhora obrigatoria.",
      "Os resultados variam conforme rotina, consistencia, condicao individual e outros fatores.",
    ],
  },
  {
    title: "12. Alteracoes nos termos",
    body: [
      "Estes termos podem ser atualizados ao longo do tempo. O uso continuo da plataforma indica ciencia dessas alteracoes.",
    ],
  },
  {
    title: "13. Contato",
    body: [
      "Para duvidas relacionadas a estes termos, entre em contato pelo e-mail suporte@calisteniaequilibrada.com.br.",
    ],
  },
] as const;

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-[#070A0D] px-6 py-16 text-white md:px-10 lg:px-20">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3">
          <Link href="/" className="text-sm text-slate-400 transition hover:text-yellow-300">
            Voltar para a home
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-white">Termos de Uso</h1>
          <p className="text-sm text-slate-400">Ultima atualizacao: 03/07/2026</p>
        </div>

        <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
          <CardContent className="space-y-6 p-6 md:p-8">
            {sections.map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-slate-300">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-300">
                Este documento e uma versao inicial para a versao 1.0 e pode ser revisado posteriormente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
