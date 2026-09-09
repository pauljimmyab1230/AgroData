import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from "react";
import type { ReactNode } from "react";
import type { Productor, Familiar, Parcela, Sexo, EstadoCivil, NivelEducativo, Idioma, EstadoProductor, CargoProductor } from "../services/productores";
import { SexoEnum, EstadoCivilEnum, NivelEducativoEnum, IdiomaEnum, EstadoProductorEnum, CargoProductorEnum } from "../services/productores";
import { toast } from "../utils/toast";

type ProductorFormData = Partial<Productor>;

type FieldErrors = Partial<Record<keyof Productor, string>>;

// ─── Data Context (re-renders only when data changes) ─────

type ProductorFormDataType = {
  data: ProductorFormData;
  familiares: Familiar[];
  parcelas: Parcela[];
};

const ProductorFormDataContext = createContext<ProductorFormDataType>({
  data: {},
  familiares: [],
  parcelas: [],
});

// ─── Actions Context (never re-renders consumers) ─────────

type ProductorFormActionsType = {
  errors: FieldErrors;
  updateData: (patch: ProductorFormData) => void;
  resetData: (initial: ProductorFormData) => void;
  setFamiliares: (list: Familiar[]) => void;
  setParcelas: (list: Parcela[]) => void;
  validateStep: (step: number) => boolean;
  clearFieldError: (field: keyof Productor) => void;
};

const ProductorFormActionsContext = createContext<ProductorFormActionsType | null>(null);

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
  materialVivienda: "Material de Vivienda",
  accesoAgua: "Acceso a Agua Potable",
  accesoEnergia: "Acceso a Energía Eléctrica",
  accesoInternet: "Acceso a Internet",
  seguroSalud: "Seguro de Salud",
  accesoCredito: "Acceso a Crédito Financiero",
  servicioSanitario: "Servicio Sanitario",
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

export function validateStep1(data: ProductorFormData): FieldErrors {
  const errors: FieldErrors = {};

  for (const field of REQUIRED_STEP1) {
    const value = data[field];
    const isEmpty = value === undefined || value === null || String(value).trim() === "";

    if (isEmpty) {
      errors[field] = mensajeRequerido(LABELS[field]);
      continue;
    }

    if (field === "dni" && !/^\d{8}$/.test(String(value))) {
      errors[field] = "El DNI debe tener exactamente 8 dígitos numéricos";
    }
    if ((field === "nombres" || field === "apellidoPaterno" || field === "apellidoMaterno") && String(value).trim().length < 2) {
      errors[field] = `El campo ${LABELS[field]} debe tener al menos 2 caracteres`;
    }
    if (field === "idiomaPrincipal" && String(value) === "NINGUNO") {
      errors[field] = "El idioma principal no puede ser Ninguno";
    }
  }

  if (data.correo && data.correo.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.correo))) {
    errors.correo = "El correo electrónico no tiene un formato válido";
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
  const [errors, setErrors] = useState<FieldErrors>({});
  const [familiares, setFamiliares] = useState<Familiar[]>([]);
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const initialJsonRef = useRef(JSON.stringify(initial));

  useEffect(() => {
    const newJson = JSON.stringify(initial);
    if (newJson !== initialJsonRef.current && Object.keys(initial).length > 0) {
      setData(initial);
      initialJsonRef.current = newJson;
    }
  }, [initial]);

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
    setFamiliares([]);
    setParcelas([]);
  }, []);

  const validateStep = useCallback((step: number): boolean => {
    if (step === 1) {
      const nextErrors = validateStep1(data);
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }
    if (step === 2) {
      if (familiares.length === 0) {
        toast.info("Se recomienda agregar al menos un familiar");
      }
      setErrors({});
      return true;
    }
    setErrors({});
    return true;
  }, [data, familiares]);

  const clearFieldError = useCallback((field: keyof Productor) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const dataValue = useMemo(() => ({ data, familiares, parcelas }), [data, familiares, parcelas]);
  const actionsValue = useMemo(() => ({
    errors,
    updateData,
    resetData,
    setFamiliares,
    setParcelas,
    validateStep,
    clearFieldError,
  }), [errors, updateData, resetData, setFamiliares, setParcelas, validateStep, clearFieldError]);

  return (
    <ProductorFormDataContext.Provider value={dataValue}>
      <ProductorFormActionsContext.Provider value={actionsValue}>
        {children}
      </ProductorFormActionsContext.Provider>
    </ProductorFormDataContext.Provider>
  );
}

export function useProductorForm() {
  const dataCtx = useContext(ProductorFormDataContext);
  const actionsCtx = useContext(ProductorFormActionsContext);
  if (!actionsCtx) throw new Error("useProductorForm must be used within ProductorFormProvider");
  return { ...dataCtx, ...actionsCtx };
}
