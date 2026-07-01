"use client";

import { useState } from "react";
import { ArrowLeft, User, Mail, Lock, Calendar, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type DurationOption = "30" | "45" | "60";

export default function AdminNovoAlunoPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    duration: "45" as DurationOption,
    notes: "",
  });
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Aluno criado na versão final.");
    setForm({ name: "", email: "", password: "", duration: "45", notes: "" });
  };

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs text-slate-300">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="aluno@email.com"
                  required
                  className="border-white/10 bg-white/5 pl-9 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs text-slate-300">Senha temporária</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Senha inicial"
                  required
                  className="border-white/10 bg-white/5 pl-9 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-300">Duração do acesso</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["30", "45", "60"] as DurationOption[]).map((duration) => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => setForm({ ...form, duration })}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${
                      form.duration === duration
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
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Ex: aluno indicação amigo, oferta promocional..."
                className="min-h-[100px] w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20"
            >
              Criar acesso
            </Button>
          </form>
        </CardContent>
      </Card>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-6 py-4 shadow-2xl shadow-black/30">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <p className="text-sm text-emerald-300">{toast}</p>
          </div>
        </div>
      )}
    </div>
  );
}
