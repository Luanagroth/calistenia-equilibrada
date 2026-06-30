"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, CalendarCheck, Dumbbell, Headphones, Home, ListChecks } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Início", href: "/aluno/dashboard", icon: Home },
  { label: "Treinos", href: "/aluno/treinos", icon: CalendarCheck },
  { label: "Exercícios", href: "/aluno/exercicios", icon: Dumbbell },
  { label: "Checklist", href: "/aluno/checklist", icon: ListChecks },
  { label: "Evolução", href: "/aluno/evolucao", icon: BarChart3 },
  { label: "Materiais", href: "/aluno/materiais", icon: BookOpen },
  { label: "Suporte", href: "/aluno/suporte", icon: Headphones },
];

type AlunoShellProps = {
  children: React.ReactNode;
};

export function AlunoShell({ children }: AlunoShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-white/10 bg-slate-950/95 p-6 lg:block">
        <div className="mb-10">
          <p className="text-sm font-medium text-emerald-300">Calistenia Equilibrada</p>
          <h1 className="mt-1 text-2xl font-bold">Espaço do Aluno</h1>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white",
                  isActive && "bg-emerald-400 text-slate-950 hover:bg-emerald-400 hover:text-slate-950"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <p className="text-sm font-medium text-emerald-300">Acesso ativo</p>
          <p className="mt-1 text-xs text-slate-300">Jornada liberada por 45 dias.</p>
        </div>
      </aside>

      <main className="pb-24 lg:ml-72 lg:pb-0">
        <div className="mx-auto max-w-6xl px-5 py-6 lg:px-8 lg:py-8">{children}</div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] text-slate-400",
                  isActive && "bg-emerald-400 text-slate-950"
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
