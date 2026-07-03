"use client";

import { useState } from "react";
import { useActionState } from "react";
import { ArrowLeft, Lock, Mail, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { updateAdminPasswordAction, updateAdminProfileAction, adminLogoutAction } from "./actions";

export default function AdminPerfilPage() {
  const [profileState, profileAction] = useActionState(updateAdminProfileAction, null);
  const [passwordState, passwordAction] = useActionState(updateAdminPasswordAction, null);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Perfil</h1>
          <p className="mt-1 text-slate-300">Gerencie seus dados e acesso.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <User className="h-5 w-5 text-yellow-400" />
              Dados pessoais
            </CardTitle>
            <p className="text-xs text-slate-400">Informações visíveis no painel.</p>
          </CardHeader>
          <CardContent>
            <form action={profileAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs text-slate-300">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Seu nome"
                    required
                    className="border-white/10 bg-white/5 pl-9 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                  />
                </div>
              </div>

              {profileState?.error && (
                <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 text-xs text-rose-300">
                  {profileState.error}
                </div>
              )}

              {profileState?.success && (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs text-emerald-300">
                  Perfil atualizado com sucesso.
                </div>
              )}

              <Button type="submit" className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
                Salvar alterações
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Lock className="h-5 w-5 text-yellow-400" />
              Segurança
            </CardTitle>
            <p className="text-xs text-slate-400">Altere sua senha de acesso.</p>
          </CardHeader>
          <CardContent>
            <form action={passwordAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-xs text-slate-300">Nova senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Nova senha"
                    required
                    className="border-white/10 bg-white/5 pl-9 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs text-slate-300">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repita a senha"
                    required
                    className="border-white/10 bg-white/5 pl-9 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                  />
                </div>
              </div>

              {passwordState?.error && (
                <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 text-xs text-rose-300">
                  {passwordState.error}
                </div>
              )}

              {passwordState?.success && (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs text-emerald-300">
                  Senha alterada com sucesso.
                </div>
              )}

              <Button type="submit" className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20">
                Alterar senha
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#10161A] border-white/10 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            Conta
          </CardTitle>
          <p className="text-xs text-slate-400">Sua sessão atual.</p>
        </CardHeader>
        <CardContent>
          <form action={adminLogoutAction}>
            <Button type="submit" variant="outline" className="w-full border-rose-400/40 text-rose-300 hover:bg-rose-400/10">
              Sair da conta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
