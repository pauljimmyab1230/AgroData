import { useState, useEffect } from "react";
import api from "../services/api";

/**
 * Descarga un archivo del endpoint autenticado /uploads y devuelve una
 * object URL temporal. Necesario porque <img src> no envía el header
 * Authorization y /uploads exige autenticación.
 */
export function useArchivoUrl(rutaArchivo: string | null | undefined): string | null {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!rutaArchivo) {
      setObjectUrl(null);
      return;
    }

    let url: string | null = null;
    let cancelado = false;

    const cargar = async () => {
      try {
        const res = await api.get(rutaArchivo, { responseType: "blob" });
        if (cancelado) return;
        url = URL.createObjectURL(res.data);
        setObjectUrl(url);
      } catch {
        if (!cancelado) setObjectUrl(null);
      }
    };

    void cargar();

    return () => {
      cancelado = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [rutaArchivo]);

  return objectUrl;
}

/**
 * Descarga un archivo autenticado y lo abre en una pestaña nueva.
 * Sustituye a <a href={ruta}> que no envía Authorization.
 */
export async function abrirArchivo(rutaArchivo: string): Promise<void> {
  const res = await api.get(rutaArchivo, { responseType: "blob" });
  const blobUrl = URL.createObjectURL(res.data);
  window.open(blobUrl, "_blank");
  // Revocar tras un rato para dar tiempo a la descarga.
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
}

/**
 * Descarga un archivo autenticado como archivo local.
 */
export async function descargarArchivo(rutaArchivo: string, nombreArchivo: string): Promise<void> {
  const res = await api.get(rutaArchivo, { responseType: "blob" });
  const blobUrl = URL.createObjectURL(res.data);
  const enlace = document.createElement("a");
  enlace.href = blobUrl;
  enlace.download = nombreArchivo || "archivo";
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
}
