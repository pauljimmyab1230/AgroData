import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Parcela, ParcelaDocumento, ParcelaFoto } from "../services/parcelas";

type ParcelaFormData = Partial<Parcela>;

export type ParcelaFieldErrors = Partial<Record<keyof Parcela, string>>;

type ParcelaFormContextType = {
  data: ParcelaFormData;
  errors: ParcelaFieldErrors;
  documentos: ParcelaDocumento[];
  fotos: ParcelaFoto[];
  updateData: (patch: ParcelaFormData) => void;
  resetData: (initial: ParcelaFormData) => void;
  setDocumentos: (list: ParcelaDocumento[]) => void;
  setFotos: (list: ParcelaFoto[]) => void;
  validate: () => boolean;
  clearFieldError: (field: keyof Parcela) => void;
};

const ParcelaFormContext = createContext<ParcelaFormContextType | null>(null);

const LABELS: Partial<Record<keyof Parcela, string>> = {
  productorId: "Productor",
  nombre: "Nombre de Parcela",
  cultivo: "Cultivo Principal",
  area: "Área Total",
};

const REQUIRED_FIELDS: Array<keyof Parcela> = ["productorId", "nombre", "cultivo", "area"];

const mensajeRequerido = (label: string) => `El campo ${label} es obligatorio`;

export function ParcelaFormProvider({
  initial = {},
  children,
}: {
  initial?: ParcelaFormData;
  children: ReactNode;
}) {
  const [data, setData] = useState<ParcelaFormData>(initial);
  const [errors, setErrors] = useState<ParcelaFieldErrors>({});
  const [documentos, setDocumentos] = useState<ParcelaDocumento[]>(initial.documentos ?? []);
  const [fotos, setFotos] = useState<ParcelaFoto[]>(initial.fotos ?? []);

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

  const resetData = useCallback((initialData: ParcelaFormData) => {
    setData(initialData);
    setErrors({});
    setDocumentos(initialData.documentos ?? []);
    setFotos(initialData.fotos ?? []);
  }, []);

  const validate = useCallback((): boolean => {
    const nextErrors: ParcelaFieldErrors = {};

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

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [data]);

  const clearFieldError = useCallback((field: keyof Parcela) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  return (
    <ParcelaFormContext.Provider
      value={{
        data,
        errors,
        documentos,
        fotos,
        updateData,
        resetData,
        setDocumentos,
        setFotos,
        validate,
        clearFieldError,
      }}
    >
      {children}
    </ParcelaFormContext.Provider>
  );
}

export function useParcelaForm() {
  const ctx = useContext(ParcelaFormContext);
  if (!ctx) throw new Error("useParcelaForm must be used within ParcelaFormProvider");
  return ctx;
}
