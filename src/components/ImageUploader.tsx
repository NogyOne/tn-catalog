import React, { useState, useEffect, useRef } from "react";

interface ImageData {
  id: string;
  url: string;
  path: string;
}

interface ImageProps {
  currentImgs?: string[];
  currentImgsData?: ImageData[]; // Datos completos de las imágenes existentes
  isEdit?: boolean; // Indica si estamos en modo edición
  productSlug?: string; // Slug del producto para las llamadas a la API
}

export default function ImageUploader({
  currentImgs = [],
  currentImgsData = [],
  isEdit = false,
  productSlug,
}: ImageProps) {
  const [files, setFiles] = useState<File[]>([]); //New Files selected to upload
  const [previews, setPreviews] = useState<string[]>(currentImgs); // Previews of images to show in the UI (urls)
  const [existingImages, setExistingImages] =
    useState<ImageData[]>(currentImgsData);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviews(currentImgs);
    setExistingImages(currentImgsData);
  }, [currentImgs, currentImgsData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      // Limpiar URLs blob anteriores (solo las nuevas)
      previews.forEach((url, index) => {
        if (url.startsWith("blob:") && index >= existingImages.length) {
          URL.revokeObjectURL(url);
        }
      });

      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      // Mantener las imágenes existentes y agregar las nuevas
      const allPreviews = [
        ...existingImages.map((img) => img.url),
        ...newPreviews,
      ];

      setFiles(selectedFiles);
      setPreviews(allPreviews);

      window.dispatchEvent(
        new CustomEvent("imagesSelected", {
          detail: {
            files: selectedFiles,
            deletedImageIds: deletedImageIds,
          },
        })
      );
    }
  };

  const handleRemoveImage = async (index: number) => {
    const isExistingImage = index < existingImages.length;

    if (isExistingImage && isEdit) {
      // Es una imagen existente en la BD
      const imageToDelete = existingImages[index];

      try {
        // Hacer la llamada al endpoint para eliminar la imagen
        const response = await fetch(
          `/api/products/images/${imageToDelete.id}?path=${encodeURIComponent(
            imageToDelete.path
          )}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          // Eliminar la imagen de los arrays locales
          const updatedExistingImages = [...existingImages];
          updatedExistingImages.splice(index, 1);
          setExistingImages(updatedExistingImages);

          const updatedPreviews = [...previews];
          updatedPreviews.splice(index, 1);
          setPreviews(updatedPreviews);

          // Agregar a la lista de imágenes eliminadas para tracking
          setDeletedImageIds((prev) => [...prev, imageToDelete.id]);

          // Mostrar toast de éxito
          window.dispatchEvent(
            new CustomEvent("toast", {
              detail: {
                type: "success",
                message: "Imagen eliminada exitosamente",
              },
            })
          );
        } else {
          throw new Error("Error al eliminar la imagen");
        }
      } catch (error) {
        console.error("Error eliminando imagen:", error);
        window.dispatchEvent(
          new CustomEvent("toast", {
            detail: {
              type: "error",
              message: "Error al eliminar la imagen. Inténtalo de nuevo.",
            },
          })
        );
      }
    } else {
      // Es una imagen nueva (archivo local)
      const newImageIndex = index - existingImages.length;
      const updatedFiles = [...files];
      const updatedPreviews = [...previews];

      // Revocar la URL blob si es necesario
      if (previews[index].startsWith("blob:")) {
        URL.revokeObjectURL(previews[index]);
      }

      updatedFiles.splice(newImageIndex, 1);
      updatedPreviews.splice(index, 1);

      setFiles(updatedFiles);
      setPreviews(updatedPreviews);

      // Actualizar el input file
      if (inputRef.current) {
        const inputFiles = Array.from(inputRef.current.files || []);
        inputFiles.splice(newImageIndex, 1);
        const dataTransfer = new DataTransfer();
        inputFiles.forEach((file) => dataTransfer.items.add(file));
        inputRef.current.files = dataTransfer.files;
      }

      // Actualizar los datos emitidos
      window.dispatchEvent(
        new CustomEvent("imagesSelected", {
          detail: {
            files: updatedFiles,
            deletedImageIds: deletedImageIds,
          },
        })
      );
    }
  };

  return (
    <div className="mb-4  [&>label]:block [&>label]:text-gray-700 [&>input]:border-gray-300 [&>input]:border [&>input]:rounded [&>input]:p-2 [&>input]:w-full [&>textarea]:border [&>textarea]:rounded [&>textarea]:p-2 [&>textarea]:w-full [&>textarea]:border-gray-300">
      <label htmlFor="images">Imágenes:</label>
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
                  type="button"
                  className="px-2 py-1 bg-gray-50 hover:bg-gray-400 cursor-pointer rounded-2xl text-xs mt-1 ml-1 absolute z-10"
                  onClick={() => handleRemoveImage(i)}
                >
                  X
                </button>
                <img
                  src={src}
                  alt={`preview-${i}`}
                  className="w-full h-auto object-contain rounded "
                />
                {/* Indicador visual para imágenes existentes vs nuevas */}
                {i < existingImages.length && (
                  <div className="absolute bottom-1 right-1 bg-blue-500 text-white text-xs px-1 rounded">
                    BD
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center m-auto h-full w-full">
              No hay imágenes
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
