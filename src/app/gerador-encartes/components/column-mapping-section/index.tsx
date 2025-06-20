"use client";

import { ColumnMapping } from "@/src/lib/types/geradorEncartes";
import React, { useState, useEffect } from "react";

interface ColumnMappingSectionProps {
  showMappingSection: boolean;
  excelHeaders: string[];
  columnMapping: ColumnMapping;
  setColumnMapping: React.Dispatch<React.SetStateAction<ColumnMapping>>;
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
  const [isMappingConfirmed, setIsMappingConfirmed] = useState<boolean>(false);

  useEffect(() => {
    if (!showMappingSection || excelHeaders.length === 0) {
      setIsMappingConfirmed(false);
    }
  }, [showMappingSection, excelHeaders]);

  const handleColumnSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    key: keyof ColumnMapping
  ) => {
    setColumnMapping((prev: ColumnMapping) => ({
      ...prev,
      [key]: e.target.value,
    }));
    setIsMappingConfirmed(false);
  };

  const handleConfirmMapping = () => {
    if (
      !columnMapping.codigo ||
      !columnMapping.produto ||
      !columnMapping.preço
    ) {
      alert("Por favor, mapeie todas as colunas necessárias.");
      addLog("Mapeamento incompleto.", "error");
      setIsMappingConfirmed(false);
      return;
    }
    addLog("Mapeamento de colunas confirmado.", "success", columnMapping);
    setIsMappingConfirmed(true);
  };

  const handleEditMapping = () => {
    setIsMappingConfirmed(false);
    addLog("Modo de edição de mapeamento ativado.", "info");
  };

  if (!showMappingSection || excelHeaders.length === 0) {
    return null;
  }

  const areAllColumnsMapped =
    !!columnMapping.codigo && !!columnMapping.produto && !!columnMapping.preço;

  return (
    <div className="bg-white p-6 rounded-xl my-8 text-left shadow-xl border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-7 h-7 text-green-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.209-.138 2.43-.138 3.662V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V12zM12 10.5v4.5m0-4.5h.008v.008H12V10.5zm0 0H11.25m-.75 0V9m0 0a2.25 2.25 0 01-2.25-2.25V5.25a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25h-1.5z"
          />
        </svg>
        Mapeamento de Colunas
        {isMappingConfirmed && (
          <span className="ml-3 text-green-600 text-base flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.532a.75.75 0 001.082 1.047l3.992-4.99a.75.75 0 00-.096-1.07z"
                clipRule="evenodd"
              />
            </svg>
            Confirmado!
          </span>
        )}
      </h3>
      <p className="text-gray-700 mb-6 leading-relaxed">
        Associe os campos necessários do template às colunas correspondentes na
        sua planilha de dados.
      </p>
      <div className="space-y-5">
        {[
          { label: "Código", key: "codigo" },
          { label: "Produto", key: "produto" },
          { label: "Preço", key: "preço" },
        ].map(({ label, key }) => (
          <div
            key={key}
            className="flex flex-col sm:flex-row sm:items-center gap-2"
          >
            <label
              htmlFor={`select-${key}`}
              className="w-full sm:w-[180px] font-medium text-lg text-gray-800"
            >
              {label}:
            </label>
            <div className="relative flex-grow">
              <select
                id={`select-${key}`}
                onChange={(e) =>
                  handleColumnSelectChange(e, key as keyof ColumnMapping)
                }
                className={`block w-full p-3 bg-gray-100 text-gray-900 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 appearance-none pr-10 transition-all duration-200
                  ${
                    isMappingConfirmed
                      ? "border-gray-300 cursor-not-allowed"
                      : "border-green-500"
                  }
                `}
                value={columnMapping?.[key as keyof ColumnMapping] || ""}
                disabled={isMappingConfirmed}
              >
                <option value="" disabled>
                  Selecione a coluna
                </option>
                {excelHeaders.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!isMappingConfirmed ? (
        <button
          onClick={handleConfirmMapping}
          className={`mt-8 w-full sm:w-auto text-white py-3 px-8 rounded-lg font-semibold text-lg uppercase tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white transform hover:scale-105
            ${
              areAllColumnsMapped
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }
          `}
          disabled={!areAllColumnsMapped}
        >
          Confirmar Mapeamento
        </button>
      ) : (
        <button
          onClick={handleEditMapping}
          className="mt-8 w-full sm:w-auto bg-gray-200 text-gray-800 py-3 px-8 rounded-lg font-semibold text-lg uppercase tracking-wide transition-all duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transform hover:scale-105"
        >
          Editar Mapeamento
        </button>
      )}
    </div>
  );
};

export default ColumnMappingSection;
