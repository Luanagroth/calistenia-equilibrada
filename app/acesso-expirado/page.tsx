import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Mail, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const supportEmail = "suporte@calisteniaequilibrada.com.br";

export default function AcessoExpiradoPage() {
  return (
    <div className="min-h-screen bg-[#070A0D] text-white flex items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/40 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-yellow-400/10 pointer-events-none" />
          <CardHeader className="space-y-1 text-center pt-10 pb-6">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-400">
              <Shield className="h-6 w-6" />
            </div>
            <CardTitle className="text-3xl font-semibold text-white">Seu acesso não está ativo no momento.</CardTitle>
            <p className="text-base text-slate-300 max-w-xl mx-auto">
              Não foi possível liberar sua área da jornada agora. Isso pode acontecer por término do período de acesso, bloqueio administrativo ou acesso ainda não liberado.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 px-8 md:px-10 pb-10">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">O que pode ter acontecido?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 size-2 rounded-full bg-yellow-400/60" />
                  <div>
                    <p className="text-base text-white">Período encerrado</p>
                    <p className="text-sm text-slate-300">Seu tempo de acesso pode ter chegado ao fim.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 size-2 rounded-full bg-yellow-400/60" />
                  <div>
                    <p className="text-base text-white">Acesso ainda não liberado</p>
                    <p className="text-sm text-slate-300">Se a compra ou cadastro foi recente, a liberação pode ainda não ter sido concluída.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 size-2 rounded-full bg-yellow-400/60" />
                  <div>
                    <p className="text-base text-white">Bloqueio administrativo</p>
                    <p className="text-sm text-slate-300">Em alguns casos, o acesso pode ser pausado pela equipe.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Como resolver?</h3>
              <p className="text-sm text-slate-300">
                Se você acredita que isso é um engano ou precisa de ajuda para recuperar o acesso, fale com o suporte.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  className="bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 h-12 text-base"
                >
                  <Link href={`mailto:${supportEmail}?subject=${encodeURIComponent("Ajuda com acesso - Calistenia Equilibrada")}`}>
                    <HelpCircle className="mr-2 h-5 w-5" />
                    Falar com suporte
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-yellow-400 transition-colors h-12 text-base"
                >
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Voltar para login
                  </Link>
                </Button>
                <Link
                  href="/"
                  className="flex items-center justify-center text-sm text-slate-400 hover:text-slate-300 transition-colors"
                >
                  Voltar para página inicial
                </Link>
              </div>
              <p className="text-xs text-slate-500">
                Informe no contato o e-mail usado na plataforma para facilitar a verificação.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
