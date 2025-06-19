"use client";

import React from "react";

interface ExportOptionsSectionProps {
  exportPng: boolean;
  setExportPng: (checked: boolean) => void;
  exportSvgGrid: boolean;
  setExportSvgGrid: (checked: boolean) => void;
  exportPdf: boolean;
  setExportPdf: (checked: boolean) => void;
  exportAlert: string;
}

const ExportOptionsSection: React.FC<ExportOptionsSectionProps> = ({
  exportPng,
  setExportPng,
  exportSvgGrid,
  setExportSvgGrid,
  exportPdf,
  setExportPdf,
  exportAlert,
}) => {
  return (
    <div className="my-10 text-left">
      <h2 className="text-3xl mb-5 text-white">4. Opções de Exportação</h2>
      <div className="flex items-center justify-center gap-5 flex-wrap my-5">
        <label className="text-lg cursor-pointer flex items-center">
          <input
            type="checkbox"
            checked={exportPng}
            onChange={(e) => setExportPng(e.target.checked)}
            className="mr-2 transform scale-150 accent-green-500"
          />
          Exportar PNGs Individuais
        </label>
        <label className="text-lg cursor-pointer flex items-center">
          <input
            type="checkbox"
            checked={exportSvgGrid}
            onChange={(e) => setExportSvgGrid(e.target.checked)}
            className="mr-2 transform scale-150 accent-green-500"
          />
          Exportar SVG em Grade Única
        </label>
        <label className="text-lg cursor-pointer flex items-center">
          <input
            type="checkbox"
            checked={exportPdf}
            onChange={(e) => setExportPdf(e.target.checked)}
            className="mr-2 transform scale-150 accent-green-500"
          />
          Exportar PDF
        </label>
      </div>
      {exportAlert && <p className="text-red-500 mt-2">{exportAlert}</p>}
    </div>
  );
};

export default ExportOptionsSection;
