// components/GeradorEncartes/ColumnMappingSection.tsx
"use client";

import React from "react";
import { ColumnMapping } from "../encartes-generator-upload/interfaces";

interface ColumnMappingSectionProps {
  showMappingSection: boolean;
  excelHeaders: string[];
  columnMapping: ColumnMapping;
  setColumnMapping: (mapping: ColumnMapping) => void;
  addLog: (
    message: string,
    type?: "info" | "error" | "success" | "step",
    data?: any
  ) => void;
}

const ColumnMappingSection: React.FC<ColumnMappingSectionProps> = ({
  showMappingSection,
  excelHeaders,
  columnMapping,
  setColumnMapping,
  addLog,
}) => {
  const handleColumnSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    key: keyof ColumnMapping
  ) => {
    setColumnMapping({
      ...columnMapping,
      [key]: e.target.value,
    });
  };

  const handleConfirmMapping = () => {
    if (
      !columnMapping.codigo ||
      !columnMapping.produto ||
      !columnMapping.promo
    ) {
      alert("Por favor, mapeie todas as colunas necessárias.");
      addLog("Mapeamento incompleto.", "error");
      return;
    }
    addLog("Mapeamento de colunas confirmado.", "success", columnMapping);
  };

  if (!showMappingSection || excelHeaders.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-5 rounded-lg my-5 text-left">
      <h3 className="text-2xl mb-4 text-white">Mapeamento de Colunas</h3>
      <p className="text-gray-300 mb-4">
        Associe os campos do template às colunas da sua planilha.
      </p>
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <label className="w-[150px] font-bold text-lg">Código:</label>
          <select
            onChange={(e) => handleColumnSelectChange(e, "codigo")}
            className="flex-grow p-2 bg-gray-700 text-white border border-green-500 rounded-md"
            value={columnMapping.codigo || ""}
          >
            <option value="">Selecione a coluna</option>
            {excelHeaders.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center mb-4">
          <label className="w-[150px] font-bold text-lg">Produto:</label>
          <select
            onChange={(e) => handleColumnSelectChange(e, "produto")}
            className="flex-grow p-2 bg-gray-700 text-white border border-green-500 rounded-md"
            value={columnMapping.produto || ""}
          >
            <option value="">Selecione a coluna</option>
            {excelHeaders.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center mb-4">
          <label className="w-[150px] font-bold text-lg">Preço/Promo:</label>
          <select
            onChange={(e) => handleColumnSelectChange(e, "promo")}
            className="flex-grow p-2 bg-gray-700 text-white border border-green-500 rounded-md"
            value={columnMapping.promo || ""}
          >
            <option value="">Selecione a coluna</option>
            {excelHeaders.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={handleConfirmMapping}
        className="mt-5 bg-green-500 text-black py-3 px-6 rounded font-bold text-lg uppercase transition-colors hover:bg-green-600"
      >
        Confirmar Mapeamento
      </button>
    </div>
  );
};

export default ColumnMappingSection;
