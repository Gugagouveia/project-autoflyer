"use client";

import React, { useRef, useEffect } from "react";

interface DiagnosticLogsProps {
  diagnosticMode: boolean;
  setDiagnosticMode: (checked: boolean) => void;
  logs: string[];
}

const DiagnosticLogs: React.FC<DiagnosticLogsProps> = ({
  diagnosticMode,
  setDiagnosticMode,
  logs,
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <>
      <div className="flex items-center justify-center my-5">
        <label className="text-lg cursor-pointer flex items-center">
          <input
            type="checkbox"
            checked={diagnosticMode}
            onChange={(e) => setDiagnosticMode(e.target.checked)}
            className="mr-2 transform scale-150 accent-green-500"
          />
          Modo de Diagnóstico
        </label>
      </div>

      {diagnosticMode && (
        <div className="bg-gray-900 text-green-500 p-4 rounded-lg max-h-[300px] overflow-y-auto font-mono text-left my-5 border border-green-500">
          <h3 className="text-xl font-bold mb-2">Logs do Sistema:</h3>
          {logs.map((log, index) => (
            <p key={index} className="mb-1 text-sm whitespace-pre-wrap">
              {log}
            </p>
          ))}
          <div ref={logContainerRef} />
        </div>
      )}
    </>
  );
};

export default DiagnosticLogs;
