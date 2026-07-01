"use client";

// IMPORTANTE: No Supabase, configure Authentication → URL Configuration com:
// - Local: http://localhost:3000/nova-senha
// - Produção: https://SEU-DOMINIO.com/nova-senha

import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
    <div className="min-h-screen bg-[#070A0D]">
      <div className="flex min-h-screen items-center justify-center px-8 py-12">
        <div className="mx-auto w-full max-w-md">
          <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold text-white">Recuperar senha</CardTitle>
              <p className="text-sm text-slate-400">Informe o e-mail usado na compra para receber as instruções de redefinição.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 text-xs text-rose-300">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs text-emerald-300">
                  Se este e-mail estiver cadastrado, você receberá as instruções em alguns minutos.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs text-slate-300">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
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
                  {loading ? "Enviando..." : "Enviar instruções"}
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
