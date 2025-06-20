"use client";

import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/src/components/ui/card";
import { Label } from "@radix-ui/react-label";
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
  const [offsetX, setOffsetX] = useState(100);
  const [offsetY, setOffsetY] = useState(0);

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

      const productX = offsetX;
      const productY = canvas.height * 0.4 + offsetY;

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
    offsetX,
    offsetY,
    onCompositionReady,
    onCompositionNotReady,
  ]);

  useEffect(() => {
    drawComposition();
  }, [drawComposition]);

  const canvasWidth = canvasRef.current?.width || 1000;
  const canvasHeight = canvasRef.current?.height || 1000;

  return (
    <div className="flex flex-col gap-4 mt-5">
      <div className="border rounded-xl bg-muted flex justify-center p-4">
        <canvas ref={canvasRef} className="bg-transparent max-w-full h-auto" />
      </div>

      {productImage && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Configurações do Produto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Zoom */}
            <div className="space-y-2">
              <Label>Zoom do Produto</Label>
              <Slider
                min={0.1}
                max={5}
                step={0.05}
                value={[productZoom]}
                onValueChange={(value) => setProductZoom(value[0])}
              />
              <div className="text-sm text-muted-foreground">
                Zoom atual: <strong>{productZoom.toFixed(2)}x</strong>
              </div>
            </div>

            <Separator />

            {/* Posição Horizontal */}
            <div className="space-y-2">
              <Label>Posição Horizontal (X)</Label>
              <Slider
                min={-canvasWidth}
                max={canvasWidth}
                step={1}
                value={[offsetX]}
                onValueChange={(value) => setOffsetX(value[0])}
              />
              <div className="text-sm text-muted-foreground">
                Deslocamento X: <strong>{offsetX}px</strong>
              </div>
            </div>

            <Separator />

            {/* Posição Vertical */}
            <div className="space-y-2">
              <Label>Posição Vertical (Y)</Label>
              <Slider
                min={-canvasHeight}
                max={canvasHeight}
                step={1}
                value={[offsetY]}
                onValueChange={(value) => setOffsetY(value[0])}
              />
              <div className="text-sm text-muted-foreground">
                Deslocamento Y: <strong>{offsetY}px</strong>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
