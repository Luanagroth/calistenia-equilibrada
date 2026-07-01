"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
    <div className="min-h-screen bg-[#070A0D]">
      <div className="flex min-h-screen items-center justify-center px-8 py-12">
        <div className="mx-auto w-full max-w-md">
          <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold text-white">Criar nova senha</CardTitle>
              <p className="text-sm text-slate-400">Digite uma nova senha para continuar acessando sua jornada.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 text-xs text-rose-300">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs text-emerald-300">
                  Senha atualizada com sucesso. Redirecionando para o login...
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs text-slate-300">Nova senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      required
                      className="border-white/10 bg-white/5 pl-9 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs text-slate-300">Confirmar senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a nova senha"
                      required
                      className="border-white/10 bg-white/5 pl-9 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || success}
                  className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Salvando..." : "Salvar nova senha"}
                </Button>
              </form>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-slate-300 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Voltar para login
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
