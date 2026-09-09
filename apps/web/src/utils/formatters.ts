import type { Productor, EstadoProductor } from "../services/productores";

const mesesCortos = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export function formatFecha(fecha?: string): string {
  if (!fecha) return "—";
  const d = new Date(fecha.includes("T") ? fecha : fecha + "T00:00:00");
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatFechaCorta(fecha?: string): string {
  if (!fecha) return "—";
  const [y, m, d] = fecha.split("-").map(Number);
  return `${d} ${mesesCortos[m - 1]} ${y}`;
}

export function formatKg(peso: number): string {
  return `${Intl.NumberFormat("es-PE", { maximumFractionDigits: 1 }).format(peso)} kg`;
}

export function formatPct(valor: number | undefined): string {
  if (valor === undefined || valor === null) return "—";
  return `${Intl.NumberFormat("es-PE", { maximumFractionDigits: 2 }).format(valor)}%`;
}

export function getEstadoProductorBadgeVariant(estado: EstadoProductor): "green" | "yellow" | "gray" {
  switch (estado) {
    case "ACTIVO":
      return "green";
    case "SUSPENDIDO":
      return "yellow";
    case "INACTIVO":
    default:
      return "gray";
  }
}

export function getEstadoProductorLabel(estado: EstadoProductor): string {
  switch (estado) {
    case "ACTIVO":
      return "Activo";
    case "SUSPENDIDO":
      return "Suspendido";
    case "INACTIVO":
      return "Inactivo";
    default:
      return estado;
  }
}

export function displayField(
  mode: "view" | "edit" | "create",
  field: keyof Productor,
  values?: Partial<Productor>,
  data?: Partial<Productor>
): string {
  const val = mode === "view" ? values?.[field] : data?.[field];
  return typeof val === "string" ? val : "";
}
