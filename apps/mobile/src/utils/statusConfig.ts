export interface StatusConfig {
  color: string;
  bg: string;
  label: string;
}

export const STATUS_COLORS: Record<string, StatusConfig> = {
  ACTIVO: { color: "#16A34A", bg: "#DCFCE7", label: "Activo" },
  INACTIVO: { color: "#6B7280", bg: "#F3F4F6", label: "Inactivo" },
  SUSPENDIDO: { color: "#D97706", bg: "#FEF3C7", label: "Suspendido" },
  ACTIVA: { color: "#16A34A", bg: "#DCFCE7", label: "Activa" },
  INACTIVA: { color: "#6B7280", bg: "#F3F4F6", label: "Inactiva" },
  COMPLETADA: { color: "#16A34A", bg: "#DCFCE7", label: "Completada" },
  PENDIENTE: { color: "#D97706", bg: "#FEF3C7", label: "Pendiente" },
  CANCELADA: { color: "#DC2626", bg: "#FEE2E2", label: "Cancelada" },
  EN_PROCESO: { color: "#2563EB", bg: "#DBEAFE", label: "En Proceso" },
  PLANIFICADA: { color: "#6366F1", bg: "#EEF2FF", label: "Planificada" },
  EN_CURSO: { color: "#2563EB", bg: "#DBEAFE", label: "En Curso" },
  PROGRAMADA: { color: "#6366F1", bg: "#EEF2FF", label: "Programada" },
  APROBADA: { color: "#16A34A", bg: "#DCFCE7", label: "Aprobada" },
  RECHAZADA: { color: "#DC2626", bg: "#FEE2E2", label: "Rechazada" },
  OBSERVADA: { color: "#D97706", bg: "#FEF3C7", label: "Observada" },
};

export const GENERO_COLORS: Record<string, { icon: string; color: string }> = {
  MASCULINO: { icon: "♂", color: "#2563EB" },
  FEMENINO: { icon: "♀", color: "#DB2777" },
};

export function getStatusConfig(estado: string): StatusConfig {
  return STATUS_COLORS[estado] ?? { color: "#6B7280", bg: "#F3F4F6", label: estado };
}

export function getBadgeVariant(estado: string): "green" | "yellow" | "red" | "gray" | "forest" | "default" {
  const config = STATUS_COLORS[estado];
  if (!config) return "default";
  if (config.color === "#16A34A" || config.color === "#166534") return "green";
  if (config.color === "#D97706") return "yellow";
  if (config.color === "#DC2626") return "red";
  if (config.color === "#2563EB" || config.color === "#6366F1") return "forest";
  return "gray";
}
