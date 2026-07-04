"use client";

import { Lock, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createClient } from "@/lib/supabase/client";
import { verifyPin, markPinValidated, clearPinValidation } from "@/lib/security/pin";

export default function PinPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    const ok = await verifyPin(pin);

    if (ok) {
      markPinValidated();
      router.push("/aluno/dashboard");
      router.refresh();
    } else {
      setError("PIN incorreto. Tente novamente.");
      setPin("");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    clearPinValidation();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#070A0D] text-white flex items-center justify-center px-4">
      <Card className="w-full max-w-sm rounded-2xl border-white/10 bg-[#10161A] shadow-2xl shadow-black/40">
        <CardHeader className="space-y-1 pt-10 pb-7">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Lock className="h-6 w-6 text-yellow-400" />
          </div>
          <CardTitle className="text-center text-2xl font-semibold text-white">Acesso rápido</CardTitle>
          <p className="text-center text-sm text-slate-300">
            Digite seu PIN para continuar
          </p>
        </CardHeader>
        <CardContent className="space-y-6 pb-10">
          <div className="space-y-3">
            <Label htmlFor="pin" className="text-xs text-slate-300">PIN</Label>
            <Input
              id="pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setPin(value);
              }}
              placeholder="0000"
              required
              className="h-14 border-white/10 bg-white/5 text-center text-lg tracking-[0.3em] text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
              autoFocus
            />
            {error && <p className="text-xs text-rose-400">{error}</p>}
          </div>
          <Button
            type="button"
            onClick={handleVerify}
            disabled={loading || pin.length < 4 || pin.length > 6}
            className="h-14 w-full bg-yellow-400 text-lg text-slate-950 shadow-lg shadow-yellow-400/20 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-yellow-300"
          >
            {loading ? "Verificando..." : "Entrar"}
          </Button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sair da conta
          </button>
        </CardContent>
      </Card>
    </div>
  );
}