import { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { polygon as turfPolygon } from "@turf/helpers";
import turfArea from "@turf/area";
import type { Parcela } from "../services/parcelas";

type ParcelaFormData = Partial<Parcela>;

type FieldErrors = Partial<Record<keyof Parcela, string>>;

type ParcelaFormContextType = {
  data: ParcelaFormData;
  errors: FieldErrors;
  updateData: (patch: ParcelaFormData) => void;
  validate: () => { valid: boolean; errors: FieldErrors };
  clearFieldError: (field: keyof Parcela) => void;
};

const ParcelaFormContext = createContext<ParcelaFormContextType | null>(null);

const LABELS: Partial<Record<keyof Parcela, string>> = {
  productorId: "Productor",
  nombre: "Nombre de Parcela",
  cultivo: "Cultivo Principal",
  area: "Área Total",
  departamento: "Departamento",
  provincia: "Provincia",
  distrito: "Distrito",
};

const REQUIRED_FIELDS: Array<keyof Parcela> = ["productorId", "nombre", "cultivo", "area"];

const mensajeRequerido = (label: string) => `El campo ${label} es obligatorio`;

function isValidCoordArray(coords: unknown): coords is [number, number][] {
  return (
    Array.isArray(coords) &&
    coords.length >= 3 &&
    coords.every(
      (c): c is [number, number] =>
        Array.isArray(c) &&
        c.length === 2 &&
        typeof c[0] === "number" &&
        typeof c[1] === "number" &&
        Number.isFinite(c[0]) &&
        Number.isFinite(c[1])
    )
  );
}

function validatePolygon(coords: [number, number][]): string | null {
  if (coords.length < 3) {
    return "El polígono debe tener al menos 3 vértices";
  }

  for (let i = 0; i < coords.length; i++) {
    const [lat, lng] = coords[i];
    if (lat < -90 || lat > 90) {
      return `Latitud ${lat} fuera de rango [-90, 90] en vértice ${i + 1}`;
    }
    if (lng < -180 || lng > 180) {
      return `Longitud ${lng} fuera de rango [-180, 180] en vértice ${i + 1}`;
    }
  }

  const seen = new Set<string>();
  for (const [lat, lng] of coords) {
    const key = `${lat.toFixed(8)},${lng.toFixed(8)}`;
    if (seen.has(key)) {
      return "El polígono tiene vértices duplicados";
    }
    seen.add(key);
  }

  const closed =
    coords[0][0] === coords[coords.length - 1][0] &&
    coords[0][1] === coords[coords.length - 1][1];
  const ring = closed ? coords : [...coords, coords[0]];

  try {
    const geom = turfPolygon([ring]);
    const area = turfArea(geom);
    if (area <= 0) {
      return "El polígono tiene área cero";
    }
  } catch {
    return "Geometría del polígono inválida";
  }

  return null;
}

export function ParcelaFormProvider({
  initial = {},
  children,
}: {
  initial?: ParcelaFormData;
  children: ReactNode;
}) {
  const [data, setData] = useState<ParcelaFormData>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});

  const updateData = useCallback((patch: ParcelaFormData) => {
    setData((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const keys = Object.keys(patch) as Array<keyof Parcela>;
      const hasAny = keys.some((k) => k in prev);
      if (!hasAny) return prev;
      const next = { ...prev };
      for (const key of keys) delete next[key];
      return next;
    });
  }, []);

  const validate = useCallback((): { valid: boolean; errors: FieldErrors } => {
    const nextErrors: FieldErrors = {};

    for (const field of REQUIRED_FIELDS) {
      const value = data[field];
      const isEmpty = value === undefined || value === null || String(value).trim() === "";
      if (isEmpty) {
        nextErrors[field] = mensajeRequerido(LABELS[field] ?? field);
      }
    }

    const area = Number(data.area);
    if (data.area !== undefined && !Number.isNaN(area) && area <= 0) {
      nextErrors.area = "El área total debe ser mayor a 0";
    }

    if (data.latitud) {
      const lat = Number(data.latitud);
      if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
        nextErrors.latitud = "Latitud fuera de rango [-90, 90]";
      }
    }
    if (data.longitud) {
      const lng = Number(data.longitud);
      if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
        nextErrors.longitud = "Longitud fuera de rango [-180, 180]";
      }
    }

    if (data.poligono && isValidCoordArray(data.poligono)) {
      const polyError = validatePolygon(data.poligono);
      if (polyError) {
        nextErrors.poligono = polyError;
      }
    }

    setErrors(nextErrors);
    return { valid: Object.keys(nextErrors).length === 0, errors: nextErrors };
  }, [data]);

  const clearFieldError = useCallback((field: keyof Parcela) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const contextValue = useMemo(() => ({
    data,
    errors,
    updateData,
    validate,
    clearFieldError,
  }), [data, errors, updateData, validate, clearFieldError]);

  return (
    <ParcelaFormContext.Provider value={contextValue}>
      {children}
    </ParcelaFormContext.Provider>
  );
}

export function useParcelaForm() {
  const ctx = useContext(ParcelaFormContext);
  if (!ctx) throw new Error("useParcelaForm must be used within ParcelaFormProvider");
  return ctx;
}

export function useOptionalParcelaForm() {
  return useContext(ParcelaFormContext);
}
