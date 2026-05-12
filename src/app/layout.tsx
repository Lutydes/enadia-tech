import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EnadIA - Assistente de Estudos ENADE",
  description: "Assistente de IA avançada para estudantes de Computação se prepararem para o ENADE",
  keywords: ["EnadIA", "ENADE", "Computação", "Estudos", "IA", "Simulado"],
  authors: [{ name: "EnadIA Team" }],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0e17] text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
