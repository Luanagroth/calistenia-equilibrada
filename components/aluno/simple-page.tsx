"use client";

import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SimplePageProps = {
  title: string;
  description: string;
};

export function SimplePage({ title, description }: SimplePageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-slate-300">{description}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-slate-300">
          Esta área já está criada e será preenchida em breve com dados reais.
        </p>
      </div>
    </div>
  );
}
