export interface ProductData {
  codigo: string;
  produto: string;
  preco: string;
  // Add other properties that might come from your Excel
  [key: string]: string; // This allows for additional, dynamic string properties
}

export interface GeneratedOutput {
  filename: string;
  dataUrl?: string; // For PNGs
  svgString?: string; // For SVGs
  blob?: Blob; // For PDF
}

export interface ColumnMapping {
  codigo: string | null;
  produto: string | null;
  promo: string | null;
}
