export const SEXO_OPTIONS = ["MASCULINO", "FEMENINO"];
export const ESTADO_CIVIL_OPTIONS = ["SOLTERO", "CASADO", "CONVIVIENTE", "VIUDO"];
export const NIVEL_EDUCATIVO_OPTIONS = ["SIN_ESTUDIOS", "PRIMARIA", "SECUNDARIA", "TECNICO", "UNIVERSITARIO"];
export const IDIOMA_OPTIONS = ["QUECHUA", "ESPANOL", "OTRO"];
export const ESTADO_PRODUCTOR_OPTIONS = ["ACTIVO", "INACTIVO", "SUSPENDIDO"];
export const CARGO_OPTIONS = ["SOCIO", "DIRECTIVO", "PRESIDENTE", "VICEPRESIDENTE", "SECRETARIO", "TESORERO", "VOCAL", "OTRO"];
export const PARENTESCO_OPTIONS = ["CONYUGE", "HIJO", "PADRE", "MADRE", "HERMANO", "OTRO"];
export const ESTADO_CAMPANIA_OPTIONS = ["PLANIFICADA", "ACTIVA", "FINALIZADA", "CANCELADA"];
export const ESTADO_CULTIVO_OPTIONS = ["PENDIENTE", "SIEMBRA", "EN_CRECIMIENTO", "COSECHADO"];
export const ESTADO_PARCELA_OPTIONS = ["ACTIVA", "INACTIVA", "EN_PROCESO"];
export const ACREDITACION_OPTIONS = ["TITULO_PROPIEDAD", "CERTIFICADO_POSECION", "CONTRATO_ALQUILER", "CONSTANCIA_OCUPACION", "SIN_DOCUMENTO"];

export const ESTADO_COLORS: Record<string, string> = {
  ACTIVO: "green", ACTIVA: "green", EN_CRECIMIENTO: "green",
  INACTIVO: "gray", INACTIVA: "gray", FINALIZADA: "gray", COSECHADO: "gray",
  SUSPENDIDO: "yellow",   PROGRAMADA: "yellow", PLANIFICADA: "yellow", PENDIENTE: "yellow", EN_PROCESO: "yellow",
  CANCELADA: "red",
};

export const ESTADO_LABELS: Record<string, string> = {
  ACTIVO: "Activo", INACTIVO: "Inactivo", SUSPENDIDO: "Suspendido",
  ACTIVA: "Activa", INACTIVA: "Inactiva",
  PROGRAMADA: "Programada", FINALIZADA: "Finalizada", CANCELADA: "Cancelada",
  PENDIENTE: "Pendiente", EN_PROCESO: "En proceso", EN_CRECIMIENTO: "En crecimiento", COSECHADO: "Cosechado",
};

export const PARENTESCO_LABELS: Record<string, string> = {
  CONYUGE: "Cónyuge", HIJO: "Hijo/a", PADRE: "Padre", MADRE: "Madre", HERMANO: "Hermano/a", OTRO: "Otro",
};
