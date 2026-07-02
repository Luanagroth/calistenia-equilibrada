"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Dumbbell,
  Headphones,
  Home,
  LogOut,
  Flame,
  Clock,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Início", href: "/aluno/dashboard", icon: Home },
  { label: "Jornada", href: "/aluno/checklist", icon: Dumbbell },
  { label: "Evolução", href: "/aluno/evolucao", icon: Flame },
  { label: "Materiais", href: "/aluno/materiais", icon: BookOpen },
  { label: "Suporte", href: "/aluno/suporte", icon: Headphones },
];

type AlunoShellProps = {
  children: React.ReactNode;
  studentName?: string;
  studentEmail?: string;
  studentAvatarUrl?: string;
  daysRemaining?: number;
};

export function AlunoShell({
  children,
  studentName = "Aluno",
  studentEmail = "",
  studentAvatarUrl = "",
  daysRemaining = 0,
}: AlunoShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const displayName = studentName.trim() || "Aluno";
  const fallbackLabel = displayName || "Aluno";
  const initials = fallbackLabel
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#070A0D] text-white">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-white/10 bg-[#0B1115] p-6 lg:flex lg:flex-col">
        <div className="mb-10">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-yellow-400 text-slate-950">
              <Dumbbell className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-yellow-400">Calistenia Equilibrada</p>
              <h1 className="text-lg font-bold text-white">Espaço do Aluno</h1>
            </div>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition",
                  isActive
                    ? "bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20"
                    : "hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-white">Jornada 30 Dias</p>
              <Flame className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Progresso</span>
                <span className="text-yellow-400 font-medium">{daysRemaining} dias restantes</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10">
                <div
                  className="h-1.5 rounded-full bg-yellow-400 transition-all"
                  style={{ width: `${Math.max(0, Math.min(100, (daysRemaining / 30) * 100))}%` }}
                />
              </div>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Flame className="h-3 w-3 text-emerald-400" />
                  3 dias
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-emerald-400" />
                  20 min
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-stretch gap-2">
            <Link
              href="/aluno/perfil"
              className={cn(
                "group flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 shadow-2xl shadow-black/30 transition hover:cursor-pointer hover:border-yellow-400/20 hover:bg-yellow-400/[0.08] hover:shadow-yellow-400/5",
                pathname === "/aluno/perfil" && "border-yellow-400/30 bg-yellow-400/10"
              )}
            >
              {studentAvatarUrl ? (
                <img
                  src={studentAvatarUrl}
                  alt={`Foto de perfil de ${displayName}`}
                  className="size-10 rounded-full border border-white/10 object-cover"
                />
              ) : (
                <div className="flex size-10 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-white">
                  {initials}
                </div>
              )}
              <p className="min-w-0 truncate text-sm font-medium text-white">{displayName}</p>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      <main className="pb-36 lg:ml-72 lg:pb-0">
        <div className="mx-auto max-w-6xl px-5 py-6 lg:px-8 lg:py-8">{children}</div>
      </main>

      <div className="fixed inset-x-0 bottom-18 z-40 px-3 lg:hidden">
        <div className="mx-auto flex max-w-3xl items-stretch gap-2">
          <Link
            href="/aluno/perfil"
            className={cn(
              "group flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-[#0B1115]/95 px-3 py-3 shadow-2xl shadow-black/40 backdrop-blur transition hover:cursor-pointer hover:border-yellow-400/20 hover:bg-yellow-400/[0.08]",
              pathname === "/aluno/perfil" && "border-yellow-400/30 bg-yellow-400/10"
            )}
          >
            {studentAvatarUrl ? (
              <img
                src={studentAvatarUrl}
                alt={`Foto de perfil de ${displayName}`}
                className="size-10 rounded-full border border-white/10 object-cover"
              />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-white">
                {initials}
              </div>
            )}
            <p className="min-w-0 truncate text-sm font-medium text-white">{displayName}</p>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#0B1115]/95 px-3 py-3 text-xs font-medium text-slate-300 shadow-2xl shadow-black/40 backdrop-blur transition hover:bg-white/10 hover:text-white"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#070A0D]/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] transition",
                  isActive
                    ? "bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <Icon className="mb-1 h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
