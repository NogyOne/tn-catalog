import React, { useState, useEffect, useRef } from "react";

interface ImageProps {
  currentImgs?: string[];
}

export default function ImageUploader({ currentImgs = [] }: ImageProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(currentImgs);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviews(currentImgs);
  }, [currentImgs]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      previews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });

      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      setFiles(selectedFiles);
      setPreviews(newPreviews);

      window.dispatchEvent(
        new CustomEvent("imagesSelected", { detail: { files: selectedFiles } })
      );
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...previews];

    URL.revokeObjectURL(previews[index]);

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);

    if (inputRef.current) {
      //Need the files that  are still selected in the input
      const inputFiles = Array.from(inputRef.current.files || []);
      inputFiles.splice(index, 1);
      const dataTransfer = new DataTransfer();
      inputFiles.forEach((file) => dataTransfer.items.add(file));
      inputRef.current.files = dataTransfer.files;
    }

    // Actualizar los datos emitidos
    window.dispatchEvent(
      new CustomEvent("imagesSelected", { detail: { files: updatedFiles } })
    );
  };

  return (
    <div className="mb-4  [&>label]:block [&>label]:text-gray-700 [&>input]:border-gray-300 [&>input]:border [&>input]:rounded [&>input]:p-2 [&>input]:w-full [&>textarea]:border [&>textarea]:rounded [&>textarea]:p-2 [&>textarea]:w-full [&>textarea]:border-gray-300">
      <label htmlFor="images">Imagenes:</label>
      <input
        type="file"
        ref={inputRef}
        id="images"
        name="images"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleImageChange}
        multiple
      />
      <div className="p-2 bg-gray-200 rounded mt-2 h-full min-h-24">
        <div
          className={` rounded bg-gray-200 h-full min-h-24 m-auto w-full  border-gray-300 ${
            previews.length > 0
              ? "grid grid-cols-3 gap-2"
              : "border-2 border-dashed"
          }`}
        >
          {previews.length > 0 ? (
            previews.map((src, i) => (
              <div className="relative" key={i}>
                <button
                  className="px-2 py-1 bg-gray-50 hover:bg-gray-400 cursor-pointer rounded-2xl text-xs mt-1 ml-1 absolute"
                  onClick={() => handleRemoveImage(i)}
                >
                  X
                </button>
                <img
                  src={src}
                  alt={`preview-${i}`}
                  className="w-full h-auto object-contain rounded "
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center m-auto h-full w-full">
              No hay imagenes
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
