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
  title: "Gerador de Encartes",
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
        <div
          className="flex min-h-screen flex-col bg-white" // Fundo agora com branco sólido
        >
          {/* Header Aprimorado */}
          <header className="bg-white py-4 border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* NOVO ÍCONE PARA GUGA INC - Exemplo: um foguete para "lançamento", "progresso" */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8 text-green-600" // Ícone em verde
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.59 14.375l1.677-1.677a.89.89 0 00.322-.606V9.625M17.25 10.5h1.5m-1.5 5.25h1.5m-1.5-10.5h1.5m1.318 0l1.581-1.581a1.125 1.125 0 011.59 1.59L19.5 5.318m0 0h-.008v.008H19.5zm-5.694 1.772l1.677 1.677a.89.89 0 00.606.322H17.25M17.25 10.5V9.625m-1.677 4.75l-1.677 1.677m0-1.677v-1.5a.89.89 0 00-.322-.606H8.25m-1.5 0h1.5M7.5 10.5h1.5m-1.5 5.25h1.5m1.318 0L9.5 19.318a1.125 1.125 0 01-1.59 1.59l-1.581-1.581m0 0V19.5m0 0h.008v-.008H4.5zm5.694 1.772l-1.677-1.677a.89.89 0 00-.606-.322H7.5M7.5 19.5v-1.5M7.5 10.5h1.5m-1.5 5.25h1.5M10.125 4.5V3a2.25 2.25 0 00-4.5 0v1.5M10.125 4.5h-.75M10.125 4.5L12 21M3 13.5l1.5-1.5"
                  />
                </svg>

                <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800 drop-shadow-sm">
                  Guga Inc
                </h1>
              </div>

              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                <span className="hidden sm:inline">Desenvolvido por </span>
                <span className="font-semibold text-green-700">Guga</span>
              </span>
            </div>
          </header>

          {/* Container principal para Sidebar e Conteúdo, que ocupará o espaço restante verticalmente */}
          <div className="flex flex-1">
            {/* Sidebar fixa à esquerda */}
            <aside className="w-64 bg-gray-100 border-r border-gray-200 p-6 flex flex-col space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Navegação
              </h2>
              <nav className="space-y-2">
                <a
                  href="/gerador-encartes"
                  className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-green-600 hover:text-white transition-colors duration-200 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-green-500 group-hover:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Gerador de Encartes</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300 hover:text-gray-900 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.125 2.25A4.375 4.375 0 0114.5 6.625v4.125M10.125 2.25V4.5m0-2.25h-1.375c-.621 0-1.125.504-1.125 1.125v.875m7.5-6.375h-3.375c-.621 0-1.125.504-1.125 1.125V4.5m7.5-6.375V4.5m0 0H12.75V2.25h2.25c.621 0 1.125.504 1.125 1.125v.875M12.75 4.5h-.75V2.25m0 0h-.75c-.621 0-1.125.504-1.125 1.125v.875m-3.75 0V2.25m0 0H5.25A1.125 1.125 0 004.125 3.375v.875m0 0V4.5"
                    />
                  </svg>
                  <span>Outros Recursos</span>
                </a>
                {/* Adicione mais links conforme necessário */}
              </nav>
            </aside>

            {/* Conteúdo principal (main) */}
            <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
          </div>

          {/* Footer permanece na parte inferior, ocupando 100% da largura */}
          <footer className="border-t border-gray-200 bg-white text-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-600">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-green-700">Guga</span>. Todos
              os direitos reservados.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
