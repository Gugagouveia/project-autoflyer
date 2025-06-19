"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import {
  modifySVG,
  normalizeString,
  composeSVGWithBGAndConvertToPNG,
} from "@/lib/processEncartes";
import ColumnMappingSection from "../column-mapping-section";
import DiagnosticLogs from "../diagnostic-logs";
import UploadSection from "../encartes-generator-upload";
import {
  ProductData,
  ColumnMapping,
  GeneratedOutput,
} from "../encartes-generator-upload/interfaces";
import ExportOptionsSection from "../export-options-section";
import GallerySection from "../gallery-section";
import GenerationControls from "../generation-controls";

const SVG_WIDTH = 1080; // Largura do encarte individual
const SVG_HEIGHT = 1080; // Altura do encarte individual
const GRID_COLS = 5; // Número de colunas na grade SVG
const GRID_SPACING = 20; // Espaçamento entre encartes na grade

const GeradorEncartes: React.FC = () => {
  // State variables
  const [templateSVG, setTemplateSVG] = useState<string>("");
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [excelData, setExcelData] = useState<ProductData[] | null>(null);
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    codigo: null,
    produto: null,
    promo: null,
  });

  const [generatedPngs, setGeneratedPngs] = useState<GeneratedOutput[]>([]);
  const [, setGeneratedSvgs] = useState<GeneratedOutput[]>([]);
  const [generatedPdf, setGeneratedPdf] = useState<Blob | null>(null);
  const [generatedSvgGrid, setGeneratedSvgGrid] =
    useState<GeneratedOutput | null>(null);

  const [diagnosticMode, setDiagnosticMode] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);

  const [templateFileName, setTemplateFileName] = useState<string>("");
  const [bgFileName, setBgFileName] = useState<string>("");
  const [excelFileName, setExcelFileName] = useState<string>("");

  const [templateAlert, setTemplateAlert] = useState<string>("");
  const [bgAlert, setBgAlert] = useState<string>("");
  const [excelAlert, setExcelAlert] = useState<string>("");
  const [exportAlert, setExportAlert] = useState<string>("");

  const [showMappingSection, setShowMappingSection] = useState<boolean>(false);
  const [showGallery, setShowGallery] = useState<boolean>(false);

  const [exportPng, setExportPng] = useState<boolean>(true);
  const [exportSvgGrid, setExportSvgGrid] = useState<boolean>(false);
  const [exportPdf, setExportPdf] = useState<boolean>(false);

  // Helper functions for logging
  const addLog = useCallback(
    (
      message: string,
      type: "info" | "error" | "success" | "step" = "info",
      data: any = null
    ) => {
      const now = new Date();
      const datePart = now.toLocaleDateString("pt-BR");
      const timePart = now.toLocaleTimeString("pt-BR");

      if (!diagnosticMode && type !== "error" && type !== "step") return;

      let logText = `[${datePart} ${timePart}] ${message}`;
      if (data !== null && diagnosticMode) {
        try {
          if (typeof data === "object") {
            logText += `\nData: ${JSON.stringify(data, null, 2)}`;
          } else {
            logText += `\nData: ${String(data)}`;
          }
        } catch (e) {
          logText += `\nData: [Não foi possível exibir os dados]`;
        }
      }
      setLogs((prevLogs) => [...prevLogs, logText]);
    },
    [diagnosticMode]
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const showStatus = (
    message: string,
    type: "info" | "error" | "success" | "step" = "info"
  ) => {
    if (type === "error") {
      alert(message);
    }
    addLog(message, type);
  };

  const resetUI = useCallback(() => {
    setGeneratedPngs([]);
    setGeneratedSvgs([]);
    setGeneratedPdf(null);
    setGeneratedSvgGrid(null);
    setShowGallery(false);
    setProcessing(false);
    setProgress(0);
    setTemplateAlert("");
    setBgAlert("");
    setExcelAlert("");
    setExportAlert("");
    if (!diagnosticMode) {
      clearLogs();
    }
  }, [diagnosticMode, clearLogs]);

  // Derived state to check if all inputs are ready for processing
  const checkInputsReady = useCallback((): boolean => {
    const templateReady = templateSVG !== "";
    const bgReady = bgImage !== null;
    const excelReady = excelData !== null && excelData.length > 0;
    const mappingReady =
      !!columnMapping.codigo &&
      !!columnMapping.produto &&
      !!columnMapping.promo;

    return templateReady && bgReady && excelReady && mappingReady;
  }, [templateSVG, bgImage, excelData, columnMapping]);

  // Effect to clear logs when diagnostic mode is toggled off
  useEffect(() => {
    if (!diagnosticMode) {
      clearLogs();
    }
  }, [diagnosticMode, clearLogs]);

  const updateProgressBar = (processed: number, total: number) => {
    const percentage = total > 0 ? Math.round((processed / total) * 100) : 0;
    setProgress(percentage);
  };

  const handleProcessEncartes = async () => {
    resetUI();
    addLog("Iniciando processamento dos encartes...", "step");
    setProcessing(true);

    const selectedExportFormats = [];
    if (exportPng) selectedExportFormats.push("png");
    if (exportSvgGrid) selectedExportFormats.push("svgGrid");
    if (exportPdf) selectedExportFormats.push("pdf");

    if (selectedExportFormats.length === 0) {
      setExportAlert("Selecione ao menos um formato de exportação.");
      showStatus("Nenhum formato de exportação selecionado.", "error");
      setProcessing(false);
      return;
    } else {
      setExportAlert("");
    }

    setProgress(0);

    const currentPngs: GeneratedOutput[] = [];
    const currentSvgs: GeneratedOutput[] = [];
    let currentPdf: Blob | null = null;
    let currentSvgGrid: GeneratedOutput | null = null;

    const pdfDoc = exportPdf
      ? new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [SVG_WIDTH, SVG_HEIGHT],
        })
      : null;

    const pngGenerationPromises: Promise<void>[] = [];

    if (excelData && bgImage && templateSVG) {
      for (let i = 0; i < excelData.length; i++) {
        const row = excelData[i];
        const codigo = row[columnMapping.codigo!];
        const produto = row[columnMapping.produto!];
        const preco = row[columnMapping.promo!];

        if (!codigo || !produto || !preco) {
          addLog(
            `Linha ${
              i + 2
            } ignorada devido a dados incompletos: Código=${codigo}, Produto=${produto}, Preço=${preco}`,
            "info"
          );
          updateProgressBar(i + 1, excelData.length);
          continue;
        }

        const data: ProductData = { codigo, produto, preco };
        const modifiedSvgContent = modifySVG(templateSVG, data);

        const filenameBase = `encarte_${normalizeString(
          codigo
        )}_${normalizeString(produto)}`;

        currentSvgs.push({
          filename: `${filenameBase}.svg`,
          svgString: modifiedSvgContent,
        });

        if (exportPng || exportPdf) {
          pngGenerationPromises.push(
            composeSVGWithBGAndConvertToPNG(
              modifiedSvgContent,
              bgImage,
              filenameBase,
              SVG_WIDTH,
              SVG_HEIGHT,
              addLog
            )
              .then((dataUrl) => {
                currentPngs.push({
                  filename: `${filenameBase}.png`,
                  dataUrl: dataUrl,
                });
                if (exportPdf && pdfDoc) {
                  addLog(`Adicionando ${filenameBase}.png ao PDF...`);
                  pdfDoc.addImage(dataUrl, "PNG", 0, 0, SVG_WIDTH, SVG_HEIGHT);
                  if (i < excelData.length - 1) {
                    pdfDoc.addPage();
                  }
                }
              })
              .catch((error) => {
                addLog(
                  `Falha ao gerar PNG para ${filenameBase}: ${error.message}`,
                  "error"
                );
              })
              .finally(() => {
                updateProgressBar(i + 1, excelData.length);
              })
          );
        } else {
          updateProgressBar(i + 1, excelData.length);
        }
      }
    }

    const results = await Promise.allSettled(pngGenerationPromises);
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        addLog(`Promise ${index} rejeitada: ${result.reason}`, "error");
      }
    });

    setGeneratedPngs(currentPngs);
    setGeneratedSvgs(currentSvgs);

    if (exportSvgGrid) {
      addLog("Gerando grade SVG única...", "step");
      const totalItems = currentSvgs.length;
      const rows = Math.ceil(totalItems / GRID_COLS);
      const gridWidth = GRID_COLS * SVG_WIDTH + (GRID_COLS - 1) * GRID_SPACING;
      const gridHeight = rows * SVG_HEIGHT + (rows - 1) * GRID_SPACING;

      let masterSvg = `<svg width="${gridWidth}" height="${gridHeight}" viewBox="0 0 ${gridWidth} ${gridHeight}" xmlns="http://www.w3.org/2000/svg">`;

      currentSvgs.forEach((item, index) => {
        const col = index % GRID_COLS;
        const row = Math.floor(index / GRID_COLS);
        const x = col * (SVG_WIDTH + GRID_SPACING);
        const y = row * (SVG_HEIGHT + GRID_SPACING);

        const parser = new DOMParser();
        const individualSvgDoc = parser.parseFromString(
          item.svgString!,
          "image/svg+xml"
        );
        const individualSvgElement = individualSvgDoc.documentElement;

        individualSvgElement.removeAttribute("width");
        individualSvgElement.removeAttribute("height");

        masterSvg +=
          `<g transform="translate(${x},${y})">` +
          individualSvgElement.outerHTML +
          `</g>`;
      });
      masterSvg += `</svg>`;
      currentSvgGrid = {
        filename: "encartes_grade_unica.svg",
        svgString: masterSvg,
      };
      setGeneratedSvgGrid(currentSvgGrid);
      addLog("Grade SVG única gerada.", "success");
    }

    if (exportPdf && pdfDoc) {
      currentPdf = pdfDoc.output("blob");
      setGeneratedPdf(currentPdf);
      addLog("PDF com encartes individuais gerado.", "success");
    }

    setShowGallery(true);
    setProcessing(false);
    showStatus("Processamento concluído!", "success");
  };

  return (
    <div className="h-full w-full text-gray-900 font-sans antialiased flex flex-col items-center">
      <div className="w-full space-y-12 max-w-7xl">
        <header className="text-center">
          <h1 className="text-5xl sm:text-6xl font-medium text-green-600 leading-tight tracking-tighter mb-4 drop-shadow-lg">
            {" "}
            {/* Verde */}
            Gerador de Encartes
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto opacity-90">
            Simplifique a criação de encartes de produtos com nosso gerador
            automático. Importe seus dados, personalize seu template e exporte
            em diversos formatos.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Input & Control Section */}
          <section className="space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-green-500" // Verde
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Comece Aqui
            </h2>
            <UploadSection
              templateSVG={templateSVG}
              setTemplateSVG={setTemplateSVG}
              templateFileName={templateFileName}
              setTemplateFileName={setTemplateFileName}
              templateAlert={templateAlert}
              setTemplateAlert={setTemplateAlert}
              bgImage={bgImage}
              setBgImage={setBgImage}
              bgFileName={bgFileName}
              setBgFileName={setBgFileName}
              bgAlert={bgAlert}
              setBgAlert={setBgAlert}
              excelData={excelData}
              setExcelData={setExcelData}
              excelHeaders={excelHeaders}
              setExcelHeaders={setExcelHeaders}
              excelFileName={excelFileName}
              setExcelFileName={setExcelFileName}
              excelAlert={excelAlert}
              setExcelAlert={setExcelAlert}
              setShowMappingSection={setShowMappingSection}
              addLog={addLog}
            />

            <ColumnMappingSection
              showMappingSection={showMappingSection}
              excelHeaders={excelHeaders}
              columnMapping={columnMapping}
              setColumnMapping={setColumnMapping}
              addLog={addLog}
            />

            <ExportOptionsSection
              exportPng={exportPng}
              setExportPng={setExportPng}
              exportSvgGrid={exportSvgGrid}
              setExportSvgGrid={setExportSvgGrid}
              exportPdf={exportPdf}
              setExportPdf={setExportPdf}
              exportAlert={exportAlert}
            />

            <GenerationControls
              processing={processing}
              progress={progress}
              checkInputsReady={checkInputsReady}
              handleProcessEncartes={handleProcessEncartes}
            />
          </section>

          {/* Output & Logs Section */}
          <section className="space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-green-500" // Verde
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L17.25 9H13.5A2.25 2.25 0 0011.25 11.25v4.5M3.75 13.5L8.25 18m0 0l-3.5-4.5M8.25 18H18.75a2.25 2.25 0 002.25-2.25V10.5M12.75 16.5V9.75"
                />
              </svg>
              Resultados e Diagnóstico
            </h2>
            <GallerySection
              showGallery={showGallery}
              exportPng={exportPng}
              exportSvgGrid={exportSvgGrid}
              exportPdf={exportPdf}
              generatedPngs={generatedPngs}
              generatedSvgGrid={generatedSvgGrid}
              generatedPdf={generatedPdf}
              addLog={addLog}
            />

            <DiagnosticLogs
              diagnosticMode={diagnosticMode}
              setDiagnosticMode={setDiagnosticMode}
              logs={logs}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default GeradorEncartes;
