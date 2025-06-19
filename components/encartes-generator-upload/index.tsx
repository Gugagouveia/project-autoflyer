// components/GeradorEncartes/UploadSection.tsx
"use client";

import {
  readFileAsText,
  validateTemplate,
  readFileAsDataURL,
  readExcelFile,
} from "@/lib/processEncartes";
import React from "react";
import { ProductData } from "./interfaces";

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
      const headers: string[] = data[0].map(String); // Ensure headers are strings
      setExcelHeaders(headers);
      const products = data.slice(1).map((row) => {
        let rowData: { [key: string]: string } = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index] !== undefined ? String(row[index]) : "";
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

  return (
    <>
      <div className="my-10 text-left">
        <h2 className="text-3xl mb-5 text-white">1. Carregue o Template SVG</h2>
        <label
          htmlFor="templateInput"
          className="inline-block bg-gray-600 text-white py-3 px-6 rounded cursor-pointer text-lg transition-colors hover:bg-gray-700"
        >
          {templateFileName
            ? `Alterar Template: ${templateFileName}`
            : "Carregar Template SVG"}
        </label>
        <input
          id="templateInput"
          type="file"
          accept=".svg"
          onChange={handleTemplateInputChange}
          className="hidden"
        />
        {templateAlert && <p className="text-red-500 mt-2">{templateAlert}</p>}
        {templateSVG && (
          <div className="max-w-[300px] mx-auto my-5 border-2 border-green-500 rounded-lg overflow-hidden">
            <img
              src={`data:image/svg+xml;utf8,${encodeURIComponent(templateSVG)}`}
              alt="Template Preview"
              className="w-full h-auto"
            />
          </div>
        )}
      </div>

      <div className="my-10 text-left">
        <h2 className="text-3xl mb-5 text-white">
          2. Carregue a Imagem de Fundo (PNG/JPG)
        </h2>
        <label
          htmlFor="bgImageInput"
          className="inline-block bg-gray-600 text-white py-3 px-6 rounded cursor-pointer text-lg transition-colors hover:bg-gray-700"
        >
          {bgFileName
            ? `Alterar Fundo: ${bgFileName}`
            : "Carregar Imagem de Fundo"}
        </label>
        <input
          id="bgImageInput"
          type="file"
          accept=".png, .jpg, .jpeg"
          onChange={handleBgInputChange}
          className="hidden"
        />
        {bgAlert && <p className="text-red-500 mt-2">{bgAlert}</p>}
        {bgImage && (
          <div className="max-w-[300px] mx-auto my-5 border-2 border-green-500 rounded-lg overflow-hidden">
            <img
              src={bgImage}
              alt="Background Preview"
              className="w-full h-auto"
            />
          </div>
        )}
      </div>

      <div className="my-10 text-left">
        <h2 className="text-3xl mb-5 text-white">
          3. Carregue a Planilha de Dados (Excel)
        </h2>
        <label
          htmlFor="excelInput"
          className="inline-block bg-gray-600 text-white py-3 px-6 rounded cursor-pointer text-lg transition-colors hover:bg-gray-700"
        >
          {excelFileName
            ? `Alterar Planilha: ${excelFileName}`
            : "Carregar Planilha Excel (.xlsx, .xls)"}
        </label>
        <input
          id="excelInput"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleExcelInputChange}
          className="hidden"
        />
        {excelAlert && <p className="text-red-500 mt-2">{excelAlert}</p>}
      </div>
    </>
  );
};

export default UploadSection;
