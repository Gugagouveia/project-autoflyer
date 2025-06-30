import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";

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
          "min-h-screen bg-gray-50 font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <div className="flex min-h-screen">
          <aside
            className={cn(
              "hidden lg:block w-64 bg-white border-r border-gray-200 p-6"
            )}
          >
            <div className="flex items-center gap-3 mb-8">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="logoGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#16A34A" />
                    <stop offset="100%" stopColor="#15803D" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#logoGradient)"
                  d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM12,6a6,6,0,1,0,6,6A6,6,0,0,0,12,6Zm0,10a4,4,0,1,1,4-4A4,4,0,0,1,12,16Zm4-4H12V8h2v2h2Z"
                />
              </svg>
              <span className="text-xl font-bold text-gray-800">GugaApps</span>
            </div>
            <nav className="space-y-3">
              <BottombarLink
                href="/gerador-encartes"
                label="Gerador"
                iconPath="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                isSidebar={true}
              />
              <BottombarLink
                href="/image-editor"
                label="Editor"
                iconPath="M15.75 3v2.25M8.25 3v2.25M3 7.5h18M4.5 21h15a1.5 1.5 0 001.5-1.5V7.5H3v12a1.5 1.5 0 001.5 1.5z"
                isSidebar={true}
              />
            </nav>
          </aside>

          <div className="flex flex-col flex-1">
            <main className="flex-1 overflow-y-auto p-6 pb-24 lg:pb-6">
              {children}
            </main>

            <footer className="hidden lg:block bg-white border-t border-gray-200 text-sm text-gray-500">
              <div className="container mx-auto px-6 py-4 text-center">
                © {new Date().getFullYear()}{" "}
                <span className="font-semibold text-green-700">Guga</span>.
                Todos os direitos reservados.
              </div>
            </footer>
          </div>
        </div>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 shadow-t-md">
          <BottombarLink
            href="/gerador-encartes"
            label="Gerador"
            iconPath="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <BottombarLink
            href="/image-editor"
            label="Editor"
            iconPath="M15.75 3v2.25M8.25 3v2.25M3 7.5h18M4.5 21h15a1.5 1.5 0 001.5-1.5V7.5H3v12a1.5 1.5 0 001.5 1.5z"
          />
        </nav>
      </body>
    </html>
  );
}

function BottombarLink({
  href,
  label,
  iconPath,
  isSidebar = false,
}: {
  href: string;
  label: string;
  iconPath: string;
  isSidebar?: boolean;
}) {
  const baseClasses =
    "group flex items-center gap-3 rounded-md transition-colors";
  const sidebarClasses =
    "px-4 py-2 text-gray-700 hover:bg-green-100 hover:text-green-800";
  const bottombarClasses =
    "flex-col justify-center p-2 text-gray-600 hover:bg-green-50 hover:text-green-700 w-full";

  return (
    <a
      href={href}
      className={cn(baseClasses, isSidebar ? sidebarClasses : bottombarClasses)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "w-6 h-6",
          isSidebar
            ? "text-green-600"
            : "text-gray-500 group-hover:text-green-700"
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
      </svg>
      <span className={cn("font-medium", isSidebar ? "text-base" : "text-xs")}>
        {label}
      </span>
    </a>
  );
}
