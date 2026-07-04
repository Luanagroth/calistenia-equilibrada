"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isPinEnabled, isPinValidated } from "@/lib/security/pin";

export function PinValidationWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isMountedRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    setReady(true);

    if (isPinEnabled() && !isPinValidated() && pathname !== "/aluno/pin") {
      router.push("/aluno/pin");
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [router, pathname]);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}