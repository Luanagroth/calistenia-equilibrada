"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  isPinEnabled,
  isPinUnlocked,
  verifyPin,
  markPinUnlocked,
  clearPinUnlock,
} from "@/lib/security/pin";

export function PinLockScreen({ children }: { children: React.ReactNode }) {
  const isMountedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    isMountedRef.current = true;

    const shouldLock = isPinEnabled() && !isPinUnlocked();
    setLocked(shouldLock);
    setReady(true);

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleUnlock = async () => {
    setError("");
    setLoading(true);
    const ok = await verifyPin(pin);

    if (!isMountedRef.current) {
      return;
    }

    if (ok) {
      markPinUnlocked();
      setLocked(false);
      setPin("");
    } else {
      setError("PIN incorreto. Tente novamente.");
      setPin("");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    clearPinUnlock();
    router.push("/login");
  };

  if (!ready) {
    return null;
  }

  if (!locked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070A0D]/95 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0B1115] p-6 shadow-2xl shadow-black/40">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <Lock className="h-6 w-6 text-yellow-400" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-white">Acesso rápido</h2>
          <p className="mt-1 text-xs text-slate-400">
            Digite seu PIN para continuar
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin" className="text-xs text-slate-300">
              PIN
            </Label>
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
              className={cn(
                "h-12 text-center text-lg tracking-[0.3em] border-white/10 bg-white/5 text-slate-200 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20",
                error && "border-rose-400/50"
              )}
              placeholder="0000"
              autoFocus
            />
            {error && <p className="text-xs text-rose-400">{error}</p>}
          </div>
          <Button
            type="button"
            onClick={handleUnlock}
            disabled={loading || pin.length < 4 || pin.length > 6}
            className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20"
          >
            {loading ? "Verificando..." : "Entrar"}
          </Button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sair da conta
          </button>
        </div>
      </div>
    </div>
  );
}
