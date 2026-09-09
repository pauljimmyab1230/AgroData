import type { TipoProceso, LineaProcesamiento, CalidadProducto } from '@prisma/client';

// ─── Branded Types ─────────────────────────────────────────
export type ProcesamientoId = number & { readonly __brand: unique symbol };

// ─── Internal State Machine ─────────────────────────────────
type ProcesamientoEstado = 'REGISTRADA' | 'EN_PROCESO' | 'FINALIZADO' | 'PAUSADA' | 'CANCELADA';

const TRANSICIONES_VALIDAS: readonly { desde: ProcesamientoEstado; hacia: ProcesamientoEstado }[] = [
  { desde: 'REGISTRADA', hacia: 'EN_PROCESO' },
  { desde: 'REGISTRADA', hacia: 'CANCELADA' },
  { desde: 'EN_PROCESO', hacia: 'FINALIZADO' },
  { desde: 'EN_PROCESO', hacia: 'PAUSADA' },
  { desde: 'EN_PROCESO', hacia: 'CANCELADA' },
  { desde: 'PAUSADA', hacia: 'EN_PROCESO' },
  { desde: 'PAUSADA', hacia: 'CANCELADA' },
];

export function esTransicionValida(desde: ProcesamientoEstado, hacia: ProcesamientoEstado): boolean {
  return TRANSICIONES_VALIDAS.some(t => t.desde === desde && t.hacia === hacia);
}

// ─── Input Types ───────────────────────────────────────────
export interface CreateProcesamientoInput {
  fecha_inicio: string;
  fecha_fin?: string | null;
  producto: string;
  responsable: string;
  planta: string;
  linea_procesamiento: LineaProcesamiento;
  tipo_proceso: TipoProceso;
  estado?: ProcesamientoEstado;
  observaciones?: string | null;
  peso_entrada?: number | null;
  peso_salida?: number | null;
  merma?: number | null;
  rendimiento?: number | null;
  producto_base?: string | null;
  calidad_producto?: CalidadProducto | null;
  peso_final?: number | null;
  humedad_final?: number | null;
  recepcion_id?: number | null;
}

export interface UpdateProcesamientoInput {
  fecha_inicio?: string;
  fecha_fin?: string | null;
  producto?: string;
  responsable?: string;
  planta?: string;
  linea_procesamiento?: LineaProcesamiento;
  tipo_proceso?: TipoProceso;
  estado?: ProcesamientoEstado;
  observaciones?: string | null;
  peso_entrada?: number | null;
  peso_salida?: number | null;
  merma?: number | null;
  rendimiento?: number | null;
  producto_base?: string | null;
  calidad_producto?: CalidadProducto | null;
  peso_final?: number | null;
  humedad_final?: number | null;
  recepcion_id?: number | null;
}

export interface ProcesamientoFilters {
  search?: string;
  estado?: ProcesamientoEstado;
  tipo_proceso?: TipoProceso;
  linea_procesamiento?: LineaProcesamiento;
  recepcion_id?: number;
  page?: number;
  limit?: number;
}

// ─── Calculated Fields ─────────────────────────────────────
export function calcularRendimiento(
  pesoEntrada: number | null | undefined,
  pesoSalida: number | null | undefined
): number | null {
  if (pesoEntrada == null || pesoSalida == null || pesoEntrada === 0) {
    return null;
  }
  return Number(((pesoSalida / pesoEntrada) * 100).toFixed(2));
}

export function calcularMerma(
  pesoEntrada: number | null | undefined,
  pesoSalida: number | null | undefined
): number | null {
  if (pesoEntrada == null || pesoSalida == null) {
    return null;
  }
  return Number((pesoEntrada - pesoSalida).toFixed(2));
}
