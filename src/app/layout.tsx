import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/src/lib/utils";

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
        <div className="flex min-h-screen flex-col bg-white">
          <header className="bg-white py-4 border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8 text-green-600"
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
          <div className="flex flex-1">
            <aside className="w-64 bg-gray-100 border-r border-gray-200 p-6 flex flex-col space-y-4">
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
                  href="http://localhost:3000/image-editor"
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
                      d="M15.75 3v2.25M8.25 3v2.25M3 7.5h18M4.5 21h15a1.5 1.5 0 001.5-1.5V7.5H3v12a1.5 1.5 0 001.5 1.5z"
                    />
                  </svg>
                  <span>Editor de Imagens</span>
                </a>
              </nav>
            </aside>
            <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
          </div>
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
