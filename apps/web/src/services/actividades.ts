import api from "./api";

// ─── Types ─────────────────────────────────────────────────

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
  jornales?: number | null;
  horas?: number | null;
  observaciones?: string;
}

export interface ActividadMaquinaria {
  id?: string;
  equipo: string;
  operador?: string;
  horasUso?: number | null;
  combustible?: string | null;
  observaciones?: string;
}

export interface ActividadFoto {
  id?: string;
  titulo: string;
  descripcion?: string;
  rutaArchivo?: string;
  preview?: string;
  fecha?: string;
  responsable?: string;
}

export interface Actividad {
  id: string;
  codigo: string;
  campaniaId: string;
  campaniaNombre: string;
  campaniaCodigo: string;
  productorId: string;
  productorNombre: string;
  parcelaId: string;
  parcelaNombre: string;
  parcelaCodigo: string;
  cultivoId: string | null;
  cultivoNombre: string;
  cultivoCodigo: string;
  fecha: string;
  tipoActividad: string;
  descripcion: string;
  responsableTecnico: string;
  horaInicio: string;
  horaFin: string;
  duracionEstimada: string;
  prioridad: string;
  estado: string;
  jornales: number;
  latitud: string;
  longitud: string;
  altitud: string;
  precisionGps: string;
  observacionesTecnicas: string;
  recomendaciones: string;
  objetivo: string;
  resultado: string;
  proximaActividad: string;
  insumos: ActividadInsumo[];
  manoObra: ActividadManoObra[];
  maquinaria: ActividadMaquinaria[];
  fotos: ActividadFoto[];
  createdAt: string;
  updatedAt: string;
}

interface ActividadDTO {
  id: string;
  codigo: string;
  campania_id: string;
  campania: { id: string; nombre: string; codigo: string };
  productor_id: string;
  productor: { id: string; nombres: string; apellido_paterno: string; apellido_materno: string };
  parcela_id: string;
  parcela: { id: string; nombre: string; codigo: string };
  cultivo_id: string | null;
  cultivo: { id: string; cultivo: string; codigo: string } | null;
  fecha: string;
  tipo_actividad: string;
  descripcion: string | null;
  responsable_tecnico: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  duracion_estimada: string | null;
  prioridad: string;
  estado: string;
  jornales: number;
  latitud: string | null;
  longitud: string | null;
  altitud: string | null;
  precision_gps: string | null;
  observaciones_tecnicas: string | null;
  recomendaciones: string | null;
  objetivo: string | null;
  resultado: string | null;
  proxima_actividad: string | null;
  insumos: any[];
  mano_obra: any[];
  maquinaria: any[];
  fotos: any[];
  created_at: string;
  updated_at: string;
}

function toFrontend(dto: ActividadDTO): Actividad {
  return {
    id: dto.id,
    codigo: dto.codigo,
    campaniaId: dto.campania_id,
    campaniaNombre: dto.campania?.nombre ?? "",
    campaniaCodigo: dto.campania?.codigo ?? "",
    productorId: dto.productor_id,
    productorNombre: `${dto.productor?.nombres ?? ""} ${dto.productor?.apellido_paterno ?? ""} ${dto.productor?.apellido_materno ?? ""}`.trim(),
    parcelaId: dto.parcela_id,
    parcelaNombre: dto.parcela?.nombre ?? "",
    parcelaCodigo: dto.parcela?.codigo ?? "",
    cultivoId: dto.cultivo_id,
    cultivoNombre: dto.cultivo?.cultivo ?? "",
    cultivoCodigo: dto.cultivo?.codigo ?? "",
    fecha: dto.fecha?.split("T")[0] ?? "",
    tipoActividad: dto.tipo_actividad,
    descripcion: dto.descripcion ?? "",
    responsableTecnico: dto.responsable_tecnico,
    horaInicio: dto.hora_inicio ?? "",
    horaFin: dto.hora_fin ?? "",
    duracionEstimada: dto.duracion_estimada ?? "",
    prioridad: dto.prioridad,
    estado: dto.estado,
    jornales: Number(dto.jornales) || 0,
    latitud: dto.latitud ?? "",
    longitud: dto.longitud ?? "",
    altitud: dto.altitud ?? "",
    precisionGps: dto.precision_gps ?? "",
    observacionesTecnicas: dto.observaciones_tecnicas ?? "",
    recomendaciones: dto.recomendaciones ?? "",
    objetivo: dto.objetivo ?? "",
    resultado: dto.resultado ?? "",
    proximaActividad: dto.proxima_actividad ?? "",
    insumos: (dto.insumos ?? []).map((i) => ({
      id: i.id, producto: i.producto, categoria: i.categoria, fabricante: i.fabricante,
      cantidad: i.cantidad, unidad: i.unidad, lote: i.lote,
      costoUnitario: i.costo_unitario, costoTotal: i.costo_total, observaciones: i.observaciones,
    })),
    manoObra: (dto.mano_obra ?? []).map((m) => ({
      id: m.id, trabajador: m.trabajador, funcion: m.funcion,
      jornales: m.jornales, horas: m.horas, observaciones: m.observaciones,
    })),
    maquinaria: (dto.maquinaria ?? []).map((m) => ({
      id: m.id, equipo: m.equipo, operador: m.operador,
      horasUso: m.horas_uso, combustible: m.combustible, observaciones: m.observaciones,
    })),
    fotos: (dto.fotos ?? []).map((f) => ({
      id: f.id, titulo: f.titulo, descripcion: f.descripcion,
      rutaArchivo: f.ruta_archivo, fecha: f.fecha?.split("T")[0], responsable: f.responsable,
    })),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<Actividad>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.campaniaId !== undefined) out.campania_id = data.campaniaId;
  if (data.productorId !== undefined) out.productor_id = data.productorId;
  if (data.parcelaId !== undefined) out.parcela_id = data.parcelaId;
  if (data.cultivoId !== undefined) out.cultivo_id = data.cultivoId || null;
  if (data.fecha !== undefined) out.fecha = data.fecha;
  if (data.tipoActividad !== undefined) out.tipo_actividad = data.tipoActividad;
  if (data.descripcion !== undefined) out.descripcion = data.descripcion || null;
  if (data.responsableTecnico !== undefined) out.responsable_tecnico = data.responsableTecnico;
  if (data.horaInicio !== undefined) out.hora_inicio = data.horaInicio || null;
  if (data.horaFin !== undefined) out.hora_fin = data.horaFin || null;
  if (data.duracionEstimada !== undefined) out.duracion_estimada = data.duracionEstimada || null;
  if (data.prioridad !== undefined) out.prioridad = data.prioridad;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.jornales !== undefined) out.jornales = data.jornales;
  if (data.latitud !== undefined) out.latitud = data.latitud || null;
  if (data.longitud !== undefined) out.longitud = data.longitud || null;
  if (data.altitud !== undefined) out.altitud = data.altitud || null;
  if (data.precisionGps !== undefined) out.precision_gps = data.precisionGps || null;
  if (data.observacionesTecnicas !== undefined) out.observaciones_tecnicas = data.observacionesTecnicas || null;
  if (data.recomendaciones !== undefined) out.recomendaciones = data.recomendaciones || null;
  if (data.objetivo !== undefined) out.objetivo = data.objetivo || null;
  if (data.resultado !== undefined) out.resultado = data.resultado || null;
  if (data.proximaActividad !== undefined) out.proxima_actividad = data.proximaActividad || null;
  if (data.insumos !== undefined) out.insumos = data.insumos;
  if (data.manoObra !== undefined) out.mano_obra = data.manoObra;
  if (data.maquinaria !== undefined) out.maquinaria = data.maquinaria;
  return out;
}

// ─── API calls ─────────────────────────────────────────────

export interface ActividadesQuery {
  search?: string;
  estado?: string;
  tipo_actividad?: string;
  campania_id?: string;
  productor_id?: string;
  parcela_id?: string;
  page?: number;
  limit?: number;
}

export async function fetchActividades(params?: ActividadesQuery): Promise<{ data: Actividad[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.tipo_actividad) query.tipo_actividad = params.tipo_actividad;
  if (params?.campania_id) query.campania_id = params.campania_id;
  if (params?.productor_id) query.productor_id = params.productor_id;
  if (params?.parcela_id) query.parcela_id = params.parcela_id;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const res = await api.get("/actividades", { params: query });
  return {
    data: (res.data.data ?? []).map(toFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchActividad(id: string): Promise<Actividad> {
  const res = await api.get(`/actividades/${id}`);
  return toFrontend(res.data.data);
}

export async function createActividad(data: Partial<Actividad>): Promise<Actividad> {
  const res = await api.post("/actividades", toBackend(data));
  return toFrontend(res.data.data);
}

export async function updateActividad(id: string, data: Partial<Actividad>): Promise<Actividad> {
  const res = await api.put(`/actividades/${id}`, toBackend(data));
  return toFrontend(res.data.data);
}

export async function deleteActividad(id: string): Promise<void> {
  await api.delete(`/actividades/${id}`);
}

// ─── Form helpers ──────────────────────────────────────────

export type ActividadFormData = {
  codigo: string;
  fecha: string;
  campania: string;
  productor: string;
  parcela: string;
  cultivo: string;
  responsableTecnico: string;
  tipoActividad: string;
  descripcion: string;
  horaInicio: string;
  horaFin: string;
  duracionEstimada: string;
  prioridad: string;
  estado: string;
  jornales: string;
  insumos: ActividadInsumo[];
  manoObra: ActividadManoObra[];
  maquinaria: ActividadMaquinaria[];
  fotos: ActividadFoto[];
  latitud: string;
  longitud: string;
  altitud: string;
  precisionGps: string;
  observacionesTecnicas: string;
  recomendaciones: string;
  objetivo: string;
  resultado: string;
  proximaActividad: string;
};

export function actividadToFormData(a: Actividad): ActividadFormData {
  return {
    codigo: a.codigo,
    fecha: a.fecha,
    campania: a.campaniaNombre,
    productor: a.productorNombre,
    parcela: a.parcelaNombre,
    cultivo: a.cultivoNombre,
    responsableTecnico: a.responsableTecnico,
    tipoActividad: a.tipoActividad,
    descripcion: a.descripcion,
    horaInicio: a.horaInicio,
    horaFin: a.horaFin,
    duracionEstimada: a.duracionEstimada,
    prioridad: a.prioridad,
    estado: a.estado,
    jornales: String(a.jornales),
    insumos: a.insumos,
    manoObra: a.manoObra,
    maquinaria: a.maquinaria,
    fotos: a.fotos,
    latitud: a.latitud,
    longitud: a.longitud,
    altitud: a.altitud,
    precisionGps: a.precisionGps,
    observacionesTecnicas: a.observacionesTecnicas,
    recomendaciones: a.recomendaciones,
    objetivo: a.objetivo,
    resultado: a.resultado,
    proximaActividad: a.proximaActividad,
  };
}

export const emptyActividad: ActividadFormData = {
  codigo: "",
  fecha: "",
  campania: "",
  productor: "",
  parcela: "",
  cultivo: "",
  responsableTecnico: "",
  tipoActividad: "",
  descripcion: "",
  horaInicio: "",
  horaFin: "",
  duracionEstimada: "",
  prioridad: "MEDIA",
  estado: "PROGRAMADA",
  jornales: "",
  insumos: [],
  manoObra: [],
  maquinaria: [],
  fotos: [],
  latitud: "",
  longitud: "",
  altitud: "",
  precisionGps: "",
  observacionesTecnicas: "",
  recomendaciones: "",
  objetivo: "",
  resultado: "",
  proximaActividad: "",
};

export function formatearFecha(fecha?: string): string {
  if (!fecha) return "—";
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}

export function obtenerSiguienteCodigo(total: number): string {
  return `ACT-${new Date().getFullYear()}-${String(total + 1).padStart(3, "0")}`;
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

export const prioridades = ["ALTA", "MEDIA", "BAJA"];
export const estadosActividad = ["PROGRAMADA", "EN_PROCESO", "COMPLETADA"];

export const prioridadLabels: Record<string, string> = {
  ALTA: "Alta",
  MEDIA: "Media",
  BAJA: "Baja",
};

export const estadoLabels: Record<string, string> = {
  PROGRAMADA: "Programada",
  EN_PROCESO: "En Proceso",
  COMPLETADA: "Completada",
};

export const tipoActividadLabels: Record<string, string> = Object.fromEntries(
  tiposActividad.map((t) => [t.value, t.label])
);
