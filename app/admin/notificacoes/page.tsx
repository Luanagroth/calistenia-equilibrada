import { Bell, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminNotifications } from "@/lib/admin/get-admin-notifications";

const typeConfig: Record<
  string,
  { label: string; color: string; href: string }
> = {
  support: {
    label: "Suporte",
    color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    href: "/admin/suporte",
  },
  student: {
    label: "Aluno",
    color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    href: "/admin/alunos",
  },
  system: {
    label: "Sistema",
    color: "text-sky-400 border-sky-400/30 bg-sky-400/10",
    href: "/admin",
  },
  info: {
    label: "Info",
    color: "text-slate-300 border-white/10 bg-white/5",
    href: "/admin",
  },
};

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR");
}

export default async function AdminNotificacoesPage() {
  const notifications = await getAdminNotifications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Notificacoes</h1>
        <p className="mt-2 max-w-xl text-slate-300">
          Acompanhe atualizacoes e avisos do painel admin.
        </p>
      </div>

      {notifications.length === 0 ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
              <Bell className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Nenhuma notificacao</p>
              <p className="text-xs text-slate-400">Voce esta em dia com as atualizacoes.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const config = typeConfig[notification.type] ?? typeConfig.info;
            const isUnread = !notification.read_at;

            return (
              <Link
                key={notification.id}
                href={config.href}
              >
                <Card
                  className={`border transition hover:border-white/20 ${
                    isUnread
                      ? "border-white/10 bg-white/5"
                      : "border-white/5 bg-white/[0.02]"
                  }`}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${config.color}`}
                    >
                      <Bell className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{notification.title}</p>
                        {isUnread && (
                          <span className="size-2 shrink-0 rounded-full bg-yellow-400" />
                        )}
                      </div>
                      <p className="text-xs text-slate-300">{notification.message}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span>{formatDate(notification.created_at)}</span>
                        <Badge variant="outline" className={`${config.color} border px-1 py-0 text-[10px]`}>
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
