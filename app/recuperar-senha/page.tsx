"use client";

// IMPORTANTE: No Supabase, configure Authentication → URL Configuration com:
// - Local: http://localhost:3000/nova-senha
// - Produção: https://SEU-DOMINIO.com/nova-senha

import { useState } from "react";
import { ArrowLeft, HelpCircle, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const supportEmail = "suporte@calisteniaequilibrada.com.br";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nova-senha`,
    });

    if (error) {
      setError("Erro ao enviar e-mail. Tente novamente mais tarde.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#070A0D] text-white">
      <div className="flex min-h-screen flex-col items-center justify-center px-8 py-12">
        <div className="mx-auto w-full max-w-xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Recuperar acesso</h1>
            <p className="text-lg text-slate-300">
              Informe o e-mail usado na plataforma para receber as instruções de redefinição de senha.
            </p>
          </div>

          <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/40 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-yellow-400/10 pointer-events-none" />
            <CardContent className="p-8 md:p-10 space-y-6">
              {error && (
                <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4 text-sm text-yellow-200">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-300">
                  Se este e-mail estiver cadastrado, você receberá as instruções em alguns minutos.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base text-slate-300">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="border-white/10 bg-white/5 pl-10 text-base text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20 h-12"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || success}
                  className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 disabled:opacity-50 disabled:cursor-not-allowed h-12 text-base"
                >
                  {loading ? "Enviando..." : "Enviar instruções"}
                </Button>
              </form>

              <div className="flex flex-col items-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-base text-slate-300 hover:text-yellow-400 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para entrar
                </Link>
                <Link
                  href="/"
                  className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
                >
                  Voltar para a página inicial
                </Link>
              </div>

              <p className="text-center text-xs text-slate-500 pt-2">
                Por segurança, não informamos se o e-mail existe ou não na plataforma.
              </p>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5 space-y-2">
                <p className="text-sm font-medium text-white">Não recebeu o e-mail?</p>
                <p className="text-sm text-slate-300">
                  Verifique sua caixa de spam ou tente novamente em alguns minutos. Se ainda assim não conseguir, fale com o suporte.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-yellow-400 transition-colors"
                >
                  <Link href={`mailto:${supportEmail}?subject=${encodeURIComponent("Ajuda para recuperar acesso - Calistenia Equilibrada")}`}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Falar com suporte
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
