import api from "./api";

// ─── Types ─────────────────────────────────────────────────

export type EstadoCampania = "PLANIFICADA" | "ACTIVA" | "FINALIZADA" | "CANCELADA";

export const campaniaEstados: readonly EstadoCampania[] = ["PLANIFICADA", "ACTIVA", "FINALIZADA", "CANCELADA"];

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

export interface Campania {
  id: number;
  codigo: string;
  nombre: string;
  anioAgricola: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  estado: EstadoCampania;
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
  activo: boolean;
  createdBy: string | null;
  updatedBy: string | null;
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
  estado: EstadoCampania;
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
  activo: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaniasQuery {
  search?: string;
  estado?: EstadoCampania;
  anioAgricola?: string;
  responsable?: string;
  page?: number;
  limit?: number;
}

export interface CampaniaStats {
  productores: number;
  parcelas: number;
  cultivos: number;
  areaSembrada: number;
  actividades: number;
  inspecciones: number;
  acopios: number;
  cultivosPorTipo: Record<string, number>;
}

export interface CampaniaGlobalStats {
  total: number;
  estados: Record<EstadoCampania, number>;
}

export interface TimelineEvent {
  id: string;
  tipo: "cultivo" | "actividad" | "inspeccion" | "acopio";
  titulo: string;
  descripcion: string;
  fecha: string;
}

// ─── Mappers ───────────────────────────────────────────────

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
    activo: dto.activo,
    createdBy: dto.created_by,
    updatedBy: dto.updated_by,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<Campania | CampaniaFormData>): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.nombre !== undefined) out.nombre = data.nombre;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.responsable !== undefined) out.responsable = data.responsable;
  if (data.objetivo !== undefined) out.objetivo = data.objetivo || null;
  if (data.visible !== undefined) out.visible = data.visible;
  if (data.activa !== undefined) out.activa = data.activa;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  if (data.descripcion !== undefined) out.descripcion = data.descripcion || null;

  const f = data as CampaniaFormData;
  if (f.anioAgricola !== undefined) out.anio_agricola = f.anioAgricola;
  if (f.fechaInicio !== undefined) out.fecha_inicio = f.fechaInicio || null;
  if (f.fechaFin !== undefined) out.fecha_fin = f.fechaFin || null;
  if (f.tecnicoCoordinador !== undefined) out.tecnico_coordinador = f.tecnicoCoordinador;
  if (f.permitirCultivos !== undefined) out.permitir_cultivos = f.permitirCultivos;
  if (f.permitirActividades !== undefined) out.permitir_actividades = f.permitirActividades;
  if (f.permitirCosechas !== undefined) out.permitir_cosechas = f.permitirCosechas;
  if (f.permitirInspecciones !== undefined) out.permitir_inspecciones = f.permitirInspecciones;
  if (f.permitirAcopio !== undefined) out.permitir_acopio = f.permitirAcopio;
  if (f.permitirProcesamiento !== undefined) out.permitir_procesamiento = f.permitirProcesamiento;

  return out;
}

// ─── API Calls ─────────────────────────────────────────────

export async function fetchCampanias(params?: CampaniasQuery): Promise<{
  data: Campania[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.anioAgricola) query.anio_agricola = params.anioAgricola;
  if (params?.responsable) query.responsable = params.responsable;
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

export async function fetchCampaniaStats(id: number): Promise<CampaniaStats> {
  const res = await api.get(`/campanias/${id}/stats`);
  return res.data.data;
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

export async function fetchCampaniaTimeline(id: number): Promise<TimelineEvent[]> {
  const res = await api.get(`/campanias/${id}/timeline`);
  return res.data.data;
}
