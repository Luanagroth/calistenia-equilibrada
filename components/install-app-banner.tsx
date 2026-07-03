"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

const isIOSDevice = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && navigator.vendor.includes("Apple");
};

export function InstallAppBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const promptEventRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const checkIOS = isIOSDevice();
    const isAlreadyInstalled = window.matchMedia("(display-mode: standalone)").matches;
    const isHomePage = window.location.pathname === "/";

    if (!isHomePage || isAlreadyInstalled) {
      return;
    }

    setIsIOS(checkIOS);

    if (checkIOS) {
      setTimeout(() => setShowBanner(true), 2000);
      return;
    }

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      promptEventRef.current = e;
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler as EventListener);
    };
  }, []);

  const handleInstall = async () => {
    if (promptEventRef.current) {
      promptEventRef.current.prompt();
      await promptEventRef.current.userChoice;
      promptEventRef.current = null;
      setShowBanner(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="bg-[#10161A] border-white/10 shadow-2xl">
        <CardContent className="p-4 flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              Instale o aplicativo
            </p>
            <p className="text-xs text-slate-300 mt-1">
              {isIOS
                ? "Compartilhar → Adicionar à Tela de Início"
                : "Instale para acesso rápido e uso offline."}
            </p>
          </div>
          {!isIOS && (
            <Button
              size="sm"
              onClick={handleInstall}
              className="bg-yellow-400 text-slate-950 hover:bg-yellow-300"
            >
              Instalar
            </Button>
          )}
          <button
            onClick={() => setShowBanner(false)}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-4 w-4 text-slate-300" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}