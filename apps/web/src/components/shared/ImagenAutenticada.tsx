import { useArchivoUrl } from "../../hooks/useArchivoUrl";

interface ImagenAutenticadaProps {
  rutaArchivo: string | null | undefined;
  alt: string;
  className?: string;
  onError?: () => void;
}

/**
 * Muestra una imagen del endpoint autenticado /uploads.
 * Resuelve la object URL vía blob para poder enviar el header Authorization.
 */
export default function ImagenAutenticada({ rutaArchivo, alt, className, onError }: ImagenAutenticadaProps) {
  const objectUrl = useArchivoUrl(rutaArchivo);

  if (!rutaArchivo) return null;
  if (!objectUrl) {
    return <div className={`${className ?? ""} animate-pulse bg-gray-100`} aria-label={alt} />;
  }

  return (
    <img
      src={objectUrl}
      alt={alt}
      className={className}
      loading="lazy"
      onError={onError}
    />
  );
}
