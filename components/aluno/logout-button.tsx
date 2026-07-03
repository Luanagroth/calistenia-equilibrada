"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { clearPinUnlock } from "@/lib/security/pin";
import { Button } from "@/components/ui/button";

export function LogoutButton({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    clearPinUnlock();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleLogout}
      disabled={loading}
      className="border-rose-400/30 text-rose-300 hover:bg-rose-400/10 hover:text-rose-200"
    >
      {children}
    </Button>
  );
}
