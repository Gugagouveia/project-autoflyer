"use client";

import { Label } from "@radix-ui/react-label";
import React from "react";

interface FileInputProps {
  id: string;
  accept?: string;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

export function FileInput({
  id,
  accept,
  file,
  onChange,
  label,
}: FileInputProps) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </Label>
      <label
        htmlFor={id}
        className="inline-flex items-center justify-center cursor-pointer rounded-lg border-2 border-dashed border-gray-300 px-5 py-3 text-sm font-medium text-gray-600 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-800 transition"
      >
        {file ? "Trocar arquivo" : "Escolher arquivo"}
      </label>
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={onChange}
        className="sr-only"
      />
      {file && (
        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
          Selecionado: <span className="font-semibold">{file.name}</span>
        </p>
      )}
    </div>
  );
}
