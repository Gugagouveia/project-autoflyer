"use client";

import { useImageLoader } from "@/src/hooks/useImageLoader";
import React, { useState, useCallback } from "react";
import { CanvasComposer } from "./components/canvas-composer";
import { DownloadLink } from "./components/download-link";
import { ImageUploader } from "./components/image-uploader";

export default function ProductOverlayPage() {
  const [escarteImage, setEscarteImage] = useState<HTMLImageElement | null>(
    null
  );
  const [productImage, setProductImage] = useState<HTMLImageElement | null>(
    null
  );
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [isCompositionReady, setIsCompositionReady] = useState<boolean>(false);

  const { loadImageFile } = useImageLoader();

  const handleEscarteFileChange = (file: File | undefined) => {
    if (file) {
      loadImageFile(file, setEscarteImage);
    } else {
      setEscarteImage(null);
    }
  };

  const handleProductFileChange = (file: File | undefined) => {
    if (file) {
      loadImageFile(file, setProductImage);
    } else {
      setProductImage(null);
    }
  };

  const handleCompositionReady = useCallback((url: string) => {
    setDownloadUrl(url);
    setIsCompositionReady(true);
  }, []);

  const handleCompositionNotReady = useCallback(() => {
    setDownloadUrl("");
    setIsCompositionReady(false);
  }, []);

  return (
    <div className="flex flex-col items-center p-5 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Adicionar Produto ao Encarte
        </h1>

        <ImageUploader
          label="1. Carregue a imagem do seu encarte (PNG):"
          accept="image/png"
          onFileChange={handleEscarteFileChange}
        />

        <ImageUploader
          label="2. Carregue a imagem do produto (PNG/JPG):"
          accept="image/png, image/jpeg"
          onFileChange={handleProductFileChange}
        />

        <CanvasComposer
          escarteImage={escarteImage}
          productImage={productImage}
          onCompositionReady={handleCompositionReady}
          onCompositionNotReady={handleCompositionNotReady}
        />

        {isCompositionReady && (escarteImage || productImage) && (
          <DownloadLink url={downloadUrl} filename="escarte_com_produto.png">
            Baixar Imagem Final
          </DownloadLink>
        )}
      </div>
    </div>
  );
}
