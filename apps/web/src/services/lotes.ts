import api from "./api";

export interface MovimientoLote {
  id?: string;
  tipo: string;
  cantidad: number;
  fecha: string;
  descripcion: string;
  referencia: string;
}

export interface Lote {
  id: string;
  codigo: string;
  nombre: string;
  campaniaId: string;
  campaniaNombre: string;
  cultivoId: string;
  cultivoNombre: string;
  origen: string;
  pesoInicial: number;
  pesoDisponible: number;
  unidad: string;
  estado: string;
  fechaProduccion: string;
  fechaVencimiento: string;
  calidad: string;
  certificacion: string;
  ubicacion: string;
  observaciones: string;
  movimientos: MovimientoLote[];
  createdAt: string;
  updatedAt: string;
}

interface LoteDTO {
  id: string;
  codigo: string;
  nombre: string;
  campania_id: string;
  campania: { id: string; codigo: string; nombre: string } | null;
  cultivo_id: string;
  cultivo: { id: string; codigo: string; cultivo: string } | null;
  origen: string;
  peso_inicial: number;
  peso_disponible: number;
  unidad: string;
  estado: string;
  fecha_produccion: string | null;
  fecha_vencimiento: string | null;
  calidad: string | null;
  certificacion: string | null;
  ubicacion: string | null;
  observaciones: string | null;
  movimientos: Array<{ id: string; tipo: string; cantidad: number; fecha: string; descripcion: string | null; referencia: string | null }>;
  created_at: string;
  updated_at: string;
}

function toFrontend(dto: LoteDTO): Lote {
  return {
    id: dto.id,
    codigo: dto.codigo,
    nombre: dto.nombre,
    campaniaId: dto.campania_id,
    campaniaNombre: dto.campania?.nombre ?? "",
    cultivoId: dto.cultivo_id,
    cultivoNombre: dto.cultivo?.cultivo ?? "",
    origen: dto.origen,
    pesoInicial: Number(dto.peso_inicial) || 0,
    pesoDisponible: Number(dto.peso_disponible) || 0,
    unidad: dto.unidad,
    estado: dto.estado,
    fechaProduccion: dto.fecha_produccion?.split("T")[0] ?? "",
    fechaVencimiento: dto.fecha_vencimiento?.split("T")[0] ?? "",
    calidad: dto.calidad ?? "",
    certificacion: dto.certificacion ?? "",
    ubicacion: dto.ubicacion ?? "",
    observaciones: dto.observaciones ?? "",
    movimientos: (dto.movimientos ?? []).map(m => ({
      id: m.id,
      tipo: m.tipo,
      cantidad: Number(m.cantidad) || 0,
      fecha: m.fecha,
      descripcion: m.descripcion ?? "",
      referencia: m.referencia ?? "",
    })),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<Lote>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.nombre !== undefined) out.nombre = data.nombre;
  if (data.campaniaId !== undefined) out.campania_id = data.campaniaId;
  if (data.cultivoId !== undefined) out.cultivo_id = data.cultivoId;
  if (data.origen !== undefined) out.origen = data.origen;
  if (data.pesoInicial !== undefined) out.peso_inicial = data.pesoInicial;
  if (data.pesoDisponible !== undefined) out.peso_disponible = data.pesoDisponible;
  if (data.unidad !== undefined) out.unidad = data.unidad;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.fechaProduccion !== undefined) out.fecha_produccion = data.fechaProduccion || null;
  if (data.fechaVencimiento !== undefined) out.fecha_vencimiento = data.fechaVencimiento || null;
  if (data.calidad !== undefined) out.calidad = data.calidad || null;
  if (data.certificacion !== undefined) out.certificacion = data.certificacion || null;
  if (data.ubicacion !== undefined) out.ubicacion = data.ubicacion || null;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  return out;
}

// ─── Types ─────────────────────────────────────────────────

export interface LoteFormData {
  codigo: string;
  nombre: string;
  campaniaId: string;
  cultivoId: string;
  origen: string;
  pesoInicial: number;
  pesoDisponible: number;
  unidad: string;
  estado: string;
  fechaProduccion: string;
  fechaVencimiento: string;
  calidad: string;
  certificacion: string;
  ubicacion: string;
  observaciones: string;
}

export const emptyLoteForm: LoteFormData = {
  codigo: "",
  nombre: "",
  campaniaId: "",
  cultivoId: "",
  origen: "",
  pesoInicial: 0,
  pesoDisponible: 0,
  unidad: "KG",
  estado: "DISPONIBLE",
  fechaProduccion: new Date().toISOString().split("T")[0],
  fechaVencimiento: "",
  calidad: "",
  certificacion: "",
  ubicacion: "",
  observaciones: "",
};

export const loteEstados = ["DISPONIBLE", "RESERVADO", "AGOTADO", "VENCIDO"] as const;
export const loteUnidades = ["KG", "QQ", "TON"] as const;

export interface LotesQuery {
  search?: string;
  estado?: string;
  campania_id?: string;
  cultivo_id?: string;
  origen?: string;
  page?: number;
  limit?: number;
}

export async function fetchLotes(params?: LotesQuery): Promise<{ data: Lote[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.campania_id) query.campania_id = params.campania_id;
  if (params?.cultivo_id) query.cultivo_id = params.cultivo_id;
  if (params?.origen) query.origen = params.origen;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const res = await api.get("/lotes", { params: query });
  return {
    data: (res.data.data ?? []).map(toFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchLote(id: string): Promise<Lote> {
  const res = await api.get(`/lotes/${id}`);
  return toFrontend(res.data.data);
}

export async function createLote(data: Partial<Lote>): Promise<Lote> {
  const res = await api.post("/lotes", toBackend(data));
  return toFrontend(res.data.data);
}

export async function updateLote(id: string, data: Partial<Lote>): Promise<Lote> {
  const res = await api.put(`/lotes/${id}`, toBackend(data));
  return toFrontend(res.data.data);
}

export async function deleteLote(id: string): Promise<void> {
  await api.delete(`/lotes/${id}`);
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
