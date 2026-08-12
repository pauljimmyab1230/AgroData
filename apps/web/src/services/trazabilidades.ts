import api from "./api";

export interface EventoTrazabilidad {
  id?: string;
  tipo: string;
  fecha: string;
  lugar: string;
  responsable: string;
  descripcion: string;
  evidencia: string;
}

export interface Trazabilidad {
  id: string;
  codigo: string;
  loteId: string;
  loteCodigo: string;
  producto: string;
  cultivo: string;
  origen: string;
  productor: string;
  parcela: string;
  comunidad: string;
  fechaSiembra: string;
  fechaCosecha: string;
  fechaProcesamiento: string;
  pesoTotal: number;
  unidad: string;
  calidad: string;
  certificacion: string;
  destino: string;
  estado: string;
  observaciones: string;
  eventos: EventoTrazabilidad[];
  createdAt: string;
  updatedAt: string;
}

interface TrazabilidadDTO {
  id: string;
  codigo: string;
  lote_id: string;
  lote: { id: string; codigo: string } | null;
  producto: string;
  cultivo: string;
  origen: string;
  productor: string;
  parcela: string | null;
  comunidad: string | null;
  fecha_siembra: string | null;
  fecha_cosecha: string | null;
  fecha_procesamiento: string | null;
  peso_total: number;
  unidad: string;
  calidad: string | null;
  certificacion: string | null;
  destino: string | null;
  estado: string;
  observaciones: string | null;
  eventos: Array<{ id: string; tipo: string; fecha: string; lugar: string | null; responsable: string; descripcion: string | null; evidencia: string | null }>;
  created_at: string;
  updated_at: string;
}

function toFrontend(dto: TrazabilidadDTO): Trazabilidad {
  return {
    id: dto.id,
    codigo: dto.codigo,
    loteId: dto.lote_id,
    loteCodigo: dto.lote?.codigo ?? "",
    producto: dto.producto,
    cultivo: dto.cultivo,
    origen: dto.origen,
    productor: dto.productor,
    parcela: dto.parcela ?? "",
    comunidad: dto.comunidad ?? "",
    fechaSiembra: dto.fecha_siembra?.split("T")[0] ?? "",
    fechaCosecha: dto.fecha_cosecha?.split("T")[0] ?? "",
    fechaProcesamiento: dto.fecha_procesamiento?.split("T")[0] ?? "",
    pesoTotal: Number(dto.peso_total) || 0,
    unidad: dto.unidad,
    calidad: dto.calidad ?? "",
    certificacion: dto.certificacion ?? "",
    destino: dto.destino ?? "",
    estado: dto.estado,
    observaciones: dto.observaciones ?? "",
    eventos: (dto.eventos ?? []).map(e => ({
      id: e.id,
      tipo: e.tipo,
      fecha: e.fecha,
      lugar: e.lugar ?? "",
      responsable: e.responsable,
      descripcion: e.descripcion ?? "",
      evidencia: e.evidencia ?? "",
    })),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<Trazabilidad>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.loteId !== undefined) out.lote_id = data.loteId;
  if (data.producto !== undefined) out.producto = data.producto;
  if (data.cultivo !== undefined) out.cultivo = data.cultivo;
  if (data.origen !== undefined) out.origen = data.origen;
  if (data.productor !== undefined) out.productor = data.productor;
  if (data.parcela !== undefined) out.parcela = data.parcela || null;
  if (data.comunidad !== undefined) out.comunidad = data.comunidad || null;
  if (data.fechaSiembra !== undefined) out.fecha_siembra = data.fechaSiembra || null;
  if (data.fechaCosecha !== undefined) out.fecha_cosecha = data.fechaCosecha || null;
  if (data.fechaProcesamiento !== undefined) out.fecha_procesamiento = data.fechaProcesamiento || null;
  if (data.pesoTotal !== undefined) out.peso_total = data.pesoTotal;
  if (data.unidad !== undefined) out.unidad = data.unidad;
  if (data.calidad !== undefined) out.calidad = data.calidad || null;
  if (data.certificacion !== undefined) out.certificacion = data.certificacion || null;
  if (data.destino !== undefined) out.destino = data.destino || null;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  if (data.eventos !== undefined) out.eventos = data.eventos;
  return out;
}

// ─── Types ─────────────────────────────────────────────────

export interface TrazabilidadFormData {
  codigo: string;
  loteId: string;
  producto: string;
  cultivo: string;
  origen: string;
  productor: string;
  parcela: string;
  comunidad: string;
  fechaSiembra: string;
  fechaCosecha: string;
  fechaProcesamiento: string;
  pesoTotal: number;
  unidad: string;
  calidad: string;
  certificacion: string;
  destino: string;
  estado: string;
  observaciones: string;
  eventos: EventoTrazabilidad[];
}

export const emptyTrazabilidadForm: TrazabilidadFormData = {
  codigo: "",
  loteId: "",
  producto: "",
  cultivo: "",
  origen: "",
  productor: "",
  parcela: "",
  comunidad: "",
  fechaSiembra: "",
  fechaCosecha: "",
  fechaProcesamiento: "",
  pesoTotal: 0,
  unidad: "KG",
  calidad: "",
  certificacion: "",
  destino: "",
  estado: "EN_PROCESO",
  observaciones: "",
  eventos: [],
};

export const trazabilidadEstados = ["EN_PROCESO", "COMPLETADO", "PENDIENTE_VERIFICACION"] as const;
export const trazabilidadEventos = ["SIEMBRA", "COSECHA", "RECEPCION", "PROCESAMIENTO", "EMPAQUE", "ENVIO"] as const;

export interface TrazabilidadesQuery {
  search?: string;
  estado?: string;
  lote_id?: string;
  cultivo?: string;
  origen?: string;
  certificacion?: string;
  page?: number;
  limit?: number;
}

export async function fetchTrazabilidades(params?: TrazabilidadesQuery): Promise<{ data: Trazabilidad[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.lote_id) query.lote_id = params.lote_id;
  if (params?.cultivo) query.cultivo = params.cultivo;
  if (params?.origen) query.origen = params.origen;
  if (params?.certificacion) query.certificacion = params.certificacion;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const res = await api.get("/trazabilidades", { params: query });
  return {
    data: (res.data.data ?? []).map(toFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchTrazabilidad(id: string): Promise<Trazabilidad> {
  const res = await api.get(`/trazabilidades/${id}`);
  return toFrontend(res.data.data);
}

export async function createTrazabilidad(data: Partial<Trazabilidad>): Promise<Trazabilidad> {
  const res = await api.post("/trazabilidades", toBackend(data));
  return toFrontend(res.data.data);
}

export async function updateTrazabilidad(id: string, data: Partial<Trazabilidad>): Promise<Trazabilidad> {
  const res = await api.put(`/trazabilidades/${id}`, toBackend(data));
  return toFrontend(res.data.data);
}

export async function deleteTrazabilidad(id: string): Promise<void> {
  await api.delete(`/trazabilidades/${id}`);
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
