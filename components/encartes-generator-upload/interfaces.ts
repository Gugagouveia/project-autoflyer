// lib/GeradorEncartes/types.ts
export interface ProductData {
  codigo: string;
  produto: string;
  preco: string;
  imagemUrl?: string; // NOVO: URL ou identificador da imagem do produto
  // Alterar o index signature para permitir 'string | undefined'
  [key: string]: string | undefined; // <--- CORREÇÃO AQUI
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
  imagem?: string | null; // NOVO: Mapeamento da coluna de imagem
}
