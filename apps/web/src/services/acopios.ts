import api from "./api";

// ─── Types ─────────────────────────────────────────────────

export interface Saco {
  id?: string;
  codigo: string;
  peso: number;
  observaciones: string;
}

export interface AcopioDetalle {
  id: number;
  productor_id: number;
  productorNombre: string;
  productorCodigo: string;
  cultivo_id: number;
  cultivoNombre: string;
  cultivoCodigo: string;
  cultivoVariedad: string | null;
  parcela_id: number | null;
  parcelaNombre: string;
  parcelaCodigo: string;
  total_sacos: number;
  peso_total: number;
  observaciones: string;
  sacos: Saco[];
}

export interface Acopio {
  id: number;
  codigo: string;
  fecha: string;
  acopiador: string;
  vehiculo: string;
  ruta_acopio: string;
  total_sacos: number;
  peso_total: number;
  peso_bruto: number;
  tara: number;
  peso_neto: number;
  estado: string;
  observaciones: string;
  detalles: AcopioDetalle[];
  created_at: string;
  updated_at: string;
}

// ─── DTO (API Response) ────────────────────────────────────

interface AcopioSacoDTO {
  id: string;
  codigo: string;
  peso: number | string;
  observaciones: string | null;
  created_at: string;
  updated_at: string;
  acopio_detalle_id: number;
}

interface AcopioDetalleDTO {
  id: number;
  acopio_id: number;
  productor_id: number;
  productor: { id: number; nombres: string; apellido_paterno: string; apellido_materno: string; codigo: string } | null;
  cultivo_id: number;
  cultivo: { id: number; codigo: string; cultivo: string; variedad: string | null } | null;
  parcela_id: number | null;
  parcela: { id: number; nombre: string; codigo: string; area: number | string } | null;
  total_sacos: number;
  peso_total: number | string;
  observaciones: string | null;
  created_at: string;
  updated_at: string;
  sacos: AcopioSacoDTO[];
}

interface AcopioDTO {
  id: number;
  codigo: string;
  fecha: string;
  acopiador: string;
  vehiculo: string | null;
  ruta_acopio: string | null;
  total_sacos: number;
  peso_total: number | string;
  peso_bruto: number | string;
  tara: number | string;
  peso_neto: number | string;
  estado: string;
  observaciones: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  detalles: AcopioDetalleDTO[];
}

// ─── Transform Functions ───────────────────────────────────

function toFrontend(dto: AcopioDTO): Acopio {
  return {
    id: dto.id,
    codigo: dto.codigo,
    fecha: dto.fecha?.split("T")[0] ?? "",
    acopiador: dto.acopiador,
    vehiculo: dto.vehiculo ?? "",
    ruta_acopio: dto.ruta_acopio ?? "",
    total_sacos: Number(dto.total_sacos) || 0,
    peso_total: Number(dto.peso_total) || 0,
    peso_bruto: Number(dto.peso_bruto) || 0,
    tara: Number(dto.tara) || 0,
    peso_neto: Number(dto.peso_neto) || 0,
    estado: dto.estado,
    observaciones: dto.observaciones ?? "",
    detalles: (dto.detalles ?? []).map((d) => ({
      id: d.id,
      productor_id: d.productor_id,
      productorNombre: d.productor
        ? `${d.productor.nombres} ${d.productor.apellido_paterno} ${d.productor.apellido_materno}`.trim()
        : "",
      productorCodigo: d.productor?.codigo ?? "",
      cultivo_id: d.cultivo_id,
      cultivoNombre: d.cultivo?.cultivo ?? "",
      cultivoCodigo: d.cultivo?.codigo ?? "",
      cultivoVariedad: d.cultivo?.variedad ?? null,
      parcela_id: d.parcela_id ?? null,
      parcelaNombre: d.parcela?.nombre ?? "",
      parcelaCodigo: d.parcela?.codigo ?? "",
      total_sacos: Number(d.total_sacos) || 0,
      peso_total: Number(d.peso_total) || 0,
      observaciones: d.observaciones ?? "",
      sacos: (d.sacos ?? []).map((s) => ({
        id: s.id,
        codigo: s.codigo,
        peso: Number(s.peso) || 0,
        observaciones: s.observaciones ?? "",
      })),
    })),
    created_at: dto.created_at,
    updated_at: dto.updated_at,
  };
}

function toBackend(data: Partial<Acopio>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.fecha !== undefined) out.fecha = data.fecha || null;
  if (data.acopiador !== undefined) out.acopiador = data.acopiador;
  if (data.vehiculo !== undefined) out.vehiculo = data.vehiculo || null;
  if (data.ruta_acopio !== undefined) out.ruta_acopio = data.ruta_acopio || null;
  if (data.peso_bruto !== undefined) out.peso_bruto = data.peso_bruto;
  if (data.tara !== undefined) out.tara = data.tara;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  if (data.detalles !== undefined) {
    out.detalles = data.detalles.map((d) => ({
      productor_id: d.productor_id,
      cultivo_id: d.cultivo_id,
      parcela_id: d.parcela_id || null,
      observaciones: d.observaciones || null,
      sacos: d.sacos.map((s) => ({
        codigo: s.codigo,
        peso: s.peso,
        observaciones: s.observaciones || null,
      })),
    }));
  }
  return out;
}

// ─── Form Types ────────────────────────────────────────────

export interface AcopioDetalleFormData {
  productor_id: number;
  productorNombre: string;
  cultivo_id: number;
  cultivoNombre: string;
  parcela_id: number | null;
  parcelaNombre: string;
  observaciones: string;
  sacos: Saco[];
  pesoInput?: string;
}

export interface AcopioFormData {
  codigo: string;
  fecha: string;
  acopiador: string;
  vehiculo: string;
  ruta_acopio: string;
  peso_bruto: number;
  tara: number;
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

// ─── API Calls ─────────────────────────────────────────────

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
  kilogramos_neto: number;
  por_estado: Record<string, number>;
}> {
  const res = await api.get("/acopios/stats");
  return res.data.data;
}

// ─── Utility Functions ─────────────────────────────────────

export function formatFecha(fecha?: string): string {
  if (!fecha) return "—";
  const d = new Date(fecha.includes("T") ? fecha : fecha + "T00:00:00");
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatKg(peso: number): string {
  return `${Intl.NumberFormat("es-PE", { maximumFractionDigits: 1 }).format(peso)} kg`;
}

// ─── Constants ─────────────────────────────────────────────

export const ESTADO_ACOPIO_LABELS: Record<string, string> = {
  EN_CAMPO: "En Campo",
  EN_TRANSITO: "En Tránsito",
  RECIBIDO: "Recibido",
};

export const ESTADO_ACOPIO_OPTIONS = [
  { value: "EN_CAMPO", label: "En Campo" },
  { value: "EN_TRANSITO", label: "En Tránsito" },
  { value: "RECIBIDO", label: "Recibido" },
];

// ─── View Adapter ──────────────────────────────────────────

export type AcopioView = {
  id: number;
  codigo: string;
  fecha: string;
  acopiador: string;
  vehiculo: string;
  ruta_acopio: string;
  total_sacos: number;
  peso_total: number;
  peso_bruto: number;
  tara: number;
  peso_neto: number;
  estado: string;
  detalles: Array<{
    productor: string;
    cultivo: string;
    parcela: string;
    total_sacos: number;
    peso_total: number;
    sacos: Array<{ id: string; codigo: string; peso: number; observaciones: string }>;
  }>;
  observaciones: string;
};

export function toAcopioView(a: Acopio): AcopioView {
  return {
    id: a.id,
    codigo: a.codigo,
    fecha: a.fecha,
    acopiador: a.acopiador,
    vehiculo: a.vehiculo,
    ruta_acopio: a.ruta_acopio,
    total_sacos: a.total_sacos,
    peso_total: a.peso_total,
    peso_bruto: a.peso_bruto,
    tara: a.tara,
    peso_neto: a.peso_neto,
    estado: ESTADO_ACOPIO_LABELS[a.estado] ?? a.estado,
    detalles: a.detalles.map((d) => ({
      productor: d.productorNombre,
      cultivo: d.cultivoNombre,
      parcela: d.parcelaNombre || d.parcelaCodigo || "—",
      total_sacos: d.total_sacos,
      peso_total: d.peso_total,
      sacos: d.sacos.map((s) => ({
        id: s.id ?? "",
        codigo: s.codigo,
        peso: s.peso,
        observaciones: s.observaciones,
      })),
    })),
    observaciones: a.observaciones,
  };
}
