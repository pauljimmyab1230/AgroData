import api from "./api";

export interface Campania {
  id: number;
  codigo: string;
  nombre: string;
  anioAgricola: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  estado: string;
  responsable: string;
  tecnicoCoordinador: string;
  objetivo: string;
  permitirCultivos: boolean;
  permitirActividades: boolean;
  permitirCosechas: boolean;
  permitirInspecciones: boolean;
  permitirAcopio: boolean;
  permitirProcesamiento: boolean;
  visible: boolean;
  activa: boolean;
  observaciones: string;
  createdAt: string;
  updatedAt: string;
}

interface CampaniaDTO {
  id: number;
  codigo: string;
  nombre: string;
  anio_agricola: string;
  fecha_inicio: string;
  fecha_fin: string;
  descripcion: string | null;
  estado: string;
  responsable: string;
  tecnico_coordinador: string;
  objetivo: string | null;
  permitir_cultivos: boolean;
  permitir_actividades: boolean;
  permitir_cosechas: boolean;
  permitir_inspecciones: boolean;
  permitir_acopio: boolean;
  permitir_procesamiento: boolean;
  visible: boolean;
  activa: boolean;
  observaciones: string | null;
  created_at: string;
  updated_at: string;
}

function toFrontend(dto: CampaniaDTO): Campania {
  return {
    id: dto.id,
    codigo: dto.codigo,
    nombre: dto.nombre,
    anioAgricola: dto.anio_agricola,
    fechaInicio: dto.fecha_inicio?.split("T")[0] ?? "",
    fechaFin: dto.fecha_fin?.split("T")[0] ?? "",
    descripcion: dto.descripcion ?? "",
    estado: dto.estado,
    responsable: dto.responsable,
    tecnicoCoordinador: dto.tecnico_coordinador,
    objetivo: dto.objetivo ?? "",
    permitirCultivos: dto.permitir_cultivos,
    permitirActividades: dto.permitir_actividades,
    permitirCosechas: dto.permitir_cosechas,
    permitirInspecciones: dto.permitir_inspecciones,
    permitirAcopio: dto.permitir_acopio,
    permitirProcesamiento: dto.permitir_procesamiento,
    visible: dto.visible,
    activa: dto.activa,
    observaciones: dto.observaciones ?? "",
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<Campania | CampaniaFormData>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.nombre !== undefined) out.nombre = data.nombre;
  if ("anioAgricola" in data && data.anioAgricola !== undefined) out.anio_agricola = data.anioAgricola;
  if ("fechaInicio" in data && data.fechaInicio !== undefined) out.fecha_inicio = data.fechaInicio || null;
  if ("fechaFin" in data && data.fechaFin !== undefined) out.fecha_fin = data.fechaFin || null;
  if (data.descripcion !== undefined) out.descripcion = data.descripcion || null;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.responsable !== undefined) out.responsable = data.responsable;
  if ("tecnicoCoordinador" in data && (data as any).tecnicoCoordinador !== undefined) out.tecnico_coordinador = (data as any).tecnicoCoordinador;
  if (data.objetivo !== undefined) out.objetivo = data.objetivo || null;
  if ("permitirCultivos" in data && (data as any).permitirCultivos !== undefined) out.permitir_cultivos = (data as any).permitirCultivos;
  if ("permitirActividades" in data && (data as any).permitirActividades !== undefined) out.permitir_actividades = (data as any).permitirActividades;
  if ("permitirCosechas" in data && (data as any).permitirCosechas !== undefined) out.permitir_cosechas = (data as any).permitirCosechas;
  if ("permitirInspecciones" in data && (data as any).permitirInspecciones !== undefined) out.permitir_inspecciones = (data as any).permitirInspecciones;
  if ("permitirAcopio" in data && (data as any).permitirAcopio !== undefined) out.permitir_acopio = (data as any).permitirAcopio;
  if ("permitirProcesamiento" in data && (data as any).permitirProcesamiento !== undefined) out.permitir_procesamiento = (data as any).permitirProcesamiento;
  if (data.visible !== undefined) out.visible = data.visible;
  if (data.activa !== undefined) out.activa = data.activa;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  return out;
}

// ─── Types ─────────────────────────────────────────────────

export interface CampaniaFormData {
  codigo: string;
  nombre: string;
  anioAgricola: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  estado: string;
  responsable: string;
  tecnicoCoordinador: string;
  objetivo: string;
  permitirCultivos: boolean;
  permitirActividades: boolean;
  permitirCosechas: boolean;
  permitirInspecciones: boolean;
  permitirAcopio: boolean;
  permitirProcesamiento: boolean;
  visible: boolean;
  activa: boolean;
  observaciones: string;
}

export const campaniaEstados = ["PLANIFICADA", "ACTIVA", "FINALIZADA", "CANCELADA"] as const;

export interface CampaniasQuery {
  search?: string;
  estado?: string;
  anioAgricola?: string;
  page?: number;
  limit?: number;
}

export async function fetchCampanias(params?: CampaniasQuery): Promise<{ data: Campania[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.anioAgricola) query.anio_agricola = params.anioAgricola;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const res = await api.get("/campanias", { params: query });
  return {
    data: (res.data.data ?? []).map(toFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchCampania(id: number): Promise<Campania> {
  const res = await api.get(`/campanias/${id}`);
  return toFrontend(res.data.data);
}

export async function createCampania(data: Partial<CampaniaFormData>): Promise<Campania> {
  const res = await api.post("/campanias", toBackend(data));
  return toFrontend(res.data.data);
}

export async function updateCampania(id: number, data: Partial<CampaniaFormData>): Promise<Campania> {
  const res = await api.patch(`/campanias/${id}`, toBackend(data));
  return toFrontend(res.data.data);
}

export async function deleteCampania(id: number): Promise<void> {
  await api.delete(`/campanias/${id}`);
}

// ─── Stats ─────────────────────────────────────────────────

export interface CampaniaStats {
  parcelas: number;
  cultivos: number;
  areaSembrada: number;
  actividades: number;
  inspecciones: number;
  acopios: number;
  cultivosPorTipo: Record<string, number>;
}

export async function fetchCampaniaStats(id: number): Promise<CampaniaStats> {
  const res = await api.get(`/campanias/${id}/stats`);
  return res.data.data;
}

// ─── Global Stats ─────────────────────────────────────────

export interface CampaniaGlobalStats {
  total: number;
  estados: Record<string, number>;
}

export async function fetchCampaniaGlobalStats(params?: {
  search?: string;
  estado?: string;
  anioAgricola?: string;
}): Promise<CampaniaGlobalStats> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.anioAgricola) query.anio_agricola = params.anioAgricola;

  const res = await api.get("/campanias/stats", { params: query });
  return res.data.data;
}

// ─── Timeline ──────────────────────────────────────────────

export interface TimelineEvent {
  id: string;
  tipo: "cultivo" | "actividad" | "inspeccion" | "acopio";
  titulo: string;
  descripcion: string;
  fecha: string;
}

export async function fetchCampaniaTimeline(id: number): Promise<TimelineEvent[]> {
  const res = await api.get(`/campanias/${id}/timeline`);
  return res.data.data;
}
