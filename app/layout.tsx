import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gerador de Encartes • Aramis",
  description:
    "Gere encartes promocionais de forma rápida e prática a partir de templates SVG e planilhas Excel.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <div className="flex min-h-screen flex-col">
          <header className="border-b bg-background">
            <div className="container flex h-16 items-center justify-between">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                Guga Inc
              </h1>
              <span className="text-sm text-muted-foreground">
                Powered by Guga
              </span>
            </div>
          </header>
          <main className="flex-1 container py-8">{children}</main>
          <footer className="border-t bg-background">
            <div className="container py-6 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Guga. Todos os direitos reservados.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
