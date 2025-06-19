"use client";

import React from "react";

interface GenerationControlsProps {
  processing: boolean;
  progress: number;
  checkInputsReady: () => boolean;
  handleProcessEncartes: () => Promise<void>;
}

const GenerationControls: React.FC<GenerationControlsProps> = ({
  processing,
  progress,
  checkInputsReady,
  handleProcessEncartes,
}) => {
  return (
    <>
      <button
        onClick={handleProcessEncartes}
        className={`block w-full max-w-xl mx-auto py-4 px-8 bg-green-500 text-black border-none rounded-md text-2xl font-bold uppercase transition-colors ${
          !checkInputsReady() || processing
            ? "bg-green-800 cursor-not-allowed"
            : "hover:bg-green-600 cursor-pointer"
        }`}
        disabled={!checkInputsReady() || processing}
      >
        {processing ? `Processando... ${progress}%` : "Gerar Encartes"}
      </button>

      {processing && (
        <div className="w-full h-10 bg-gray-700 border-2 border-green-500 rounded-md my-10 overflow-hidden">
          <div
            className="h-full bg-green-500 text-black font-bold text-center leading-10 transition-all duration-300"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}
    </>
  );
};

export default GenerationControls;
