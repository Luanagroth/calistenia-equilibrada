import { ArrowLeft, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SemPermissaoPage() {
  return (
    <div className="min-h-screen bg-[#070A0D] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-400/10 text-rose-400">
            <Shield className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-semibold text-white">Acesso restrito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-center text-slate-300">
            Você não tem permissão para acessar esta área.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/aluno/dashboard">
              <Button className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para área do aluno
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
