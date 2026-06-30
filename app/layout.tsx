import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calistenia Equilibrada",
  description:
    "Jornada 30 Dias com eBooks premium e Espaço do Aluno para acompanhar treinos, hábitos e evolução.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}