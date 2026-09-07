import api from "./api";

export interface Saco {
  id?: string;
  codigo: string;
  peso: number;
  observaciones: string;
}

export interface AcopioDetalle {
  id?: number;
  productorId: number;
  productorNombre: string;
  productorCodigo: string;
  cultivoId: number;
  cultivoNombre: string;
  cultivoCodigo: string;
  totalSacos: number;
  pesoTotal: number;
  observaciones: string;
  sacos: Saco[];
}

export interface Acopio {
  id: string;
  codigo: string;
  fecha: string;
  acopiador: string;
  vehiculo: string;
  rutaAcopio: string;
  totalSacos: number;
  pesoTotal: number;
  estado: string;
  observaciones: string;
  detalles: AcopioDetalle[];
  createdAt: string;
  updatedAt: string;
}

interface AcopioDTO {
  id: string;
  codigo: string;
  fecha: string;
  acopiador: string;
  vehiculo: string | null;
  ruta_acopio: string | null;
  total_sacos: number;
  peso_total: number;
  estado: string;
  observaciones: string | null;
  detalles: Array<{
    id: number;
    productor_id: number;
    productor: { id: number; nombres: string; apellido_paterno: string; apellido_materno: string } | null;
    cultivo_id: number;
    cultivo: { id: number; codigo: string; cultivo: string } | null;
    total_sacos: number;
    peso_total: number;
    observaciones: string | null;
    sacos: Array<{ id: string; codigo: string; peso: number; observaciones: string | null }>;
  }>;
  created_at: string;
  updated_at: string;
}

function toFrontend(dto: AcopioDTO): Acopio {
  return {
    id: dto.id,
    codigo: dto.codigo,
    fecha: dto.fecha?.split("T")[0] ?? "",
    acopiador: dto.acopiador,
    vehiculo: dto.vehiculo ?? "",
    rutaAcopio: dto.ruta_acopio ?? "",
    totalSacos: Number(dto.total_sacos) || 0,
    pesoTotal: Number(dto.peso_total) || 0,
    estado: dto.estado,
    observaciones: dto.observaciones ?? "",
    detalles: (dto.detalles ?? []).map(d => ({
      id: d.id,
      productorId: d.productor_id,
      productorNombre: d.productor
        ? `${d.productor.nombres} ${d.productor.apellido_paterno} ${d.productor.apellido_materno}`.trim()
        : "",
      productorCodigo: "",
      cultivoId: d.cultivo_id,
      cultivoNombre: d.cultivo?.cultivo ?? "",
      cultivoCodigo: d.cultivo?.codigo ?? "",
      totalSacos: Number(d.total_sacos) || 0,
      pesoTotal: Number(d.peso_total) || 0,
      observaciones: d.observaciones ?? "",
      sacos: (d.sacos ?? []).map(s => ({
        id: s.id,
        codigo: s.codigo,
        peso: Number(s.peso) || 0,
        observaciones: s.observaciones ?? "",
      })),
    })),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<Acopio>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.fecha !== undefined) out.fecha = data.fecha || null;
  if (data.acopiador !== undefined) out.acopiador = data.acopiador;
  if (data.vehiculo !== undefined) out.vehiculo = data.vehiculo || null;
  if (data.rutaAcopio !== undefined) out.ruta_acopio = data.rutaAcopio || null;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  if (data.detalles !== undefined) out.detalles = data.detalles;
  return out;
}

// ─── Types ─────────────────────────────────────────────────

export interface AcopioDetalleFormData {
  productorId: number;
  productorNombre: string;
  cultivoId: number;
  cultivoNombre: string;
  observaciones: string;
  sacos: Saco[];
  pesoInput?: string;
}

export interface AcopioFormData {
  codigo: string;
  fecha: string;
  acopiador: string;
  vehiculo: string;
  rutaAcopio: string;
  estado: string;
  observaciones: string;
  detalles: AcopioDetalleFormData[];
}

export interface AcopiosQuery {
  search?: string;
  estado?: string;
  page?: number;
  limit?: number;
}

export async function fetchAcopios(params?: AcopiosQuery): Promise<{ data: Acopio[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const res = await api.get("/acopios", { params: query });
  return {
    data: (res.data.data ?? []).map(toFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchAcopio(id: string): Promise<Acopio> {
  const res = await api.get(`/acopios/${id}`);
  return toFrontend(res.data.data);
}

export async function fetchAcopioByCodigo(codigo: string): Promise<Acopio> {
  const res = await api.get(`/acopios/buscar/${codigo}`);
  return toFrontend(res.data.data);
}

export async function createAcopio(data: Partial<Acopio>): Promise<Acopio> {
  const res = await api.post("/acopios", toBackend(data));
  return toFrontend(res.data.data);
}

export async function updateAcopio(id: string, data: Partial<Acopio>): Promise<Acopio> {
  const res = await api.put(`/acopios/${id}`, toBackend(data));
  return toFrontend(res.data.data);
}

export async function deleteAcopio(id: string): Promise<void> {
  await api.delete(`/acopios/${id}`);
}

export async function fetchAcopioStats(): Promise<{
  total_acopios: number;
  sacos_recibidos: number;
  kilogramos_acopiados: number;
}> {
  const res = await api.get("/acopios/stats");
  return res.data.data;
}

export function formatFecha(fecha?: string): string {
  if (!fecha) return "—";
  const d = new Date(fecha.includes("T") ? fecha : fecha + "T00:00:00");
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatKg(peso: number): string {
  return `${Intl.NumberFormat("es-PE", { maximumFractionDigits: 1 }).format(peso)} kg`;
}

// ─── View Adapter ──────────────────────────────────────────

export type AcopioView = {
  id: string;
  codigo: string;
  fecha: string;
  acopiador: string;
  vehiculo: string;
  ruta: string;
  totalSacos: number;
  pesoTotal: number;
  estado: string;
  detalles: Array<{
    productor: string;
    cultivo: string;
    totalSacos: number;
    pesoTotal: number;
    sacos: Array<{ id: string; codigo: string; peso: number; observaciones: string }>;
  }>;
  observaciones: string;
};

const displayEstado: Record<string, string> = {
  EN_PROCESO: "En Proceso",
  COMPLETADO: "Completado",
  EN_PLANTA: "En Planta",
};

export function toAcopioView(a: Acopio): AcopioView {
  return {
    id: a.id,
    codigo: a.codigo,
    fecha: a.fecha,
    acopiador: a.acopiador,
    vehiculo: a.vehiculo,
    ruta: a.rutaAcopio,
    totalSacos: a.totalSacos,
    pesoTotal: a.pesoTotal,
    estado: displayEstado[a.estado] ?? a.estado,
    detalles: a.detalles.map(d => ({
      productor: d.productorNombre,
      cultivo: d.cultivoNombre,
      totalSacos: d.totalSacos,
      pesoTotal: d.pesoTotal,
      sacos: d.sacos.map(s => ({
        id: s.id ?? "",
        codigo: s.codigo,
        peso: s.peso,
        observaciones: s.observaciones,
      })),
    })),
    observaciones: a.observaciones,
  };
}
