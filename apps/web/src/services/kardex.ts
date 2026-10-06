import api from "./api";

export interface KardexMovimiento {
  id?: number;
  tipo: string;
  cantidad: number;
  saldoAnterior: number;
  saldoPosterior: number;
  fecha: string;
  destino: string;
  referencia: string;
  responsable: string;
  observaciones: string;
}

export interface KardexItem {
  id: number;
  codigo: string;
  producto: string;
  categoria: string;
  unidad: string;
  cantidadActual: number;
  cantidadMinima: number | null;
  cantidadMaxima: number | null;
  ubicacion: string;
  estado: string;
  fechaIngreso: string;
  fechaVencimiento: string;
  proveedor: string;
  costoUnitario: number | null;
  observaciones: string;
  movimientos: KardexMovimiento[];
  createdAt: string;
  updatedAt: string;
}

interface KardexItemDTO {
  id: number;
  codigo: string;
  producto: string;
  categoria: string;
  unidad: string;
  cantidad_actual: number;
  cantidad_minima: number | null;
  cantidad_maxima: number | null;
  ubicacion: string | null;
  estado: string;
  fecha_ingreso: string;
  fecha_vencimiento: string | null;
  proveedor: string | null;
  costo_unitario: number | null;
  observaciones: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  movimientos: Array<{
    id: number;
    tipo: string;
    cantidad: number;
    saldo_anterior: number;
    saldo_posterior: number;
    fecha: string;
    destino: string | null;
    referencia: string | null;
    responsable: string | null;
    observaciones: string | null;
    created_at: string;
    kardex_id: number;
  }>;
}

function toFrontend(dto: KardexItemDTO): KardexItem {
  return {
    id: dto.id,
    codigo: dto.codigo,
    producto: dto.producto,
    categoria: dto.categoria,
    unidad: dto.unidad,
    cantidadActual: Number(dto.cantidad_actual) || 0,
    cantidadMinima: dto.cantidad_minima != null ? Number(dto.cantidad_minima) : null,
    cantidadMaxima: dto.cantidad_maxima != null ? Number(dto.cantidad_maxima) : null,
    ubicacion: dto.ubicacion ?? "",
    estado: dto.estado,
    fechaIngreso: dto.fecha_ingreso?.split("T")[0] ?? "",
    fechaVencimiento: dto.fecha_vencimiento?.split("T")[0] ?? "",
    proveedor: dto.proveedor ?? "",
    costoUnitario: dto.costo_unitario != null ? Number(dto.costo_unitario) : null,
    observaciones: dto.observaciones ?? "",
    movimientos: (dto.movimientos ?? []).map(m => ({
      id: m.id,
      tipo: m.tipo,
      cantidad: Number(m.cantidad) || 0,
      saldoAnterior: Number(m.saldo_anterior) || 0,
      saldoPosterior: Number(m.saldo_posterior) || 0,
      fecha: m.fecha,
      destino: m.destino ?? "",
      referencia: m.referencia ?? "",
      responsable: m.responsable ?? "",
      observaciones: m.observaciones ?? "",
    })),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<KardexItemFormData>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.producto !== undefined) out.producto = data.producto;
  if (data.categoria !== undefined) out.categoria = data.categoria;
  if (data.unidad !== undefined) out.unidad = data.unidad;
  if (data.cantidadMinima !== undefined) out.cantidad_minima = data.cantidadMinima;
  if (data.cantidadMaxima !== undefined) out.cantidad_maxima = data.cantidadMaxima;
  if (data.ubicacion !== undefined) out.ubicacion = data.ubicacion;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.fechaIngreso !== undefined) out.fecha_ingreso = data.fechaIngreso || null;
  if (data.fechaVencimiento !== undefined) out.fecha_vencimiento = data.fechaVencimiento || null;
  if (data.proveedor !== undefined) out.proveedor = data.proveedor || null;
  if (data.costoUnitario !== undefined) out.costo_unitario = data.costoUnitario;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  return out;
}

// ─── Types ─────────────────────────────────────────────────

export interface KardexItemFormData {
  codigo: string;
  producto: string;
  categoria: string;
  unidad: string;
  cantidadActual: number | null;
  cantidadMinima: number | null;
  cantidadMaxima: number | null;
  ubicacion: string;
  estado: string;
  fechaIngreso: string;
  fechaVencimiento: string;
  proveedor: string;
  costoUnitario: number | null;
  observaciones: string;
}

export const emptyKardexItemForm: KardexItemFormData = {
  codigo: "",
  producto: "",
  categoria: "",
  unidad: "KG",
  cantidadActual: 0,
  cantidadMinima: 0,
  cantidadMaxima: 0,
  ubicacion: "",
  estado: "DISPONIBLE",
  fechaIngreso: new Date().toISOString().split("T")[0],
  fechaVencimiento: "",
  proveedor: "",
  costoUnitario: 0,
  observaciones: "",
};

export const kardexEstados = ["DISPONIBLE", "RESERVADO", "CONSUMIDO", "VENCIDO"] as const;
export const kardexCategorias = ["MATERIA_PRIMA", "PRODUCTO_TERMINADO", "EMPAQUE", "INSUMO"] as const;

export interface KardexQuery {
  search?: string;
  estado?: string;
  categoria?: string;
  page?: number;
  limit?: number;
}

export async function fetchKardex(params?: KardexQuery): Promise<{ data: KardexItem[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.categoria) query.categoria = params.categoria;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const res = await api.get("/kardex", { params: query });
  return {
    data: (res.data.data ?? []).map(toFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchKardexItem(id: string): Promise<KardexItem> {
  const res = await api.get(`/kardex/${id}`);
  return toFrontend(res.data.data);
}

export async function createKardexItem(data: Partial<KardexItemFormData>): Promise<KardexItem> {
  const res = await api.post("/kardex", toBackend(data));
  return toFrontend(res.data.data);
}

export async function updateKardexItem(id: string | number, data: Partial<KardexItemFormData>): Promise<KardexItem> {
  const res = await api.put(`/kardex/${id}`, toBackend(data));
  return toFrontend(res.data.data);
}

export async function deleteKardexItem(id: string | number): Promise<void> {
  await api.delete(`/kardex/${id}`);
}

export async function addKardexMovimiento(kardexId: string, data: {
  tipo: string;
  cantidad: number;
  destino?: string;
  referencia?: string;
  responsable?: string;
  observaciones?: string;
  fecha?: string;
}): Promise<KardexMovimiento> {
  const res = await api.post(`/kardex/${kardexId}/movimientos`, data);
  return {
    id: res.data.data.id,
    tipo: res.data.data.tipo,
    cantidad: Number(res.data.data.cantidad) || 0,
    saldoAnterior: Number(res.data.data.saldo_anterior) || 0,
    saldoPosterior: Number(res.data.data.saldo_posterior) || 0,
    fecha: res.data.data.fecha,
    destino: res.data.data.destino ?? "",
    referencia: res.data.data.referencia ?? "",
    responsable: res.data.data.responsable ?? "",
    observaciones: res.data.data.observaciones ?? "",
  };
}

export async function removeKardexMovimiento(kardexId: string | number, movimientoId: string | number): Promise<void> {
  await api.delete(`/kardex/${kardexId}/movimientos/${movimientoId}`);
}

export async function recomputeStock(kardexId: string): Promise<{ stock_recalculado: number; movimientos_procesados: number }> {
  const res = await api.post(`/kardex/${kardexId}/recompute`);
  return res.data.data;
}

export function formatearFecha(fecha: string): string {
  if (!fecha) return "";
  return new Date(fecha).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatearPeso(peso: number): string {
  return `${peso.toFixed(2)} kg`;
}

export function calcularValorInventario(cantidad: number, costo: number | null): number {
  if (costo == null) return 0;
  return cantidad * costo;
}
