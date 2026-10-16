/** Fecha de hoy en hora local (YYYY-MM-DD). `toISOString()` daría el día en UTC. */
export function fechaHoyLocal(): string {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

/**
 * Convierte una fecha de calendario local (YYYY-MM-DD) al instante ISO UTC que
 * representa el inicio de ese día en hora local. Evita el corrimiento de día
 * que produce concatenar "T00:00:00.000Z" a una fecha local.
 */
export function fechaLocalAISO(fecha: string): string {
  if (!fecha) return fecha;
  if (fecha.includes("T")) return fecha;
  const [anio, mes, dia] = fecha.split("-").map((p) => Number(p));
  if (!Number.isFinite(anio) || !Number.isFinite(mes) || !Number.isFinite(dia)) return fecha;
  return new Date(anio, mes - 1, dia).toISOString();
}

/** Valida el formato de fecha de calendario YYYY-MM-DD. */
export function esFechaValida(fecha: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(fecha);
}

/**
 * Convierte un instante ISO (o fecha YYYY-MM-DD) a fecha de calendario local
 * (YYYY-MM-DD). Un `split("T")[0]` cortaría la fecha UTC y podría mostrar el
 * día anterior/posterior según el huso horario.
 */
export function isoAFechaLocal(iso: string): string {
  if (!iso) return "";
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return iso.slice(0, 10);
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

/** Devuelve true si `fecha` es igual o posterior a `desde` (ambas YYYY-MM-DD). */
export function fechaNoAnteriorA(fecha: string, desde: string): boolean {
  return fecha >= desde;
}
