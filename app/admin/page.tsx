import { ArrowRight, Calendar, Users, Ticket, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const stats = [
  { label: "Total de alunos", value: "12", icon: <Users className="h-4 w-4 text-yellow-400" /> },
  { label: "Acessos ativos", value: "9", icon: <Calendar className="h-4 w-4 text-emerald-400" /> },
  { label: "Acessos vencidos", value: "2", icon: <AlertTriangle className="h-4 w-4 text-rose-400" /> },
  { label: "Bloqueados", value: "1", icon: <AlertTriangle className="h-4 w-4 text-amber-400" /> },
  { label: "Tickets abertos", value: "3", icon: <Ticket className="h-4 w-4 text-sky-400" /> },
  { label: "Liberações recentes", value: "4", icon: <ShoppingCart className="h-4 w-4 text-violet-400" /> },
];

const upcomingExpirations = [
  { name: "Ana Silva", daysLeft: 2, plan: "45 dias" },
  { name: "Carlos Lima", daysLeft: 5, plan: "30 dias" },
  { name: "Marina Costa", daysLeft: 7, plan: "45 dias" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Admin</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Visão geral do acesso dos alunos e métricas do sistema.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">{stat.label}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
              Ações rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/alunos/novo">
              <Button className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
                Cadastrar/liberar aluno
              </Button>
            </Link>
            <Link href="/admin/alunos">
              <Button variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                Ver alunos
              </Button>
            </Link>
            <Link href="/admin/suporte">
              <Button variant="outline" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                Ver suporte
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Calendar className="h-5 w-5 text-yellow-400" />
              Próximos vencimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingExpirations.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.plan}</p>
                  </div>
                  <Badge className="border-amber-400/30 bg-amber-400/10 text-amber-300">
                    {item.daysLeft} dias
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
