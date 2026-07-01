"use client";

import { useState } from "react";
import { useActionState } from "react";
import { ArrowLeft, User, Mail, Lock, Calendar, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createStudentAccessAction } from "./actions";

type DurationOption = "30" | "45" | "60";

export default function AdminNovoAlunoPage() {
  const [state, formAction] = useActionState(createStudentAccessAction, null);
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>("45");

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/alunos">
          <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Liberar novo aluno</h1>
          <p className="mt-1 text-slate-300">Crie um novo acesso para o aluno.</p>
        </div>
      </div>

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="text-lg text-white">Dados do aluno</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-xs text-slate-300">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Nome do aluno"
                  required
                  className="border-white/10 bg-white/5 pl-9 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-slate-300">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="aluno@email.com"
                  required
                  className="border-white/10 bg-white/5 pl-9 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temporaryPassword" className="text-xs text-slate-300">Senha temporária</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  id="temporaryPassword"
                  name="temporaryPassword"
                  type="password"
                  placeholder="Senha inicial"
                  required
                  className="border-white/10 bg-white/5 pl-9 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-300">Duração do acesso</Label>
              <input type="hidden" name="durationDays" value={selectedDuration} />
              <div className="grid grid-cols-3 gap-2">
                {(["30", "45", "60"] as DurationOption[]).map((duration) => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => setSelectedDuration(duration)}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${
                      selectedDuration === duration
                        ? "border-yellow-400 bg-yellow-400/10 text-yellow-300"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    {duration} dias
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-xs text-slate-300">Observações</Label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Ex: aluno indicação amigo, oferta promocional..."
                className="min-h-[100px] w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
              />
            </div>

            {state?.error && (
              <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 text-xs text-rose-300">
                {state.error}
              </div>
            )}

            {state?.success && (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium text-emerald-300">{state.message}</p>
                    <p className="text-xs text-slate-300 mt-1">
                      Envie o e-mail e senha temporária ao aluno.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20"
            >
              Criar acesso
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
