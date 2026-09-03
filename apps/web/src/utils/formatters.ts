export function formatFecha(fecha?: string): string {
  if (!fecha) return "—";
  const d = new Date(fecha.includes("T") ? fecha : fecha + "T00:00:00");
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatKg(peso: number): string {
  return `${Intl.NumberFormat("es-PE", { maximumFractionDigits: 1 }).format(peso)} kg`;
}

export function formatPct(valor: number | undefined): string {
  if (valor === undefined || valor === null) return "—";
  return `${Intl.NumberFormat("es-PE", { maximumFractionDigits: 2 }).format(valor)}%`;
}
