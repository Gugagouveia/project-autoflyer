import { useState, useCallback } from "react";

type ImageSetter = React.Dispatch<
  React.SetStateAction<HTMLImageElement | null>
>;

export const useImageLoader = () => {
  const loadImageFile = useCallback((file: File, setter: ImageSetter) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => setter(img);
      if (typeof event.target?.result === "string") {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  }, []);

  return { loadImageFile };
};
