export interface ProductData {
  codigo: string;
  produto: string;
  preco: string;
  imagemUrl?: string;
  [key: string]: string | undefined;
}

export interface GeneratedOutput {
  filename: string;
  dataUrl?: string;
  svgString?: string;
  blob?: Blob;
}

export interface ColumnMapping {
  codigo: string | null;
  produto: string | null;
  preço: string | null;
  imagem?: string | null;
}
