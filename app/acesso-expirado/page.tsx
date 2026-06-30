import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AcessoExpiradoPage() {
  return (
    <div className="min-h-screen bg-[#070A0D] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400">
            <Shield className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-semibold text-white">Acesso pausado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-center text-slate-300">
            Seu acesso ao Espaço do Aluno não está ativo no momento. Se você acredita que isso é um erro, entre em contato com o suporte.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/login">
              <Button className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para login
              </Button>
            </Link>

            <a href="mailto:suporte@calisteniaequilibrada.com">
              <Button variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Mail className="mr-2 h-4 w-4" />
                Falar com suporte
              </Button>
            </a>
          </div>

          <p className="text-center text-[11px] text-slate-500">
            O acesso é liberado para compradores da Jornada 30 Dias conforme as regras da oferta.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
