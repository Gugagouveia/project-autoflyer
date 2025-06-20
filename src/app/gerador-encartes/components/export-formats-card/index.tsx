"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Checkbox, CheckboxIndicator } from "@radix-ui/react-checkbox";
import { Label } from "@radix-ui/react-label";
import { Check } from "lucide-react";

interface ExportFormatsCardProps {
  exportFormats: { png: boolean; svg: boolean; pdf: boolean };
  toggleExportFormat: (format: "png" | "svg" | "pdf") => void;
}

export function ExportFormatsCard({
  exportFormats,
  toggleExportFormat,
}: ExportFormatsCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>4. Formatos de Exportação</CardTitle>
        <CardDescription>Selecione um ou mais formatos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {(["png", "svg", "pdf"] as const).map((format) => (
          <div key={format} className="flex items-center space-x-3">
            <Checkbox
              id={`export-${format}`}
              checked={exportFormats[format]}
              onCheckedChange={() => toggleExportFormat(format)}
              className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 dark:border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            >
              <CheckboxIndicator>
                <Check className="h-4 w-4 text-white" />
              </CheckboxIndicator>
            </Checkbox>
            <Label
              htmlFor={`export-${format}`}
              className="cursor-pointer select-none text-gray-700 dark:text-gray-300 capitalize"
            >
              {format.toUpperCase()}{" "}
              {format === "svg"
                ? "(Grade)"
                : format === "pdf"
                ? "(Páginas)"
                : "(Individual)"}
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
