import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Productor, Familiar, Parcela } from "../services/productores";

type ProductorFormData = Partial<Productor>;

export type ProductorFieldErrors = Partial<Record<keyof Productor, string>>;

type ProductorFormContextType = {
  data: ProductorFormData;
  errors: ProductorFieldErrors;
  familiares: Familiar[];
  parcelas: Parcela[];
  updateData: (patch: ProductorFormData) => void;
  resetData: (initial: ProductorFormData) => void;
  setFamiliares: (list: Familiar[]) => void;
  setParcelas: (list: Parcela[]) => void;
  validateStep: (step: number) => boolean;
  clearFieldError: (field: keyof Productor) => void;
};

const ProductorFormContext = createContext<ProductorFormContextType | null>(null);

const REQUIRED_STEP1: Array<keyof Productor> = [
  "dni",
  "nombres",
  "apellidoPaterno",
  "apellidoMaterno",
  "sexo",
  "fechaNacimiento",
  "estadoCivil",
  "departamento",
  "provincia",
  "distrito",
  "comunidad",
  "nivelEducativo",
  "idiomaPrincipal",
  "fechaIngreso",
  "organizacion",
  "cargo",
];

const LABELS: Record<keyof Productor, string> = {
  dni: "DNI",
  nombres: "Nombres",
  apellidoPaterno: "Apellido Paterno",
  apellidoMaterno: "Apellido Materno",
  sexo: "Sexo",
  fechaNacimiento: "Fecha de Nacimiento",
  estadoCivil: "Estado Civil",
  departamento: "Departamento",
  provincia: "Provincia",
  distrito: "Distrito",
  comunidad: "Comunidad",
  nivelEducativo: "Nivel Educativo",
  idiomaPrincipal: "Idioma Principal",
  idiomaSecundario: "Idioma Secundario",
  fechaIngreso: "Fecha de Ingreso",
  organizacion: "Organización",
  cargo: "Cargo",
  id: "ID",
  codigo: "Código",
  telefono: "Teléfono",
  correo: "Correo Electrónico",
  direccion: "Dirección",
  estado: "Estado",
  fotoUrl: "Foto",
  firmaUrl: "Firma",
  createdAt: "Creado",
  updatedAt: "Actualizado",
  _count: "",
};

const mensajeRequerido = (label: string) => `El campo ${label} es obligatorio`;

export function validateStep1(data: ProductorFormData): ProductorFieldErrors {
  const errors: ProductorFieldErrors = {};

  for (const field of REQUIRED_STEP1) {
    const value = data[field];
    const isEmpty = value === undefined || value === null || String(value).trim() === "";

    if (isEmpty) {
      errors[field] = mensajeRequerido(LABELS[field]);
      continue;
    }

    if (field === "dni" && String(value).length !== 8) {
      errors[field] = "El DNI debe tener 8 dígitos";
    }
    if ((field === "nombres" || field === "apellidoPaterno" || field === "apellidoMaterno") && String(value).trim().length < 2) {
      errors[field] = `El campo ${LABELS[field]} debe tener al menos 2 caracteres`;
    }
    if (field === "idiomaPrincipal" && String(value) === "NINGUNO") {
      errors[field] = "El idioma principal no puede ser Ninguno";
    }
  }

  return errors;
}

export function ProductorFormProvider({
  initial = {},
  children,
}: {
  initial?: ProductorFormData;
  children: ReactNode;
}) {
  const [data, setData] = useState<ProductorFormData>(initial);
  const [errors, setErrors] = useState<ProductorFieldErrors>({});
  const [familiares, setFamiliares] = useState<Familiar[]>([]);
  const [parcelas, setParcelas] = useState<Parcela[]>([]);

  const updateData = useCallback((patch: ProductorFormData) => {
    setData((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const keys = Object.keys(patch) as Array<keyof Productor>;
      const hasAny = keys.some((k) => k in prev);
      if (!hasAny) return prev;
      const next = { ...prev };
      for (const key of keys) delete next[key];
      return next;
    });
  }, []);

  const resetData = useCallback((initial: ProductorFormData) => {
    setData(initial);
    setErrors({});
  }, []);

  const validateStep = useCallback((step: number): boolean => {
    if (step === 1) {
      const nextErrors = validateStep1(data);
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }
    setErrors({});
    return true;
  }, [data]);

  const clearFieldError = useCallback((field: keyof Productor) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  return (
    <ProductorFormContext.Provider
      value={{ data, errors, familiares, parcelas, updateData, resetData, setFamiliares, setParcelas, validateStep, clearFieldError }}
    >
      {children}
    </ProductorFormContext.Provider>
  );
}

export function useProductorForm() {
  const ctx = useContext(ProductorFormContext);
  if (!ctx) throw new Error("useProductorForm must be used within ProductorFormProvider");
  return ctx;
}
