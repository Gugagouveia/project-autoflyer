"use client";

import GeradorEncartes from "@/components/gerador-escartes";
import React from "react";

export default function GeradorEncartesPage() {
  return (
    // Removido o background e padding vertical, o RootLayout cuidará disso
    // <main className="min-h-screen bg-gradient-to-b from-gray-50 to-black dark:from-gray-900 dark:to-gray-800 py-12">
    <div className="">
      {" "}
      {/* Adicionado um padding vertical para o conteúdo dentro do container do layout */}
      <GeradorEncartes />
    </div>
    // </main> - O main já é definido no RootLayout
  );
}
