"use client";

import { RefreshCcw, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

import { APP_VERSION } from "@/lib/app-version";

const STORAGE_KEY = "ce_app_version_seen";

export function AppUpdateNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seenVersion = window.localStorage.getItem(STORAGE_KEY);

    if (!seenVersion) {
      window.localStorage.setItem(STORAGE_KEY, APP_VERSION);
      return;
    }

    if (seenVersion !== APP_VERSION) {
      setVisible(true);
    }
  }, []);

  const handleReload = () => {
    window.localStorage.setItem(STORAGE_KEY, APP_VERSION);
    window.location.reload();
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-24 z-50 sm:inset-x-auto sm:bottom-6 sm:right-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0B1115]/95 p-4 text-white shadow-2xl shadow-black/40 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#FACC15]/10 text-[#FACC15]">
            <Sparkles className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-semibold text-white">Nova versao disponivel</p>
            <p className="text-xs leading-relaxed text-slate-300">
              Atualizamos o app para melhorar sua experiencia.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-full p-1 text-slate-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Fechar aviso de atualizacao"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleReload}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FACC15] px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-yellow-300"
          >
            <RefreshCcw className="h-4 w-4" />
            Atualizar agora
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            Depois
          </button>
        </div>
      </div>
    </div>
  );
}
