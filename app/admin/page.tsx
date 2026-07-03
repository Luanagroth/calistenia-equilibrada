import { ArrowRight, Calendar, Users, Ticket, ShoppingCart, TrendingUp, AlertTriangle, Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getAdminDashboardStats } from "@/lib/admin/get-admin-dashboard-stats";
import { getUnreadAdminNotificationsCount } from "@/lib/admin/get-admin-notifications";

export default async function AdminDashboardPage() {
  const [stats, unreadCount] = await Promise.all([
    getAdminDashboardStats(),
    getUnreadAdminNotificationsCount(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Admin</h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Gerencie alunos, acessos e evolução em um só lugar.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/notificacoes" className="relative">
            <Button variant="outline" size="icon" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Bell className="h-4 w-4" />
            </Button>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-slate-950">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total de alunos</CardTitle>
            <Users className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Acessos ativos</CardTitle>
            <Calendar className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeStudents}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Acessos vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.expiredStudents}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Bloqueados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.blockedStudents}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Vencendo em até 20 dias</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.expiringSoonCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tickets abertos</CardTitle>
            <Ticket className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.openTickets}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Dias concluídos</CardTitle>
            <TrendingUp className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalCompletedDays}</div>
          </CardContent>
        </Card>
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
            {stats.upcomingExpirations.length === 0 ? (
              <p className="text-xs text-slate-400">Nenhum vencimento próximo.</p>
            ) : (
              <div className="space-y-4">
                {stats.upcomingExpirations.map((item) => (
                  <div key={item.studentName} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <div>
                      <p className="text-sm font-medium text-white">{item.studentName}</p>
                      <p className="text-xs text-slate-400">{item.plan}</p>
                    </div>
                    <Badge className="border-amber-400/30 bg-amber-400/10 text-amber-300">
                      {item.daysRemaining} dias
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
