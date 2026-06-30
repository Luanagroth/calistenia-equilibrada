"use client";

import { ArrowRight, CheckCircle2, Dumbbell, HeartPulse, Home, Lock, LineChart, Mail, BookOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col justify-center px-8 py-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
              Espaço do Aluno
            </Badge>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-100">
              Acesse sua Jornada 30 Dias
            </h1>
            <p className="mt-4 text-slate-300">
              Entre com o e-mail usado na compra para acompanhar seus treinos, registrar sua evolução e acessar os materiais do Método Calistenia Equilibrada.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Plano de 30 dias</p>
                  <p className="text-xs text-slate-400">Treinos progressivos e seguros.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Checklist diário</p>
                  <p className="text-xs text-slate-400">Acompanhe seus hábitos e consistência.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Biblioteca de exercícios</p>
                  <p className="text-xs text-slate-400">Consulte movimentos por categoria.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Evolução da jornada</p>
                  <p className="text-xs text-slate-400">Compare seu ponto de partida e progresso.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-slate-200">7 eBooks premium</p>
                  <p className="text-xs text-slate-400">Conteúdo exclusivo do método.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-8 py-12 lg:px-16">
          <Card className="w-full max-w-md bg-white/5 border-white/10">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold text-slate-100">Entrar na plataforma</CardTitle>
              <p className="text-sm text-slate-400">Use seu e-mail e senha para acessar sua área.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-slate-300">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="border-white/10 bg-white/5 pl-9 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-emerald-400/50 focus-visible:ring-emerald-400/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs text-slate-300">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    className="border-white/10 bg-white/5 pl-9 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-emerald-400/50 focus-visible:ring-emerald-400/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>

              <Link href="/aluno/dashboard">
                <Button className="w-full bg-emerald-400 text-slate-950 hover:bg-emerald-400/90">
                  Entrar no Espaço do Aluno
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link
                href="/"
                className="flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-slate-300 transition-colors"
              >
                <Home className="h-3.5 w-3.5" />
                Voltar para página inicial
              </Link>

              <p className="text-center text-[11px] text-slate-500">
                O acesso é liberado para compradores da Jornada 30 Dias conforme as regras da oferta.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
