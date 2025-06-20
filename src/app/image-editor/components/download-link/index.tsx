import React from "react";

interface DownloadLinkProps {
  url: string;
  filename: string;
  children: React.ReactNode;
}

export const DownloadLink: React.FC<DownloadLinkProps> = ({
  url,
  filename,
  children,
}) => {
  return (
    <a
      href={url}
      download={filename}
      className="mt-5 inline-block px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg
                 hover:bg-emerald-700 transition-colors duration-300"
    >
      {children}
    </a>
  );
};
