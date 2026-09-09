import type {
  EstadoRecepcion,
  ResultadoRecepcion,
  CategoriaRecepcion,
  DestinoRecepcion,
  EstadoProducto,
} from '@agrodata/types';

// ─── Input Types ──────────────────────────────────────────
export interface RecepcionCreateInput {
  acopio_id: number;
  lote_productor?: string | null;
  fecha: string;
  responsable: string;
  planta: string;
  sacos?: number;
  peso_campo?: number | null;
  peso_bruto?: number | null;
  tara?: number | null;
  peso_neto?: number | null;
  diferencia?: number | null;
  merma?: number | null;
  humedad?: number | null;
  impurezas?: number | null;
  materia_extrana?: number | null;
  color?: string | null;
  olor?: string | null;
  presencia_insectos?: string | null;
  estado_producto?: EstadoProducto | null;
  categoria?: CategoriaRecepcion | null;
  destino?: DestinoRecepcion | null;
  resultado?: ResultadoRecepcion | null;
  motivo?: string | null;
  observaciones?: string | null;
  documento_firmado?: boolean;
  firma_responsable_url?: string | null;
  estado?: EstadoRecepcion;
  sacos_detalle?: Array<{ codigo: string; peso: number; observaciones?: string | null }>;
}

export type RecepcionUpdateInput = Partial<Omit<RecepcionCreateInput, 'acopio_id'>> & {
  acopio_id?: number | null;
};

// ─── Filter Types ─────────────────────────────────────────
export interface RecepcionFilters {
  search?: string;
  estado?: EstadoRecepcion;
  page?: number;
  limit?: number;
}

// ─── Response Types ───────────────────────────────────────
export interface RecepcionResponse {
  id: number;
  codigo: string;
  lote_productor: string | null;
  fecha: Date;
  responsable: string;
  planta: string;
  sacos: number;
  peso_campo: number | null;
  peso_bruto: number | null;
  tara: number | null;
  peso_neto: number | null;
  diferencia: number | null;
  merma: number | null;
  humedad: number | null;
  impurezas: number | null;
  materia_extrana: number | null;
  color: string | null;
  olor: string | null;
  presencia_insectos: string | null;
  estado_producto: EstadoProducto | null;
  categoria: CategoriaRecepcion | null;
  destino: DestinoRecepcion | null;
  resultado: ResultadoRecepcion | null;
  motivo: string | null;
  estado: EstadoRecepcion;
  observaciones: string | null;
  documento_firmado: boolean;
  firma_responsable_url: string | null;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: string | null;
  updated_by: string | null;
  acopio_id: number | null;
  acopio: { id: number; codigo: string } | null;
  sacos_detalle: Array<{ id: number; codigo: string; peso: number; observaciones: string | null }>;
}
