import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

const sections = [
  {
    title: "1. Introducao",
    body: [
      "A Calistenia Equilibrada respeita sua privacidade e utiliza dados pessoais para oferecer acesso a plataforma, acompanhamento da jornada, registro da evolucao percebida e suporte ao aluno.",
    ],
  },
  {
    title: "2. Dados que podemos coletar",
    body: [
      "Podemos coletar nome, e-mail, dados de acesso, idade, altura, peso, mobilidade percebida, disposicao/animo, dor ou desconforto relatado, progresso dos treinos, check-ins de evolucao, mensagens enviadas ao suporte e dados tecnicos basicos de navegacao.",
    ],
  },
  {
    title: "3. Como usamos os dados",
    body: [
      "Os dados podem ser usados para liberar acesso a plataforma, identificar o aluno, acompanhar o progresso da jornada, registrar evolucao percebida, prestar suporte, melhorar a experiencia e proteger o acesso.",
    ],
  },
  {
    title: "4. Dados de saude e bem-estar",
    body: [
      "Os dados de saude e bem-estar sao autorrelatados e servem apenas para acompanhamento pessoal e evolucao percebida.",
      "Eles nao representam diagnostico, prescricao ou avaliacao profissional. Sempre que necessario, o usuario deve buscar orientacao de profissional habilitado.",
    ],
  },
  {
    title: "5. Compartilhamento de dados",
    body: [
      "Nao vendemos dados pessoais.",
      "Os dados podem ser tratados por ferramentas necessarias ao funcionamento da plataforma, como Supabase, Vercel e servicos de hospedagem, autenticacao e infraestrutura.",
    ],
  },
  {
    title: "6. Seguranca",
    body: [
      "Adotamos medidas razoaveis de seguranca para proteger os dados pessoais, mas nenhum sistema e totalmente imune a riscos.",
    ],
  },
  {
    title: "7. Direitos do usuario",
    body: [
      "O usuario pode solicitar acesso, correcao, exclusao, atualizacao e informacoes sobre os dados pessoais tratados pela plataforma.",
    ],
  },
  {
    title: "8. Retencao de dados",
    body: [
      "Os dados sao mantidos enquanto a conta ou o acesso estiver ativo, ou enquanto forem necessarios para suporte, seguranca e obrigacoes legais.",
    ],
  },
  {
    title: "9. Criancas e adolescentes",
    body: [
      "O produto e voltado para pessoas capazes de utilizar a plataforma com responsabilidade. Se menores utilizarem o servico, deve haver acompanhamento e responsabilidade dos pais ou responsaveis.",
    ],
  },
  {
    title: "10. Alteracoes nesta politica",
    body: [
      "Esta politica pode ser atualizada ao longo do tempo. Quando houver mudancas importantes, a plataforma pode informar os usuarios por meios adequados.",
    ],
  },
  {
    title: "11. Contato",
    body: [
      "Para duvidas, solicitacoes ou informacoes sobre privacidade, entre em contato pelo e-mail suporte@calisteniaequilibrada.com.br.",
    ],
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#070A0D] px-6 py-16 text-white md:px-10 lg:px-20">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3">
          <Link href="/" className="text-sm text-slate-400 transition hover:text-yellow-300">
            Voltar para a home
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-white">Politica de Privacidade</h1>
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
