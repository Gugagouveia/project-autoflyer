"use client";

import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { GeneratedOutput } from "../encartes-generator-upload/interfaces";

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
      <h2 className="text-3xl mb-5 text-white">Encartes Gerados</h2>
      <div className="flex justify-center gap-5 flex-wrap mt-10">
        {exportPng && generatedPngs.length > 0 && (
          <button
            onClick={downloadAllPngs}
            className="bg-green-500 text-black border-none py-3 px-6 rounded font-bold transition-colors hover:bg-green-600"
          >
            Baixar Todos PNGs (ZIP)
          </button>
        )}
        {exportSvgGrid && generatedSvgGrid && (
          <button
            onClick={downloadSvgGrid}
            className="bg-green-500 text-black border-none py-3 px-6 rounded font-bold transition-colors hover:bg-green-600"
          >
            Baixar SVG Grade Única
          </button>
        )}
        {exportPdf && generatedPdf && (
          <button
            onClick={downloadPdf}
            className="bg-green-500 text-black border-none py-3 px-6 rounded font-bold transition-colors hover:bg-green-600"
          >
            Baixar PDF
          </button>
        )}
      </div>

      <div className="grid grid-cols-auto-fill-minmax-250 gap-5 mt-10">
        {generatedPngs.map((png, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg shadow-green-500/20"
          >
            <img
              src={png.dataUrl}
              alt={png.filename}
              className="w-full h-auto"
            />
            <div className="p-4">
              <p className="text-white text-sm break-words">{png.filename}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GallerySection;
