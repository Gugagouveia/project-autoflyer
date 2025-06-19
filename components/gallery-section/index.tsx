"use client";

import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { GeneratedOutput } from "../encartes-generator-upload/interfaces";
import { Button } from "../ui/button"; // Importado seu componente de botão

interface GallerySectionProps {
  showGallery: boolean;
  exportPng: boolean;
  exportSvgGrid: boolean;
  exportPdf: boolean;
  generatedPngs: GeneratedOutput[];
  generatedSvgGrid: GeneratedOutput | null;
  generatedPdf: Blob | null;
  addLog: (
    message: string,
    type?: "info" | "error" | "success" | "step",
    data?: any
  ) => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({
  showGallery,
  exportPng,
  exportSvgGrid,
  exportPdf,
  generatedPngs,
  generatedSvgGrid,
  generatedPdf,
  addLog,
}) => {
  const downloadAllPngs = async () => {
    addLog("Iniciando download de todos os PNGs (ZIP)...", "step");
    const zip = new JSZip();
    generatedPngs.forEach((png) => {
      if (png.dataUrl) {
        const base64Data = png.dataUrl.split(",")[1];
        zip.file(png.filename, base64Data, { base64: true });
      }
    });

    try {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "encartes_pngs.zip");
      addLog("Download de PNGs concluído.", "success");
    } catch (error: any) {
      addLog("Erro ao gerar ZIP de PNGs.", "error", error);
    }
  };

  const downloadSvgGrid = () => {
    if (generatedSvgGrid) {
      addLog("Iniciando download do SVG (grade única)...", "step");
      const blob = new Blob([generatedSvgGrid.svgString!], {
        type: "image/svg+xml",
      });
      saveAs(blob, generatedSvgGrid.filename);
      addLog("Download do SVG da grade concluído.", "success");
    } else {
      addLog("Nenhum SVG de grade única para baixar.", "error");
    }
  };

  const downloadPdf = () => {
    if (generatedPdf) {
      addLog("Iniciando download do PDF...", "step");
      saveAs(generatedPdf, "encartes.pdf");
      addLog("Download do PDF concluído.", "success");
    } else {
      addLog("Nenhum PDF para baixar.", "error");
    }
  };

  if (!showGallery) {
    return null;
  }

  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4 border-gray-200">
        Resultados Gerados
      </h2>
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {exportPng && generatedPngs.length > 0 && (
          // Usando o componente Button importado
          <Button
            onClick={downloadAllPngs}
            className="flex items-center gap-2 py-2 px-5 rounded-lg font-semibold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
            // Se o Button padrão já for verde, não precisa de bg/hover explícito aqui
            // Caso contrário, adicione: bg-green-600 hover:bg-green-700
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Baixar Todos PNGs (ZIP)
          </Button>
        )}
        {exportSvgGrid && generatedSvgGrid && (
          // Usando um botão HTML normal e aplicando as classes diretamente
          <button
            onClick={downloadSvgGrid}
            className="flex items-center gap-2 bg-green-600 text-white py-2 px-5 rounded-lg font-semibold shadow-md transition-all duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.233 4.5H12M12 21l-4.5-4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Baixar SVG Grade Única
          </button>
        )}
        {exportPdf && generatedPdf && (
          // Usando um botão HTML normal e aplicando as classes diretamente
          <button
            onClick={downloadPdf}
            className="flex items-center gap-2 bg-green-600 text-white py-2 px-5 rounded-lg font-semibold shadow-md transition-all duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v1.5m-3.75 0h7.5"
              />
            </svg>
            Baixar PDF
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-10">
        {generatedPngs.map((png, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 transform transition-transform duration-200 hover:scale-105"
          >
            <img
              src={png.dataUrl}
              alt={png.filename}
              className="w-full h-auto object-cover"
            />
            <div className="p-3 text-center bg-gray-50 border-t border-gray-100">
              <p className="text-gray-700 text-sm font-medium break-words leading-tight">
                {png.filename}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GallerySection;
