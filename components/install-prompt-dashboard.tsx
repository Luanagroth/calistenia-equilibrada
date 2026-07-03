"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

const isIOSDevice = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && navigator.vendor.includes("Apple");
};

interface InstallPromptBannerProps {
  storageKey: string;
}

export function InstallPromptBanner({ storageKey }: InstallPromptBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const promptEventRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const isAlreadyInstalled = window.matchMedia("(display-mode: standalone)").matches;
    const hasDismissed = localStorage.getItem(storageKey) === "dismissed";

    if (isAlreadyInstalled || hasDismissed) {
      return;
    }

    const checkIOS = isIOSDevice();
    setIsIOS(checkIOS);

    if (checkIOS) {
      setTimeout(() => setShowBanner(true), 1000);
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
  }, [storageKey]);

  const handleInstall = async () => {
    if (promptEventRef.current) {
      promptEventRef.current.prompt();
      await promptEventRef.current.userChoice;
      promptEventRef.current = null;
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(storageKey, "dismissed");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="bg-[#10161A] border-white/10 shadow-2xl">
        <CardContent className="p-4 flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">📱 Instale o aplicativo</p>
            <p className="text-xs text-slate-300 mt-1">
              Adicione o Calistenia Equilibrada à tela inicial para acessar sua jornada mais rapidamente.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isIOS && (
              <Button
                size="sm"
                onClick={handleInstall}
                className="bg-yellow-400 text-slate-950 hover:bg-yellow-300"
              >
                Instalar agora
              </Button>
            )}
            <button
              onClick={handleDismiss}
              className="px-2 py-1 text-xs rounded-md hover:bg-white/10 transition-colors text-slate-300"
            >
              Agora não
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}