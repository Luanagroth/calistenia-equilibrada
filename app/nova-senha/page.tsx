"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, HelpCircle, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supportEmail = "suporte@calisteniaequilibrada.com.br";

export default function NovaSenhaPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted || !session) {
        router.push("/login");
      }
    });

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError("Erro ao atualizar senha. Tente novamente.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#070A0D] text-white">
      <div className="flex min-h-screen flex-col items-center justify-center px-8 py-12">
        <div className="mx-auto w-full max-w-xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Criar nova senha</h1>
            <p className="text-lg text-slate-300">Digite uma nova senha para continuar acessando sua jornada.</p>
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
                  Senha atualizada com sucesso. Você já pode entrar novamente.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-base text-slate-300">Nova senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      required
                      className="border-white/10 bg-white/5 pl-10 text-base text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-base text-slate-300">Confirmar senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a nova senha"
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
                  {loading ? "Salvando..." : "Salvar nova senha"}
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
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5 space-y-2">
                <p className="text-sm font-medium text-white">Não conseguiu criar a nova senha?</p>
                <p className="text-sm text-slate-300">
                  Se o link expirou ou apareceu algum erro, solicite ajuda para recuperar o acesso.
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

          <div className="text-center space-y-1">
            <p className="text-sm text-slate-400">Seu acesso continua protegido.</p>
            <p className="text-xs text-slate-500">Depois de redefinir a senha, entre novamente para continuar sua jornada.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
