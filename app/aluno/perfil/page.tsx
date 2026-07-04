import { CheckCircle2, ChevronRight, Lock, LogOut, Shield, SlidersHorizontal, UserRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getStudentProfile } from "@/lib/aluno/get-student-profile";

import {
  updateStudentPasswordAction,
  updateStudentProfileAction,
} from "./actions";

import { AvatarUploadField } from "@/components/aluno/avatar-upload-field";
import { LogoutButton } from "@/components/aluno/logout-button";

function getMessageFromError(error?: string) {
  switch (error) {
    case "missing-full-name":
      return "Informe o nome exibido para salvar seu perfil.";
    case "invalid-age":
      return "A idade deve estar entre 5 e 120 anos.";
    case "invalid-height":
      return "A altura deve estar entre 80 e 250 cm.";
    case "invalid-weight":
      return "O peso deve estar entre 20 e 300 kg.";
    case "invalid-mobility-level":
      return "A mobilidade inicial deve ficar entre 0 e 5.";
    case "password-too-short":
      return "Use uma senha com pelo menos 6 caracteres.";
    case "password-mismatch":
      return "A confirmacao da senha precisa ser igual a nova senha.";
    case "password-error":
      return "Nao foi possivel atualizar sua senha agora. Tente novamente.";
    case "profile-error":
      return "Nao foi possivel salvar seu perfil agora. Tente novamente.";
    default:
      return "Ocorreu um erro ao processar sua solicitacao.";
  }
}

export default async function StudentProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const profile = await getStudentProfile();
  const mobilityOptions = [
    { value: 0, label: "Muito baixa" },
    { value: 1, label: "Baixa" },
    { value: 2, label: "Limitada" },
    { value: 3, label: "Regular" },
    { value: 4, label: "Boa" },
    { value: 5, label: "Muito boa" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Meu perfil</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Atualize seus dados e personalize sua jornada.
          </p>
        </div>
      </div>

      {params.success === "profile-updated" && (
        <Card className="border-emerald-400/20 bg-emerald-400/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-300">Perfil atualizado com sucesso.</p>
              <p className="text-xs text-slate-300">Seus dados ja estao valendo na plataforma.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {params.success === "password-updated" && (
        <Card className="border-emerald-400/20 bg-emerald-400/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-300">Senha atualizada com sucesso.</p>
              <p className="text-xs text-slate-300">Use sua nova senha nos proximos acessos.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {params.error && (
        <Card className="border-rose-400/20 bg-rose-400/5">
          <CardContent className="p-4 text-sm text-rose-200">
            {getMessageFromError(params.error)}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <UserRound className="h-5 w-5 text-yellow-400" />
              Dados de acesso
            </CardTitle>
            <p className="text-xs text-slate-400">
              Ajuste as informacoes principais da sua conta sem mexer no e-mail de acesso.
            </p>
          </CardHeader>
          <CardContent>
            <form action={updateStudentProfileAction} className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fullName" className="text-xs text-slate-300">Nome exibido</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    defaultValue={profile.fullName}
                    required
                    className="h-11 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-400 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email" className="text-xs text-slate-300">E-mail de acesso</Label>
                  <Input
                    id="email"
                    defaultValue={profile.email}
                    readOnly
                    disabled
                    className="h-11 border-white/10 bg-white/[0.03] text-slate-300"
                  />
                  <p className="text-[11px] text-slate-400">
                    Para alterar o e-mail de acesso, fale com o suporte.
                  </p>
                </div>

                <AvatarUploadField initialAvatarUrl={profile.avatarUrl} />
              </div>

              <Card className="border-white/10 bg-[#0D1317] shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <SlidersHorizontal className="h-5 w-5 text-yellow-400" />
                    Aspectos gerais
                  </CardTitle>
                  <p className="text-xs text-slate-400">
                    Essas informacoes ajudam a personalizar sua experiencia e acompanhar sua evolucao percebida. Elas nao substituem avaliacao profissional.
                  </p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-xs text-slate-300">Idade</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        min={5}
                        max={120}
                        defaultValue={profile.age ?? ""}
                        className="h-11 border-white/10 bg-white/5 text-slate-200 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="heightCm" className="text-xs text-slate-300">Altura em cm</Label>
                      <Input
                        id="heightCm"
                        name="heightCm"
                        type="number"
                        min={80}
                        max={250}
                        defaultValue={profile.heightCm ?? ""}
                        className="h-11 border-white/10 bg-white/5 text-slate-200 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weightKg" className="text-xs text-slate-300">Peso em kg</Label>
                      <Input
                        id="weightKg"
                        name="weightKg"
                        type="number"
                        min={20}
                        max={300}
                        step="0.01"
                        defaultValue={profile.weightKg ?? ""}
                        className="h-11 border-white/10 bg-white/5 text-slate-200 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobilityLevel" className="text-xs text-slate-300">Mobilidade inicial</Label>
                      <select
                        id="mobilityLevel"
                        name="mobilityLevel"
                        defaultValue={profile.mobilityLevel?.toString() ?? ""}
                        className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-slate-100 outline-none transition focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20"
                      >
                        <option value="" className="bg-slate-950 text-slate-300">
                          Selecione um nivel
                        </option>
                        {mobilityOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            className="bg-slate-950 text-slate-200"
                          >
                            {option.value} - {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mainGoal" className="text-xs text-slate-300">Objetivo principal</Label>
                    <Input
                      id="mainGoal"
                      name="mainGoal"
                      defaultValue={profile.mainGoal}
                      placeholder="Ex: ganhar mobilidade, criar consistencia..."
                      className="h-11 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-400 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="limitations" className="text-xs text-slate-300">Observacoes ou limitacoes</Label>
                    <Textarea
                      id="limitations"
                      name="limitations"
                      defaultValue={profile.limitations}
                      placeholder="Ex: desconforto no ombro, pouca mobilidade no quadril, retorno gradual..."
                      className="min-h-[140px] border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-400 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 sm:w-auto"
              >
                Salvar perfil
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Lock className="h-5 w-5 text-yellow-400" />
              Seguranca
            </CardTitle>
            <p className="text-xs text-slate-400">
              Troque sua senha sem alterar o fluxo publico de recuperacao.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form action={updateStudentPasswordAction} className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-xs text-slate-300">Nova senha</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  minLength={6}
                  required
                  className="h-11 border-white/10 bg-white/5 text-slate-200 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs text-slate-300">Confirmar nova senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  minLength={6}
                  required
                  className="h-11 border-white/10 bg-white/5 text-slate-200 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-200">Use uma senha com pelo menos 6 caracteres.</p>
                  <p className="text-xs text-slate-400">
                    Evite repetir senhas antigas e nao compartilhe seu acesso com outras pessoas.
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 sm:w-auto"
                >
                  Atualizar senha
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </form>

            <Card className="border-rose-400/10 bg-rose-400/5 shadow-none">
              <CardContent className="flex items-start gap-3 p-5">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-200">Privacidade e seguranca</p>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Mantenha seus dados atualizados para melhorar as recomendacoes e nunca compartilhe sua senha com outras pessoas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <LogOut className="h-5 w-5 text-rose-400" />
              Sessão
            </CardTitle>
            <p className="text-xs text-slate-400">
              Encerre sua sessão atual e retorne para o login.
            </p>
          </CardHeader>
          <CardContent>
            <LogoutButton>Sair da conta</LogoutButton>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#10161A] shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Shield className="h-5 w-5 text-yellow-400" />
              Documentos legais
            </CardTitle>
            <p className="text-xs text-slate-400">Consulte os documentos da plataforma.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/politica-de-privacidade"
              className="block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition hover:border-yellow-400/30 hover:text-yellow-300"
            >
              Politica de Privacidade
            </Link>
            <Link
              href="/termos-de-uso"
              className="block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition hover:border-yellow-400/30 hover:text-yellow-300"
            >
              Termos de Uso
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
