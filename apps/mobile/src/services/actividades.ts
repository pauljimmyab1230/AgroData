import api from "./api";

// ─── Types ─────────────────────────────────────────────────

export type EstadoActividad = "PROGRAMADA" | "EN_PROCESO" | "COMPLETADA";

export interface ActividadInsumo {
  id?: string;
  producto: string;
  categoria?: string;
  fabricante?: string;
  cantidad?: number | null;
  unidad?: string;
  lote?: string;
  costoUnitario?: number | null;
  costoTotal?: number | null;
  observaciones?: string;
}

export interface ActividadManoObra {
  id?: string;
  trabajador: string;
  funcion?: string;
  horas?: number | null;
  jornales?: number | null;
  costoJornal?: number | null;
  costoTotal?: number | null;
  observaciones?: string;
}

export interface ActividadMaquinaria {
  id?: string;
  equipo: string;
  operador?: string;
  horasUso?: number | null;
  costoHora?: number | null;
  costoTotal?: number | null;
  combustible?: number | null;
  observaciones?: string;
}

export interface Actividad {
  id: number;
  codigo: string;
  fecha: string;
  parcelaId: number;
  parcelaNombre: string;
  parcelaCodigo: string;
  cultivoId: number;
  cultivoNombre: string;
  cultivoCodigo: string;
  tipoActividad: string;
  descripcion: string;
  responsableTecnico: string;
  jornales: number;
  estado: EstadoActividad;
  observacionesTecnicas: string;
  recomendaciones: string;
  insumos: ActividadInsumo[];
  manoObra: ActividadManoObra[];
  maquinaria: ActividadMaquinaria[];
  costoTotalInsumos: number;
  costoTotalManoObra: number;
  costoTotalMaquinaria: number;
  costoTotal: number;
}

export interface ActividadesResponse {
  data: Actividad[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ActividadStats {
  total: number;
  programadas: number;
  enProceso: number;
  completadas: number;
}

// ─── Helpers ───────────────────────────────────────────────

function sanitize(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

// ─── Mapping ───────────────────────────────────────────────

function actividadToFrontend(dto: Record<string, unknown>): Actividad {
  const cultivo = dto.cultivo as Record<string, unknown> | undefined;
  const parcela = cultivo?.parcela as Record<string, unknown> | undefined;

  const rawInsumos = dto.insumos as Array<Record<string, unknown>> | undefined;
  const rawManoObra = dto.mano_obra as Array<Record<string, unknown>> | undefined;
  const rawMaquinaria = dto.maquinaria as Array<Record<string, unknown>> | undefined;

  const insumos = (rawInsumos ?? []).map((i) => ({
    id: sanitize(i.id) ?? undefined,
    producto: String(i.producto ?? ""),
    categoria: sanitize(i.categoria) ?? undefined,
    fabricante: sanitize(i.fabricante) ?? undefined,
    cantidad: i.cantidad != null ? Number(i.cantidad) : null,
    unidad: sanitize(i.unidad) ?? undefined,
    lote: sanitize(i.lote) ?? undefined,
    costoUnitario: i.costo_unitario != null ? Number(i.costo_unitario) : null,
    costoTotal: i.costo_total != null ? Number(i.costo_total) : null,
    observaciones: sanitize(i.observaciones) ?? undefined,
  }));

  const manoObra = (rawManoObra ?? []).map((m) => ({
    id: sanitize(m.id) ?? undefined,
    trabajador: String(m.trabajador ?? ""),
    funcion: sanitize(m.funcion) ?? undefined,
    horas: m.horas != null ? Number(m.horas) : null,
    jornales: m.jornales != null ? Number(m.jornales) : null,
    costoJornal: m.costo_jornal != null ? Number(m.costo_jornal) : null,
    costoTotal: m.costo_total != null ? Number(m.costo_total) : null,
    observaciones: sanitize(m.observaciones) ?? undefined,
  }));

  const maquinaria = (rawMaquinaria ?? []).map((m) => ({
    id: sanitize(m.id) ?? undefined,
    equipo: String(m.equipo ?? ""),
    operador: sanitize(m.operador) ?? undefined,
    horasUso: m.horas_uso != null ? Number(m.horas_uso) : null,
    costoHora: m.costo_hora != null ? Number(m.costo_hora) : null,
    costoTotal: m.costo_total != null ? Number(m.costo_total) : null,
    combustible: m.combustible != null ? Number(m.combustible) : null,
    observaciones: sanitize(m.observaciones) ?? undefined,
  }));

  const costoTotalInsumos = insumos.reduce((sum, i) => sum + (i.costoTotal ?? 0), 0);
  const costoTotalManoObra = manoObra.reduce((sum, m) => sum + (m.costoTotal ?? 0), 0);
  const costoTotalMaquinaria = maquinaria.reduce((sum, m) => sum + (m.costoTotal ?? 0), 0);

  return {
    id: Number(dto.id ?? 0),
    codigo: String(dto.codigo ?? ""),
    fecha: sanitize(dto.fecha)?.split("T")[0] ?? "",
    parcelaId: parcela?.id != null ? Number(parcela.id) : 0,
    parcelaNombre: String(parcela?.nombre ?? ""),
    parcelaCodigo: String(parcela?.codigo ?? ""),
    cultivoId: cultivo?.id != null ? Number(cultivo.id) : 0,
    cultivoNombre: String(cultivo?.cultivo ?? ""),
    cultivoCodigo: String(cultivo?.codigo ?? ""),
    tipoActividad: String(dto.tipo_actividad ?? ""),
    descripcion: sanitize(dto.descripcion) ?? "",
    responsableTecnico: String(dto.responsable_tecnico ?? ""),
    jornales: Number(dto.jornales ?? 0),
    estado: (dto.estado as EstadoActividad) ?? "PROGRAMADA",
    observacionesTecnicas: sanitize(dto.observaciones_tecnicas) ?? "",
    recomendaciones: sanitize(dto.recomendaciones) ?? "",
    insumos,
    manoObra,
    maquinaria,
    costoTotalInsumos,
    costoTotalManoObra,
    costoTotalMaquinaria,
    costoTotal: costoTotalInsumos + costoTotalManoObra + costoTotalMaquinaria,
  };
}

// ─── API Calls ─────────────────────────────────────────────

export async function fetchActividades(params?: {
  search?: string;
  estado?: string;
  tipo_actividad?: string;
  cultivo_id?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}): Promise<ActividadesResponse> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.tipo_actividad) query.tipo_actividad = params.tipo_actividad;
  if (params?.cultivo_id) query.cultivo_id = params.cultivo_id;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const res = await api.get("/actividades", { params: query, signal: params?.signal });
  return {
    data: (res.data.data ?? []).map(actividadToFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchActividad(id: number, signal?: AbortSignal): Promise<Actividad> {
  const res = await api.get(`/actividades/${id}`, { signal });
  return actividadToFrontend(res.data.data);
}

export async function fetchActividadStats(signal?: AbortSignal): Promise<ActividadStats> {
  const res = await api.get("/actividades/stats", { signal });
  const d = res.data.data;
  return {
    total: d?.total ?? 0,
    programadas: d?.estados?.PROGRAMADA ?? 0,
    enProceso: d?.estados?.EN_PROCESO ?? 0,
    completadas: d?.estados?.COMPLETADA ?? 0,
  };
}

function mapInsumosToBackend(insumos: ActividadInsumo[]): Record<string, unknown>[] {
  return insumos.map((i) => ({
    id: i.id,
    producto: i.producto,
    categoria: i.categoria || null,
    fabricante: i.fabricante || null,
    cantidad: i.cantidad,
    unidad: i.unidad || null,
    lote: i.lote || null,
    costo_unitario: i.costoUnitario,
    costo_total: i.costoTotal,
    observaciones: i.observaciones || null,
  }));
}

function mapManoObraToBackend(manoObra: ActividadManoObra[]): Record<string, unknown>[] {
  return manoObra.map((m) => ({
    id: m.id,
    trabajador: m.trabajador,
    funcion: m.funcion || null,
    horas: m.horas,
    jornales: m.jornales,
    costo_jornal: m.costoJornal,
    costo_total: m.costoTotal,
    observaciones: m.observaciones || null,
  }));
}

function mapMaquinariaToBackend(maquinaria: ActividadMaquinaria[]): Record<string, unknown>[] {
  return maquinaria.map((m) => ({
    id: m.id,
    equipo: m.equipo,
    operador: m.operador || null,
    horas_uso: m.horasUso,
    costo_hora: m.costoHora,
    costo_total: m.costoTotal,
    combustible: m.combustible,
    observaciones: m.observaciones || null,
  }));
}

export async function createActividad(data: Partial<Actividad>): Promise<Actividad> {
  const payload: Record<string, unknown> = {};
  if (data.fecha) payload.fecha = data.fecha.includes("T") ? data.fecha : `${data.fecha}T00:00:00.000Z`;
  if (data.cultivoId) payload.cultivo_id = data.cultivoId;
  if (data.tipoActividad) payload.tipo_actividad = data.tipoActividad;
  if (data.descripcion !== undefined) payload.descripcion = data.descripcion || null;
  if (data.responsableTecnico) payload.responsable_tecnico = data.responsableTecnico;
  if (data.estado) payload.estado = data.estado;
  if (data.observacionesTecnicas !== undefined) payload.observaciones_tecnicas = data.observacionesTecnicas || null;
  if (data.recomendaciones !== undefined) payload.recomendaciones = data.recomendaciones || null;
  if (data.insumos) payload.insumos = mapInsumosToBackend(data.insumos);
  if (data.manoObra) payload.mano_obra = mapManoObraToBackend(data.manoObra);
  if (data.maquinaria) payload.maquinaria = mapMaquinariaToBackend(data.maquinaria);

  const res = await api.post("/actividades", payload);
  return actividadToFrontend(res.data.data);
}

export async function updateActividad(id: number, data: Partial<Actividad>): Promise<Actividad> {
  const payload: Record<string, unknown> = {};
  if (data.fecha) payload.fecha = data.fecha.includes("T") ? data.fecha : `${data.fecha}T00:00:00.000Z`;
  if (data.cultivoId) payload.cultivo_id = data.cultivoId;
  if (data.tipoActividad) payload.tipo_actividad = data.tipoActividad;
  if (data.descripcion !== undefined) payload.descripcion = data.descripcion || null;
  if (data.responsableTecnico) payload.responsable_tecnico = data.responsableTecnico;
  if (data.estado) payload.estado = data.estado;
  if (data.observacionesTecnicas !== undefined) payload.observaciones_tecnicas = data.observacionesTecnicas || null;
  if (data.recomendaciones !== undefined) payload.recomendaciones = data.recomendaciones || null;
  if (data.insumos) payload.insumos = mapInsumosToBackend(data.insumos);
  if (data.manoObra) payload.mano_obra = mapManoObraToBackend(data.manoObra);
  if (data.maquinaria) payload.maquinaria = mapMaquinariaToBackend(data.maquinaria);

  const res = await api.put(`/actividades/${id}`, payload);
  return actividadToFrontend(res.data.data);
}

export async function deleteActividad(id: number): Promise<void> {
  await api.delete(`/actividades/${id}`);
}

// ─── Options ───────────────────────────────────────────────

export const tiposActividad = [
  { value: "PREPARACION_TERRENO", label: "Preparación del Terreno" },
  { value: "SIEMBRA", label: "Siembra" },
  { value: "RESIEMBRA", label: "Resiembra" },
  { value: "FERTILIZACION", label: "Fertilización" },
  { value: "COMPOSTAJE", label: "Compostaje" },
  { value: "APLICACION_BIOLES", label: "Aplicación de Bioles" },
  { value: "CONTROL_BIOLOGICO", label: "Control Biológico" },
  { value: "MANEJO_PLAGAS", label: "Manejo de Plagas" },
  { value: "MANEJO_ENFERMEDADES", label: "Manejo de Enfermedades" },
  { value: "DESHIERBIE", label: "Deshierbie" },
  { value: "RIEGO", label: "Riego" },
  { value: "PODA", label: "Poda" },
  { value: "APORQUE", label: "Aporque" },
  { value: "COSECHA", label: "Cosecha" },
  { value: "OTRA", label: "Otra" },
];

export const estadosActividad: EstadoActividad[] = ["PROGRAMADA", "EN_PROCESO", "COMPLETADA"];

export const estadoActividadLabels: Record<EstadoActividad, string> = {
  PROGRAMADA: "Programada",
  EN_PROCESO: "En Proceso",
  COMPLETADA: "Completada",
};
