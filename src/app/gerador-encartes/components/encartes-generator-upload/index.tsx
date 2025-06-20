"use client";

import {
  readFileAsText,
  validateTemplate,
  readFileAsDataURL,
  readExcelFile,
} from "@/src/lib/processEncartes";
import { ProductData } from "@/src/lib/types/geradorEncartes";
import React from "react";

interface UploadSectionProps {
  templateSVG: string;
  setTemplateSVG: (svg: string) => void;
  templateFileName: string;
  setTemplateFileName: (name: string) => void;
  templateAlert: string;
  setTemplateAlert: (alert: string) => void;
  bgImage: string | null;
  setBgImage: (image: string | null) => void;
  bgFileName: string;
  setBgFileName: (name: string) => void;
  bgAlert: string;
  setBgAlert: (alert: string) => void;
  excelData: ProductData[] | null;
  setExcelData: (data: ProductData[] | null) => void;
  excelHeaders: string[];
  setExcelHeaders: (headers: string[]) => void;
  excelFileName: string;
  setExcelFileName: (name: string) => void;
  excelAlert: string;
  setExcelAlert: (alert: string) => void;
  setShowMappingSection: (show: boolean) => void;
  addLog: (
    message: string,
    type?: "info" | "error" | "success" | "step",
    data?: any
  ) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  templateSVG,
  setTemplateSVG,
  templateFileName,
  setTemplateFileName,
  templateAlert,
  setTemplateAlert,
  bgImage,
  setBgImage,
  bgFileName,
  setBgFileName,
  bgAlert,
  setBgAlert,
  setExcelData,
  setExcelHeaders,
  excelFileName,
  setExcelFileName,
  excelAlert,
  setExcelAlert,
  setShowMappingSection,
  addLog,
}) => {
  const handleTemplateInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setTemplateFileName(file.name);
    setTemplateAlert("");

    try {
      const content = await readFileAsText(file);
      const validation = validateTemplate(content);

      if (!validation.valid) {
        setTemplateAlert(validation.message || "");
        setTemplateSVG("");
        addLog("Template inválido.", "error", validation.message);
      } else {
        setTemplateSVG(content);
        setTemplateAlert("");
        addLog("Template SVG validado com sucesso.", "success");
      }
    } catch (error: any) {
      addLog("Erro ao ler o arquivo de template.", "error", error);
      setTemplateAlert(
        `Erro ao ler o arquivo de template: ${
          error?.message || "Erro desconhecido"
        }`
      );
      setTemplateSVG("");
    }
  };

  const handleBgInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBgFileName(file.name);
    setBgAlert("");
    try {
      const dataUrl = await readFileAsDataURL(file);
      setBgImage(dataUrl);
      addLog("Imagem de fundo carregada com sucesso.", "success");
    } catch (error: any) {
      addLog("Erro ao ler o arquivo de fundo.", "error", error);
      setBgAlert(`Erro ao ler o arquivo de fundo: ${error.message}`);
      setBgImage(null);
    }
  };

  const handleExcelInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setExcelFileName(file.name);
    setExcelAlert("");
    setShowMappingSection(false);
    try {
      const data = await readExcelFile(file);
      if (data.length < 2) {
        throw new Error("Planilha vazia ou sem cabeçalho.");
      }

      let rawHeaders: string[] = data[0].map(String);
      let processedHeaders: string[] = [];
      const promoIndex = rawHeaders.findIndex(
        (header) =>
          header.toLowerCase() === "promo" ||
          header.toLowerCase() === "promocao"
      );

      if (promoIndex !== -1) {
        // Renomeia o cabeçalho "promo" para "preço"
        processedHeaders = rawHeaders.map((header, index) =>
          index === promoIndex ? "Preço" : header
        );
        addLog(
          `Cabeçalho "promo" renomeado para "preço" na importação.`,
          "info",
          { original: rawHeaders[promoIndex], novo: "Preço" }
        );
      } else {
        processedHeaders = rawHeaders;
      }

      setExcelHeaders(processedHeaders);

      const products = data.slice(1).map((row) => {
        let rowData: { [key: string]: string } = {};
        processedHeaders.forEach((header, index) => {
          // Usa os cabeçalhos processados
          let value = row[index] !== undefined ? String(row[index]) : "";
          // Se o cabeçalho original era "promo", e agora é "preço", atribui o valor à nova chave
          if (index === promoIndex && processedHeaders[index] === "Preço") {
            rowData["Preço"] = value; // Garante que o valor da coluna 'promo' vai para a chave 'preço'
          } else {
            rowData[header] = value;
          }
        });
        return rowData as ProductData;
      });

      setExcelData(products);
      setShowMappingSection(true);
      addLog(
        `Planilha lida com sucesso: ${products.length} linhas de dados.`,
        "success"
      );
    } catch (error: any) {
      addLog("Erro ao ler ou processar a planilha.", "error", error);
      setExcelAlert(`Erro ao ler a planilha: ${error.message}`);
      setExcelData(null);
      setExcelHeaders([]);
    }
  };

  const UploadInput = ({
    id,
    label,
    fileName,
    alertMessage,
    onChange,
    accept,
    preview,
  }: {
    id: string;
    label: string;
    fileName: string;
    alertMessage: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    accept: string;
    preview?: string | null;
  }) => (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-green-500 transition-all duration-300 group">
      <label
        htmlFor={id}
        className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
      >
        <div className="p-4 rounded-full bg-gray-200 group-hover:bg-green-600 transition-colors duration-300 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 text-green-500 group-hover:text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
        <span className="text-xl font-semibold text-gray-800 group-hover:text-green-700 transition-colors duration-300">
          {fileName ? `Alterar ${label}: ${fileName}` : `Carregar ${label}`}
        </span>
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={onChange}
          className="hidden"
        />
        {alertMessage && (
          <p className="text-red-600 text-sm mt-2">{alertMessage}</p>
        )}
        {preview && (
          <div className="mt-6 w-full max-w-[200px] h-auto border border-gray-300 rounded-md overflow-hidden shadow-sm">
            <img
              src={preview.startsWith("data:image/svg+xml") ? preview : preview}
              alt="Preview"
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </label>
    </div>
  );

  return (
    <div className="space-y-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        1. Carregue Seus Ativos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UploadInput
          id="templateInput"
          label="Template SVG"
          fileName={templateFileName}
          alertMessage={templateAlert}
          onChange={handleTemplateInputChange}
          accept=".svg"
          preview={
            templateSVG
              ? `data:image/svg+xml;utf8,${encodeURIComponent(templateSVG)}`
              : null
          }
        />
        <UploadInput
          id="bgImageInput"
          label="Imagem de Fundo"
          fileName={bgFileName}
          alertMessage={bgAlert}
          onChange={handleBgInputChange}
          accept=".png, .jpg, .jpeg"
          preview={bgImage}
        />
        <UploadInput
          id="excelInput"
          label="Planilha de Dados"
          fileName={excelFileName}
          alertMessage={excelAlert}
          onChange={handleExcelInputChange}
          accept=".xlsx, .xls"
        />
      </div>
    </div>
  );
};

export default UploadSection;
