import React, { useRef, useEffect, useCallback, useState } from "react";

interface CanvasComposerProps {
  escarteImage: HTMLImageElement | null;
  productImage: HTMLImageElement | null;
  onCompositionReady: (url: string) => void;
  onCompositionNotReady: () => void;
}

export const CanvasComposer: React.FC<CanvasComposerProps> = ({
  escarteImage,
  productImage,
  onCompositionReady,
  onCompositionNotReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [productZoom, setProductZoom] = useState(1);

  const drawComposition = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!escarteImage) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onCompositionNotReady();
      return;
    }

    canvas.width = escarteImage.naturalWidth;
    canvas.height = escarteImage.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(escarteImage, 0, 0, canvas.width, canvas.height);

    if (productImage) {
      const productMarginX = 100;
      const productMarginY = canvas.height * 0.4;

      const baseProductWidth = productImage.naturalWidth;
      const baseProductHeight = productImage.naturalHeight;

      const maxProductWidthPercentage = 0.3;
      const maxProductWidth = canvas.width * maxProductWidthPercentage;

      let scaleFactor = 1;
      if (baseProductWidth > maxProductWidth) {
        scaleFactor = maxProductWidth / baseProductWidth;
      }

      const finalProductWidth = baseProductWidth * scaleFactor * productZoom;
      const finalProductHeight = baseProductHeight * scaleFactor * productZoom;

      const productX = productMarginX;
      const productY = productMarginY;

      ctx.drawImage(
        productImage,
        productX,
        productY,
        finalProductWidth,
        finalProductHeight
      );
    }
    onCompositionReady(canvas.toDataURL("image/png"));
  }, [
    escarteImage,
    productImage,
    productZoom,
    onCompositionReady,
    onCompositionNotReady,
  ]);

  useEffect(() => {
    drawComposition();
  }, [drawComposition]);

  const handleZoomChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProductZoom(parseFloat(event.target.value));
    },
    []
  );

  return (
    <div className="border border-gray-300 bg-gray-200 mt-5 inline-block max-w-full overflow-auto">
      <canvas
        ref={canvasRef}
        className="block bg-transparent max-w-full h-auto"
      ></canvas>

      {productImage && (
        <div className="mt-3 p-3 bg-white rounded shadow">
          <label
            htmlFor="productZoom"
            className="block text-sm font-medium text-gray-700"
          >
            Ajustar Zoom do Produto:
          </label>
          <input
            type="range"
            id="productZoom"
            name="productZoom"
            min="0.1"
            max="5"
            step="0.05"
            value={productZoom}
            onChange={handleZoomChange}
            className="mt-1 block w-full appearance-none bg-gray-300 h-2 rounded-lg cursor-pointer accent-blue-500"
          />
          <span className="text-sm text-gray-500">
            Zoom atual: <strong>{productZoom.toFixed(2)}x</strong>
          </span>
        </div>
      )}
    </div>
  );
};
