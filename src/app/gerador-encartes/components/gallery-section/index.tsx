"use client";

import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { Button } from "../../../../components/ui/button";
import { GeneratedOutput } from "@/src/lib/types/geradorEncartes";

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

export const GallerySection: React.FC<GallerySectionProps> = ({
  showGallery,
  exportPng,
  exportSvgGrid,
  exportPdf,
  generatedPngs,
  generatedSvgGrid,
  generatedPdf,
  addLog,
}) => {
  const handleDownloadError = (message: string, error: any) => {
    addLog(message, "error", error);
    alert(message);
  };

  const handleDownloadSuccess = (message: string) => {
    addLog(message, "success");
  };

  const downloadAllPngs = async () => {
    addLog("Iniciando download de todos os PNGs (ZIP)...", "step");
    const zip = new JSZip();

    if (generatedPngs.length === 0) {
      handleDownloadError("Nenhum PNG gerado para baixar.", null);
      return;
    }

    generatedPngs.forEach((png) => {
      if (png.dataUrl) {
        const base64Data = png.dataUrl.split(",")[1];
        zip.file(png.filename, base64Data, { base64: true });
      }
    });

    try {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "encartes_pngs.zip");
      handleDownloadSuccess("Download de PNGs concluído.");
    } catch (error: any) {
      handleDownloadError("Erro ao gerar ZIP de PNGs.", error);
    }
  };

  const downloadSvgGrid = () => {
    if (generatedSvgGrid?.svgString) {
      addLog("Iniciando download do SVG (grade única)...", "step");
      const blob = new Blob([generatedSvgGrid.svgString], {
        type: "image/svg+xml",
      });
      saveAs(blob, generatedSvgGrid.filename);
      handleDownloadSuccess("Download do SVG da grade concluído.");
    } else {
      handleDownloadError("Nenhum SVG de grade única para baixar.", null);
    }
  };

  const downloadPdf = () => {
    if (generatedPdf) {
      addLog("Iniciando download do PDF...", "step");
      saveAs(generatedPdf, "encartes.pdf");
      handleDownloadSuccess("Download do PDF concluído.");
    } else {
      handleDownloadError("Nenhum PDF para baixar.", null);
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
          <Button onClick={downloadAllPngs} className="gap-2">
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
          <Button onClick={downloadSvgGrid} className="gap-2">
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
          </Button>
        )}
        {exportPdf && generatedPdf && (
          <Button onClick={downloadPdf} className="gap-2">
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
          </Button>
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
