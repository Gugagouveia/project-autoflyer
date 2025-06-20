import { cn } from "@/src/lib/utils";
import React, { useRef, useState } from "react";

interface ImageUploaderProps {
  label: string;
  accept: string;
  onFileChange: (file: File | undefined) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  accept,
  onFileChange,
  inputRef,
}) => {
  const defaultInputRef = useRef<HTMLInputElement>(null);
  const currentInputRef = inputRef || defaultInputRef;
  const [fileName, setFileName] = useState<string>(
    "Nenhum arquivo selecionado"
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : "Nenhum arquivo selecionado");
    onFileChange(file);
  };

  return (
    <div className="mb-6">
      <p className="text-gray-700 mb-2">{label}</p>
      <div className="flex items-center gap-4">
        <label
          className={cn(
            "cursor-pointer rounded-md px-4 py-2 text-sm font-semibold shadow-sm",
            "bg-green-400 text-white hover:bg-green-600"
          )}
        >
          Selecionar arquivo
          <input
            type="file"
            ref={currentInputRef}
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </label>
        <span className="text-sm text-gray-600 truncate max-w-[200px]">
          {fileName}
        </span>
      </div>
    </div>
  );
};
