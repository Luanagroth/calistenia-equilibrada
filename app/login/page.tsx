"use client";

import { useState } from "react";
import { useEffect } from "react";

import { ArrowRight, CheckCircle2, Home, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { isPinEnabled, clearPinValidation } from "@/lib/security/pin";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    clearPinValidation();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("E-mail ou senha inválidos. Tente novamente.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Não foi possível identificar o usuário.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.status === "blocked" || profile.status === "expired") {
      router.push("/acesso-expirado");
      router.refresh();
      return;
    }

    if (profile.role === "admin") {
      router.push("/admin");
    } else {
      if (isPinEnabled()) {
        router.push("/aluno/pin");
      } else {
        router.push("/aluno/dashboard");
      }
    }
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#070A0D] text-white">
      <header className="border-b border-white/10 bg-[#070A0D]/90 backdrop-blur">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4 md:px-10 lg:px-20">
          <Link href="/" className="text-xl font-bold text-white transition-colors hover:text-yellow-400">
            Calistenia Equilibrada
          </Link>
          <Button asChild variant="ghost" className="text-slate-300 hover:bg-white/5 hover:text-white">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-2">
        <div className="hidden flex-col justify-center px-20 lg:flex xl:px-28">
          <div className="max-w-2xl space-y-10">
            <div className="space-y-5">
              <h2 className="text-5xl font-extrabold tracking-tight text-white xl:text-6xl">
                Continue sua jornada.
              </h2>
              <p className="text-xl leading-relaxed text-slate-300">
                Acesse sua área do aluno para ver o treino liberado, registrar sua prática e acompanhar sua evolução.
              </p>
            </div>

            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-emerald-400" />
                <span className="text-lg text-slate-300">Treinos liberados no tempo certo</span>
              </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-emerald-400" />
                    <span className="text-lg text-slate-300">Evolução salva</span>
                  </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-emerald-400" />
                <span className="text-lg text-slate-300">Materiais de apoio inclusos</span>
              </li>
            </ul>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30">
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-yellow-400/10" />
              <div className="space-y-5">
                <div className="space-y-1">
                   <h3 className="text-xl font-semibold text-white">Sua área do aluno</h3>
                   <p className="text-sm text-slate-400">
                     Depois de entrar, você acompanha tudo em um só lugar.
                   </p>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    <div>
                      <p className="text-base text-white">Treino liberado</p>
                       <p className="text-sm text-slate-300">
                         Veja a prática disponível no tempo certo.
                       </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    <div>
                       <p className="text-base text-white">Evolução salva</p>
                      <p className="text-sm text-slate-300">
                        Registre energia, dificuldade e anotações.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    <div>
                      <p className="text-base text-white">Materiais inclusos</p>
                      <p className="text-sm text-slate-300">Acesse os 7 eBooks de apoio.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-8 py-16 lg:px-20 lg:py-0">
          <Card className="relative w-full max-w-xl overflow-hidden rounded-3xl border-white/10 bg-[#10161A] shadow-2xl shadow-black/40">
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-yellow-400/10" />
            <CardHeader className="space-y-1 pt-10 pb-7">
              <CardTitle className="text-3xl font-semibold text-white">Entrar na plataforma</CardTitle>
              <p className="text-lg text-slate-300">
                Use o e-mail e a senha liberados para acessar sua jornada.
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pb-10">
              {error && (
                <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4 text-sm text-yellow-200">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base text-slate-300">
                    E-mail
                  </Label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="h-14 border-white/10 bg-white/5 pl-10 text-base text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-base text-slate-300">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha"
                      required
                      className="h-14 border-white/10 bg-white/5 pl-10 text-base text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    href="/recuperar-senha"
                    className="text-base text-yellow-400 transition-colors hover:text-yellow-300"
                  >
                    Esqueci minha senha
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-14 w-full bg-yellow-400 text-lg text-slate-950 shadow-lg shadow-yellow-400/20 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-yellow-300"
                >
                  {loading ? "Entrando..." : "Entrar"}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </form>

                 <Link
                   href="/"
                   className="flex items-center justify-center gap-2 text-base text-slate-400 transition-colors hover:text-slate-300"
                 >
                   <Home className="h-4 w-4" />
                   Voltar para a página inicial
                 </Link>

              <div className="space-y-3 pt-3">
                 <p className="text-center text-sm text-slate-400">
                   Seu acesso é liberado após a compra ou cadastro manual pela equipe.
                 </p>
                 <p className="text-center text-sm leading-relaxed text-slate-400">
                   Ao acessar, voce concorda com nossos{" "}
                   <Link href="/termos-de-uso" className="text-yellow-400 transition-colors hover:text-yellow-300">
                     Termos de Uso
                   </Link>{" "}
                   e{" "}
                   <Link
                     href="/politica-de-privacidade"
                     className="text-yellow-400 transition-colors hover:text-yellow-300"
                   >
                     Politica de Privacidade
                   </Link>
                   .
                 </p>
                 <p className="text-center text-sm text-slate-500">
                   Problemas para acessar? Use a recuperação de senha ou fale com o suporte após
                   entrar na plataforma.
                 </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
