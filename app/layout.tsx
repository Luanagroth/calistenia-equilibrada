import type { Metadata } from "next";
import { AppUpdateNotice } from "@/components/app-update-notice";
import { PWAProvider } from "@/components/pwa-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calistenia Equilibrada",
  description: "Jornada guiada de mobilidade, constância e evolução física.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Calistenia",
  },
  icons: {
    icon: [
      { url: "/icon/favicon-calistenia-equilibrada-fundo-escuro.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon/icon-32x32-dark.png", sizes: "32x32", type: "image/png" },
      { url: "/icon/icon-192x192-dark.png", sizes: "192x192", type: "image/png" },
      { url: "/icon/icon-512x512-dark.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon/icon-180x180-dark.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FACC15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head />
      <body>
        <PWAProvider />
        {children}
        <AppUpdateNotice />
      </body>
    </html>
  );
}
