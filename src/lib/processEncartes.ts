import * as XLSX from "xlsx";
import { ProductData } from "./types/geradorEncartes";

export const normalizeString = (str: string): string => {
  if (typeof str !== "string") return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const readExcelFile = (file: File): Promise<any[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        resolve(jsonData as any[][]);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const validateTemplate = (
  svgContent: string
): { valid: boolean; message?: string } => {
  if (!svgContent.includes("<svg") || !svgContent.includes("</svg>")) {
    return {
      valid: false,
      message: "O arquivo selecionado não é um SVG válido.",
    };
  }

  const requiredElements = [
    { id: "codigo", name: "Código do produto" },
    { id: "descricao", name: "Descrição do produto (linha 1)" },
    { id: "preco", name: "Preço do produto" },
  ];

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(svgContent, "image/svg+xml");
  const svgElement = xmlDoc.documentElement;

  const missingElements: string[] = [];

  requiredElements.forEach((el) => {
    if (!svgElement.querySelector(`#${el.id}`)) {
      missingElements.push(el.name);
    }
  });

  if (missingElements.length > 0) {
    const message = `Template inválido: Elementos necessários não encontrados: ${missingElements.join(
      ", "
    )}. Verifique os IDs no seu SVG.`;
    return { valid: false, message };
  }

  return { valid: true };
};

export const splitDescription = (
  description: string,
  maxLines: number,
  maxCharsPerLine: number
): string[] => {
  const words = description.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if (lines.length >= maxLines) break;

    if (currentLine.length === 0) {
      if (word.length <= maxCharsPerLine) {
        currentLine = word;
      } else {
        lines.push(word.substring(0, maxCharsPerLine));
        if (lines.length < maxLines) {
          currentLine = word.substring(maxCharsPerLine);
          while (
            currentLine.length > maxCharsPerLine &&
            lines.length < maxLines
          ) {
            lines.push(currentLine.substring(0, maxCharsPerLine));
            currentLine = currentLine.substring(maxCharsPerLine);
          }
        } else {
          currentLine = "";
        }
      }
    } else if ((currentLine + " " + word).length <= maxCharsPerLine) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      if (lines.length < maxLines) {
        if (word.length <= maxCharsPerLine) {
          currentLine = word;
        } else {
          lines.push(word.substring(0, maxCharsPerLine));
          if (lines.length < maxLines) {
            currentLine = word.substring(maxCharsPerLine);
            while (
              currentLine.length > maxCharsPerLine &&
              lines.length < maxLines
            ) {
              lines.push(currentLine.substring(0, maxCharsPerLine));
              currentLine = currentLine.substring(maxCharsPerLine);
            }
          } else {
            currentLine = "";
          }
        }
      } else {
        currentLine = "";
      }
    }
  }
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }
  while (lines.length < maxLines) {
    lines.push("");
  }
  return lines;
};

export const modifySVG = (baseSVG: string, data: ProductData): string => {
  let modifiedSVG = baseSVG;

  const replacements: { [key: string]: string } = {
    codigo: `COD.${data.codigo || ""}`,
    preco: `R$ ${data.preco || ""}`,
  };

  for (const id in replacements) {
    const regex = new RegExp(
      `(<text[^>]*id="${id}"[^>]*>)(.*?)(<\/text>)`,
      "s"
    );
    modifiedSVG = modifiedSVG.replace(regex, `$1${replacements[id]}$3`);
  }

  const descLines = splitDescription(data.produto || "", 3, 18); // Using fixed values as per original
  const descReplacements: { [key: string]: string } = {
    descricao: descLines[0] || "",
    descricao2: descLines[1] || "",
    descricao3: descLines[2] || "",
  };
  for (const id in descReplacements) {
    const regex = new RegExp(
      `(<text[^>]*id="${id}"[^>]*>)(.*?)(<\/text>)`,
      "s"
    );
    modifiedSVG = modifiedSVG.replace(regex, `$1${descReplacements[id]}$3`);
  }

  return modifiedSVG;
};

export const composeSVGWithBGAndConvertToPNG = (
  svgString: string,
  bgDataUrl: string,
  filename: string,
  SVG_WIDTH: number,
  SVG_HEIGHT: number,
  addLog: (
    message: string,
    type?: "info" | "error" | "success" | "step",
    data?: any
  ) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    addLog(
      `composeSVGWithBGAndConvert: Iniciando composição para ${filename}...`
    );
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      addLog(
        `Erro: Não foi possível obter o contexto 2D do canvas para ${filename}.`,
        "error"
      );
      return reject(
        new Error(
          `Failed to get 2D rendering context for canvas for ${filename}`
        )
      );
    }

    const img = new Image();
    const svgImg = new Image();

    canvas.width = SVG_WIDTH;
    canvas.height = SVG_HEIGHT;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      svgImg.onload = () => {
        ctx.drawImage(svgImg, 0, 0, canvas.width, canvas.height);
        const pngDataUrl = canvas.toDataURL("image/png");
        addLog(`Composição e conversão para PNG de ${filename} concluída.`);
        resolve(pngDataUrl);
      };
      svgImg.onerror = (error) => {
        addLog(
          `Erro ao carregar SVG para composição de ${filename}.`,
          "error",
          error
        );
        reject(new Error(`Failed to load SVG for ${filename}`));
      };
      svgImg.src =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
    };
    img.onerror = (error) => {
      addLog(
        `Erro ao carregar imagem de fundo para composição de ${filename}.`,
        "error",
        error
      );
      reject(new Error(`Failed to load background image for ${filename}`));
    };
    img.src = bgDataUrl;
  });
};
