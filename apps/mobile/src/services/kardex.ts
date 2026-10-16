import api from "./api";
import { isoAFechaLocal } from "../utils/fechas";

// ─── Inventario ─────────────────────────────────────────────

export interface InventarioItem {
  id: number;
  codigo: string;
  producto: string;
  categoria: string;
  origen: string;
  etapa: string | null;
  unidad: string;
  cantidad_actual: number;
  cantidad_minima: number | null;
  cantidad_maxima: number | null;
  ubicacion: string | null;
  estado: string;
  costo_unitario: number | null;
  fecha_ingreso: string;
  fecha_vencimiento: string | null;
}

export interface InventarioResponse {
  data: InventarioItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function inventarioToFrontend(dto: Record<string, unknown>): InventarioItem {
  return {
    id: Number(dto.id ?? 0),
    codigo: String(dto.codigo ?? ""),
    producto: String(dto.producto ?? ""),
    categoria: String(dto.categoria ?? ""),
    origen: String(dto.origen ?? ""),
    etapa: dto.etapa != null ? String(dto.etapa) : null,
    unidad: String(dto.unidad ?? ""),
    cantidad_actual: Number(dto.cantidad_actual ?? 0),
    cantidad_minima: dto.cantidad_minima != null ? Number(dto.cantidad_minima) : null,
    cantidad_maxima: dto.cantidad_maxima != null ? Number(dto.cantidad_maxima) : null,
    ubicacion: dto.ubicacion != null ? String(dto.ubicacion) : null,
    estado: String(dto.estado ?? ""),
    costo_unitario: dto.costo_unitario != null ? Number(dto.costo_unitario) : null,
    fecha_ingreso: isoAFechaLocal(String(dto.fecha_ingreso ?? "")),
    fecha_vencimiento: dto.fecha_vencimiento != null ? isoAFechaLocal(String(dto.fecha_vencimiento)) : null,
  };
}

export async function fetchInventario(params?: {
  search?: string;
  origen?: string;
  categoria?: string;
  etapa?: string;
  estado?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}): Promise<InventarioResponse> {
  const { signal, ...query } = params ?? {};
  const res = await api.get("/kardex/inventario", { params: query, signal });
  return {
    data: (res.data.data ?? []).map(inventarioToFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 50,
    totalPages: res.data.totalPages ?? 1,
  };
}

// ─── Detalle de item ────────────────────────────────────────

export interface KardexMovimiento {
  id: number;
  tipo: string;
  cantidad: number;
  saldo_anterior: number;
  saldo_posterior: number;
  fecha: string;
  destino: string | null;
  referencia: string | null;
  referencia_tipo: string | null;
  referencia_id: number | null;
  responsable: string | null;
  observaciones: string | null;
  origen: string | null;
}

export interface KardexItem {
  id: number;
  codigo: string;
  producto: string;
  categoria: string;
  origen: string;
  etapa: string | null;
  unidad: string;
  cantidad_actual: number;
  cantidad_minima: number | null;
  cantidad_maxima: number | null;
  ubicacion: string | null;
  estado: string;
  costo_unitario: number | null;
  fecha_ingreso: string;
  fecha_vencimiento: string | null;
  proveedor: string | null;
  observaciones: string | null;
  movimientos: KardexMovimiento[];
}

function movimientoToFrontend(dto: Record<string, unknown>): KardexMovimiento {
  return {
    id: Number(dto.id ?? 0),
    tipo: String(dto.tipo ?? ""),
    cantidad: Number(dto.cantidad ?? 0),
    saldo_anterior: Number(dto.saldo_anterior ?? 0),
    saldo_posterior: Number(dto.saldo_posterior ?? 0),
    fecha: String(dto.fecha ?? ""),
    destino: dto.destino != null ? String(dto.destino) : null,
    referencia: dto.referencia != null ? String(dto.referencia) : null,
    referencia_tipo: dto.referencia_tipo != null ? String(dto.referencia_tipo) : null,
    referencia_id: dto.referencia_id != null ? Number(dto.referencia_id) : null,
    responsable: dto.responsable != null ? String(dto.responsable) : null,
    observaciones: dto.observaciones != null ? String(dto.observaciones) : null,
    origen: dto.origen != null ? String(dto.origen) : null,
  };
}

function kardexItemToFrontend(dto: Record<string, unknown>): KardexItem {
  return {
    id: Number(dto.id ?? 0),
    codigo: String(dto.codigo ?? ""),
    producto: String(dto.producto ?? ""),
    categoria: String(dto.categoria ?? ""),
    origen: String(dto.origen ?? ""),
    etapa: dto.etapa != null ? String(dto.etapa) : null,
    unidad: String(dto.unidad ?? ""),
    cantidad_actual: Number(dto.cantidad_actual ?? 0),
    cantidad_minima: dto.cantidad_minima != null ? Number(dto.cantidad_minima) : null,
    cantidad_maxima: dto.cantidad_maxima != null ? Number(dto.cantidad_maxima) : null,
    ubicacion: dto.ubicacion != null ? String(dto.ubicacion) : null,
    estado: String(dto.estado ?? ""),
    costo_unitario: dto.costo_unitario != null ? Number(dto.costo_unitario) : null,
    fecha_ingreso: isoAFechaLocal(String(dto.fecha_ingreso ?? "")),
    fecha_vencimiento: dto.fecha_vencimiento != null ? isoAFechaLocal(String(dto.fecha_vencimiento)) : null,
    proveedor: dto.proveedor != null ? String(dto.proveedor) : null,
    observaciones: dto.observaciones != null ? String(dto.observaciones) : null,
    movimientos: (Array.isArray(dto.movimientos) ? dto.movimientos : []).map(movimientoToFrontend),
  };
}

export async function fetchKardexItem(id: number, signal?: AbortSignal): Promise<KardexItem> {
  const res = await api.get(`/kardex/${id}`, { signal });
  return kardexItemToFrontend(res.data.data);
}

// ─── Stats y alertas ────────────────────────────────────────

export interface StatsKardex {
  total_items: number;
  valor_total: number;
  kg_totales: number;
  movimientos_mes: {
    entradas: { cantidad: number; total: number };
    salidas: { cantidad: number; total: number };
    bajas: { cantidad: number; total: number };
  };
}

export interface AlertasKardex {
  bajo_minimo: Array<{ id: number; codigo: string; producto: string; unidad: string; cantidad_actual: number; cantidad_minima: number | null }>;
  proximos_vencer: Array<{ id: number; codigo: string; producto: string; unidad: string; cantidad_actual: number; fecha_vencimiento: string | null }>;
  vencidos: Array<{ id: number; codigo: string; producto: string; unidad: string; cantidad_actual: number; fecha_vencimiento: string | null }>;
  total_alertas: number;
}

export async function fetchKardexStats(signal?: AbortSignal): Promise<StatsKardex> {
  const res = await api.get("/kardex/stats", { signal });
  return res.data.data;
}

export async function fetchAlertas(signal?: AbortSignal): Promise<AlertasKardex> {
  const res = await api.get("/kardex/alertas", { signal });
  return res.data.data;
}

// ─── CRUD ───────────────────────────────────────────────────

export async function createKardexItem(data: Record<string, unknown>): Promise<KardexItem> {
  const res = await api.post("/kardex", data);
  return kardexItemToFrontend(res.data.data);
}

export async function updateKardexItem(id: number, data: Record<string, unknown>): Promise<KardexItem> {
  const res = await api.put(`/kardex/${id}`, data);
  return kardexItemToFrontend(res.data.data);
}

export async function deleteKardexItem(id: number): Promise<void> {
  await api.delete(`/kardex/${id}`);
}

// ─── Movimientos ────────────────────────────────────────────

export async function addKardexMovimiento(
  kardexId: number,
  data: {
    tipo: string;
    cantidad: number;
    destino?: string;
    referencia?: string;
    responsable?: string;
    observaciones?: string;
    fecha?: string;
  },
): Promise<KardexMovimiento> {
  const res = await api.post(`/kardex/${kardexId}/movimientos`, data);
  return movimientoToFrontend(res.data.data);
}

export async function removeKardexMovimiento(kardexId: number, movimientoId: number): Promise<void> {
  await api.delete(`/kardex/${kardexId}/movimientos/${movimientoId}`);
}

// ─── Baja y salida ──────────────────────────────────────────

export async function darDeBaja(
  kardexId: number,
  motivo: string,
  cantidad?: number,
  responsable?: string,
): Promise<void> {
  await api.post(`/kardex/${kardexId}/baja`, { motivo, cantidad, responsable });
}

export async function registrarSalidaProducto(input: {
  kardex_id: number;
  cantidad: number;
  destino?: string | null;
  cliente?: string | null;
  referencia?: string | null;
  responsable?: string | null;
  observaciones?: string | null;
  fecha?: string;
}): Promise<void> {
  await api.post("/kardex/salidas", input);
}

// ─── Formato y constantes ───────────────────────────────────

export function formatearCantidad(n: number): string {
  return n.toLocaleString("es-PE", { maximumFractionDigits: 2 });
}

export const kardexOrigenLabels: Record<string, string> = {
  CAMPO: "De campo",
  PROCESAMIENTO: "Procesamiento",
  AJUSTE: "Ajuste",
  OTRO: "Otro",
};

export const kardexCategoriaLabels: Record<string, string> = {
  PRODUCTO_CAMPO: "Producto de campo",
  PRODUCTO_PROCESADO: "Producto procesado",
  SUBPRODUCTO: "Subproducto",
  ENVASE: "Envase",
};

export const kardexEtapaLabels: Record<string, string> = {
  PRIMARIA: "Primaria",
  SECUNDARIA: "Secundaria",
  EMPAQUE: "Empaque",
};

export const kardexEstadoLabels: Record<string, string> = {
  DISPONIBLE: "Disponible",
  CONSUMIDO: "Consumido",
  VENCIDO: "Vencido",
};

export const kardexTipoMovimientoLabels: Record<string, string> = {
  ENTRADA: "Entrada",
  SALIDA: "Salida",
  TRANSFERENCIA: "Transferencia",
  AJUSTE: "Ajuste",
  BAJA: "Baja",
  INGRESO: "Ingreso",
};