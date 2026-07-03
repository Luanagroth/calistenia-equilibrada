"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitPaymentRequest } from "./actions";

export default function ThankYouPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const receiptFile = fileInputRef.current?.files?.[0] || null;

    try {
      await submitPaymentRequest({ name, email, phone, receiptFile });
      setIsSubmitted(true);
    } catch {
      setError("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-[#070A0D] text-white flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-[#10161A] border-white/10">
          <CardContent className="p-8 text-center space-y-4">
            <div className="size-16 mx-auto rounded-full bg-emerald-400/10 flex items-center justify-center">
              <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Recebemos sua solicitação!</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Em breve seu acesso será liberado após validação.
            </p>
<div className="flex gap-2 justify-center">
               <Button
                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                onClick={() => window.location.href = "/"}
              >
                Voltar para página inicial
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070A0D] text-white flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md bg-[#10161A] border-white/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-white">Confirmação de pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 text-sm mb-6">
            Pagamento realizado via Mercado Pago! Para liberar seu acesso, confirme seus dados abaixo.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Nome completo *
              </Label>
              <Input
                id="name"
                name="name"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                placeholder="João Silva"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email usado na compra *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                placeholder="joao@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Telefone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt" className="text-white">
                Comprovante (PDF, PNG, JPG)
              </Label>
              <Input
                id="receipt"
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="bg-white/5 border-white/10 text-white file:text-white file:bg-white/10"
              />
            </div>

{error && <p className="text-rose-400 text-sm">{error}</p>}

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-yellow-400 text-slate-950 hover:bg-yellow-300"
              >
                {isSubmitting ? "Enviando..." : "Enviar solicitação"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                onClick={() => window.location.href = "/"}
              >
                Voltar para página inicial
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}