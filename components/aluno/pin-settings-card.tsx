"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  isPinEnabled,
  savePin,
  disablePin,
  verifyPin,
  clearPinValidation,
} from "@/lib/security/pin";

type Mode = "idle" | "setup" | "change";

export function PinSettingsCard() {
  const isMountedRef = useRef(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    setEnabled(isPinEnabled());
    setReady(true);

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const resetStates = () => {
    setPin("");
    setConfirmPin("");
    setError("");
    setSuccess("");
  };

  const startSetup = () => {
    resetStates();
    setMode("setup");
  };

  const startChange = () => {
    resetStates();
    setMode("change");
  };

  const cancelSetup = () => {
    resetStates();
    setMode("idle");
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (!pin || pin.length < 4 || pin.length > 6) {
      setError("O PIN deve ter entre 4 e 6 numeros.");
      setLoading(false);
      return;
    }

    if (mode === "change") {
      const ok = await verifyPin(pin);
      if (!isMountedRef.current) {
        return;
      }

      if (!ok) {
        setError("PIN atual incorreto.");
        setLoading(false);
        return;
      }
      setLoading(false);
      startSetup();
      return;
    }

    if (pin !== confirmPin) {
      setError("Os PINs nao coincidem.");
      setLoading(false);
      return;
    }

    await savePin(pin);
    if (!isMountedRef.current) {
      return;
    }

    setEnabled(true);
    setSuccess("PIN ativado com sucesso.");
    resetStates();
    setMode("idle");
    setLoading(false);
  };

  const handleDisable = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    disablePin();
    clearPinValidation();
    setEnabled(false);
    setSuccess("PIN desativado com sucesso.");
    resetStates();
    setMode("idle");
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D1317] p-5 shadow-none">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">PIN de acesso rápido</p>
          <p className="text-xs text-slate-300">
            Este PIN protege o acesso rápido neste aparelho. Ele não substitui sua senha de login.
          </p>
        </div>
        {ready && enabled && mode === "idle" && (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            PIN ativo neste dispositivo
          </span>
        )}
      </div>

      {mode !== "idle" && (
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-xs text-slate-300">
                {mode === "change" ? "PIN atual" : "Criar PIN"}
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
                className="h-11 border-white/10 bg-white/5 text-center text-lg tracking-[0.3em] text-slate-100 placeholder:text-slate-400 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                placeholder="0000"
                autoFocus
              />
            </div>

            {mode === "setup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPin" className="text-xs text-slate-300">
                  Confirmar PIN
                </Label>
                <Input
                  id="confirmPin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setConfirmPin(value);
                  }}
                  className="h-11 border-white/10 bg-white/5 text-center text-lg tracking-[0.3em] text-slate-100 placeholder:text-slate-400 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                  placeholder="0000"
                />
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400">
            Use de 4 a 6 numeros.
          </p>

          {error && <p className="text-xs text-rose-400">{error}</p>}
          {success && <p className="text-xs text-emerald-400">{success}</p>}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={cancelSetup}
              className="text-slate-200 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !pin || pin.length < 4}
              className="bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20"
            >
              {loading ? "Salvando..." : mode === "change" ? "Salvar PIN" : "Ativar PIN"}
            </Button>
          </div>
        </div>
      )}

      {mode === "idle" && enabled && (
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={startChange}
            className="border-white/10 text-slate-200 hover:bg-white/10 hover:text-white"
          >
            Alterar PIN
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDisable}
            className="border-rose-400/30 text-rose-300 hover:bg-rose-400/10 hover:text-rose-200"
          >
            Desativar PIN
          </Button>
        </div>
      )}

      {mode === "idle" && !enabled && (
        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            onClick={startSetup}
            className="bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20"
          >
            Ativar PIN
          </Button>
        </div>
      )}
    </div>
  );
}
