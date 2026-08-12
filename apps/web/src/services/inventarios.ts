import api from "./api";

export interface MovimientoInventario {
  id?: string;
  tipo: string;
  cantidad: number;
  fecha: string;
  descripcion: string;
  referencia: string;
  usuario: string;
}

export interface InventarioItem {
  id: string;
  codigo: string;
  producto: string;
  categoria: string;
  unidad: string;
  cantidadActual: number;
  cantidadMinima: number;
  cantidadMaxima: number;
  ubicacion: string;
  estado: string;
  loteId: string;
  loteCodigo: string;
  fechaIngreso: string;
  fechaVencimiento: string;
  proveedor: string;
  costoUnitario: number;
  observaciones: string;
  movimientos: MovimientoInventario[];
  createdAt: string;
  updatedAt: string;
}

interface InventarioItemDTO {
  id: string;
  codigo: string;
  producto: string;
  categoria: string;
  unidad: string;
  cantidad_actual: number;
  cantidad_minima: number;
  cantidad_maxima: number;
  ubicacion: string;
  estado: string;
  lote_id: string | null;
  lote: { id: string; codigo: string } | null;
  fecha_ingreso: string | null;
  fecha_vencimiento: string | null;
  proveedor: string | null;
  costo_unitario: number;
  observaciones: string | null;
  movimientos: Array<{ id: string; tipo: string; cantidad: number; fecha: string; descripcion: string | null; referencia: string | null; usuario: string }>;
  created_at: string;
  updated_at: string;
}

function toFrontend(dto: InventarioItemDTO): InventarioItem {
  return {
    id: dto.id,
    codigo: dto.codigo,
    producto: dto.producto,
    categoria: dto.categoria,
    unidad: dto.unidad,
    cantidadActual: Number(dto.cantidad_actual) || 0,
    cantidadMinima: Number(dto.cantidad_minima) || 0,
    cantidadMaxima: Number(dto.cantidad_maxima) || 0,
    ubicacion: dto.ubicacion,
    estado: dto.estado,
    loteId: dto.lote_id ?? "",
    loteCodigo: dto.lote?.codigo ?? "",
    fechaIngreso: dto.fecha_ingreso?.split("T")[0] ?? "",
    fechaVencimiento: dto.fecha_vencimiento?.split("T")[0] ?? "",
    proveedor: dto.proveedor ?? "",
    costoUnitario: Number(dto.costo_unitario) || 0,
    observaciones: dto.observaciones ?? "",
    movimientos: (dto.movimientos ?? []).map(m => ({
      id: m.id,
      tipo: m.tipo,
      cantidad: Number(m.cantidad) || 0,
      fecha: m.fecha,
      descripcion: m.descripcion ?? "",
      referencia: m.referencia ?? "",
      usuario: m.usuario,
    })),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<InventarioItem>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.producto !== undefined) out.producto = data.producto;
  if (data.categoria !== undefined) out.categoria = data.categoria;
  if (data.unidad !== undefined) out.unidad = data.unidad;
  if (data.cantidadActual !== undefined) out.cantidad_actual = data.cantidadActual;
  if (data.cantidadMinima !== undefined) out.cantidad_minima = data.cantidadMinima;
  if (data.cantidadMaxima !== undefined) out.cantidad_maxima = data.cantidadMaxima;
  if (data.ubicacion !== undefined) out.ubicacion = data.ubicacion;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.loteId !== undefined) out.lote_id = data.loteId || null;
  if (data.fechaIngreso !== undefined) out.fecha_ingreso = data.fechaIngreso || null;
  if (data.fechaVencimiento !== undefined) out.fecha_vencimiento = data.fechaVencimiento || null;
  if (data.proveedor !== undefined) out.proveedor = data.proveedor || null;
  if (data.costoUnitario !== undefined) out.costo_unitario = data.costoUnitario;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  return out;
}

// ─── Types ─────────────────────────────────────────────────

export interface InventarioItemFormData {
  codigo: string;
  producto: string;
  categoria: string;
  unidad: string;
  cantidadActual: number;
  cantidadMinima: number;
  cantidadMaxima: number;
  ubicacion: string;
  estado: string;
  loteId: string;
  fechaIngreso: string;
  fechaVencimiento: string;
  proveedor: string;
  costoUnitario: number;
  observaciones: string;
}

export const emptyInventarioItemForm: InventarioItemFormData = {
  codigo: "",
  producto: "",
  categoria: "",
  unidad: "KG",
  cantidadActual: 0,
  cantidadMinima: 0,
  cantidadMaxima: 0,
  ubicacion: "",
  estado: "DISPONIBLE",
  loteId: "",
  fechaIngreso: new Date().toISOString().split("T")[0],
  fechaVencimiento: "",
  proveedor: "",
  costoUnitario: 0,
  observaciones: "",
};

export const inventarioEstados = ["DISPONIBLE", "RESERVADO", "AGOTADO", "VENCIDO"] as const;
export const inventarioCategorias = ["MATERIA_PRIMA", "PRODUCTO_TERMINADO", "EMPAQUE", "INSUMO"] as const;

export interface InventariosQuery {
  search?: string;
  estado?: string;
  categoria?: string;
  ubicacion?: string;
  lote_id?: string;
  page?: number;
  limit?: number;
}

export async function fetchInventario(params?: InventariosQuery): Promise<{ data: InventarioItem[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.categoria) query.categoria = params.categoria;
  if (params?.ubicacion) query.ubicacion = params.ubicacion;
  if (params?.lote_id) query.lote_id = params.lote_id;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const res = await api.get("/inventarios", { params: query });
  return {
    data: (res.data.data ?? []).map(toFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchInventarioItem(id: string): Promise<InventarioItem> {
  const res = await api.get(`/inventarios/${id}`);
  return toFrontend(res.data.data);
}

export async function createInventarioItem(data: Partial<InventarioItem>): Promise<InventarioItem> {
  const res = await api.post("/inventarios", toBackend(data));
  return toFrontend(res.data.data);
}

export async function updateInventarioItem(id: string, data: Partial<InventarioItem>): Promise<InventarioItem> {
  const res = await api.put(`/inventarios/${id}`, toBackend(data));
  return toFrontend(res.data.data);
}

export async function deleteInventarioItem(id: string): Promise<void> {
  await api.delete(`/inventarios/${id}`);
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

export function calcularValorInventario(cantidad: number, costo: number): number {
  return cantidad * costo;
}
