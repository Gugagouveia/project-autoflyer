"use client";

import GeradorEncartes from "@/components/gerador-escartes-final";
import React from "react";

export default function GeradorEncartesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-black dark:from-gray-900 dark:to-gray-800 py-12">
      <GeradorEncartes />
    </main>
  );
}
