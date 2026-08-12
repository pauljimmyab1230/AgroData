import { useState, useRef, useCallback, type ReactNode } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange?: (file: File | null, preview: string) => void;
  accept?: string;
  maxSizeMB?: number;
  readOnly?: boolean;
  placeholder?: ReactNode;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  accept = "image/*",
  maxSizeMB = 5,
  readOnly = false,
  placeholder,
  className = "",
}: ImageUploadProps) {
  const [preview, setPreview] = useState(value || "");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback(
    (file: File): boolean => {
      setError("");
      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten archivos de imagen");
        return false;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`El archivo supera ${maxSizeMB}MB`);
        return false;
      }
      return true;
    },
    [maxSizeMB],
  );

  const handleFile = (file: File) => {
    if (!validate(file)) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onChange?.(file, result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview("");
    setError("");
    onChange?.(null, "");
    if (inputRef.current) inputRef.current.value = "";
  };

  if (preview) {
    return (
      <div className={`relative overflow-hidden rounded-xl border border-gray-200 ${className}`}>
        <button
          type="button"
          disabled={readOnly}
          onClick={() => inputRef.current?.click()}
          aria-label="Cambiar imagen"
          className={`block w-full ${readOnly ? "cursor-default" : "cursor-pointer"}`}
        >
          <img src={preview} alt="Vista previa" className="h-40 w-full object-cover" />
        </button>
        {!readOnly && (
          <>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#0F172A]/70 text-white transition-colors hover:bg-[#0F172A]"
              aria-label="Eliminar imagen"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-[#0F172A]/70 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#0F172A]"
            >
              <Upload className="h-3.5 w-3.5" />
              Cambiar
            </button>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="hidden"
        />
      </div>
    );
  }

  if (readOnly) {
    return (
      <div
        className={`flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-white px-6 py-6 text-center ${className}`}
      >
        {placeholder}
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all ${
          dragOver
            ? "border-forest-600 bg-forest-600/5"
            : "border-gray-300 bg-gray-50/50 hover:border-forest-600/50 hover:bg-forest-600/5"
        }`}
      >
        {placeholder || (
          <>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-forest-600/10 text-forest-600">
              {dragOver ? <Upload className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
            </div>
            <p className="text-sm font-medium text-[#111827]">Arrastra una imagen o haz clic para subir</p>
            <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP (máx. {maxSizeMB}MB)</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="hidden"
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
