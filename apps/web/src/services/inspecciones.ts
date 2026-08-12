import api from "./api";

// ─── Types ─────────────────────────────────────────────────

export type Cumplimiento = "CUMPLE" | "NO_CUMPLE" | "NO_APLICA";
export type Severidad = "LEVE" | "MODERADA" | "CRITICA";
export type Riesgo = "BAJO" | "MEDIO" | "ALTO";
export type EstadoInspeccion = "PENDIENTE" | "APROBADA" | "NO_CONFORME";
export type ResultadoInspeccion = "CONFORME" | "CONFORME_CON_OBSERVACIONES" | "NO_CONFORME";
export type EstadoNoConformidad = "PENDIENTE" | "EN_PROCESO" | "CORREGIDA" | "VERIFICADA";
export type EstadoAccionCorrectiva = "PENDIENTE" | "EN_PROCESO" | "COMPLETADA" | "VERIFICADA";
export type TipoEvento =
  | "programada"
  | "realizada"
  | "evidencias"
  | "observaciones"
  | "correctivas"
  | "verificacion"
  | "cierre";

export interface CriterioChecklist {
  id?: string;
  criterio: string;
  cumplimiento: Cumplimiento | null;
  riesgo: Riesgo;
  observacion: string;
  evidencia: string;
}

export interface NoConformidad {
  id?: string;
  codigo: string;
  tipo: string;
  categoria: string;
  descripcion: string;
  severidad: Severidad;
  responsable: string;
  fechaCompromiso: string;
  estado: EstadoNoConformidad;
  accionCorrectiva: string;
}

export interface AccionCorrectiva {
  id?: string;
  accion: string;
  responsable: string;
  fechaInicio: string;
  fechaLimite: string;
  estado: EstadoAccionCorrectiva;
  observaciones: string;
}

export interface Evidencia {
  id?: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  responsable: string;
  tipo: string;
  preview?: string;
}

export interface EventoHistorial {
  id?: string;
  fecha: string;
  titulo: string;
  descripcion: string;
  tipo: TipoEvento;
}

export interface Inspeccion {
  id: string;
  codigo: string;
  fecha: string;
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
  inspector: string;
  estado: EstadoInspeccion;
  resultado: ResultadoInspeccion | null;
  checklist: CriterioChecklist[];
  noConformidades: NoConformidad[];
  accionesCorrectivas: AccionCorrectiva[];
  evidencias: Evidencia[];
  latitud: string;
  longitud: string;
  altitud: string;
  precisionGps: string;
  observaciones: string;
  comentariosProductor: string;
  recomendaciones: string;
  prioridadRecomendacion: string;
  responsableRecomendacion: string;
  fechaRecomendacion: string;
  riesgoGeneral: Riesgo;
  resumenEjecutivo: string;
  fechaProximaInspeccion: string;
  nivelCumplimiento: string;
  historial: EventoHistorial[];
  createdAt: string;
  updatedAt: string;
}

// ─── DTO (API response shape) ──────────────────────────────

interface InspeccionDTO {
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
  inspector: string;
  estado: string;
  resultado: string | null;
  latitud: string | null;
  longitud: string | null;
  altitud: string | null;
  precision_gps: string | null;
  observaciones: string | null;
  comentarios_productor: string | null;
  recomendaciones: string | null;
  prioridad_recomendacion: string | null;
  responsable_recomendacion: string | null;
  fecha_recomendacion: string | null;
  riesgo_general: string;
  resumen_ejecutivo: string | null;
  fecha_proxima_inspeccion: string | null;
  nivel_cumplimiento: string | null;
  checklist: any[];
  no_conformidades: any[];
  acciones_correctivas: any[];
  evidencias: any[];
  historial: any[];
  created_at: string;
  updated_at: string;
}

// ─── Mapping ───────────────────────────────────────────────

function toFrontend(dto: InspeccionDTO): Inspeccion {
  return {
    id: dto.id,
    codigo: dto.codigo,
    fecha: dto.fecha?.split("T")[0] ?? "",
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
    inspector: dto.inspector,
    estado: dto.estado as EstadoInspeccion,
    resultado: (dto.resultado as ResultadoInspeccion) || null,
    checklist: (dto.checklist ?? []).map((c: any) => ({
      id: c.id, criterio: c.criterio, cumplimiento: c.cumplimiento,
      riesgo: c.riesgo, observacion: c.observacion ?? "", evidencia: c.evidencia ?? "",
    })),
    noConformidades: (dto.no_conformidades ?? []).map((nc: any) => ({
      id: nc.id, codigo: nc.codigo ?? "", tipo: nc.tipo, categoria: nc.categoria,
      descripcion: nc.descripcion, severidad: nc.severidad,
      responsable: nc.responsable, fechaCompromiso: nc.fecha_compromiso?.split("T")[0] ?? "",
      estado: nc.estado, accionCorrectiva: nc.accion_correctiva ?? "",
    })),
    accionesCorrectivas: (dto.acciones_correctivas ?? []).map((ac: any) => ({
      id: ac.id, accion: ac.accion, responsable: ac.responsable,
      fechaInicio: ac.fecha_inicio?.split("T")[0] ?? "",
      fechaLimite: ac.fecha_limite?.split("T")[0] ?? "",
      estado: ac.estado, observaciones: ac.observaciones ?? "",
    })),
    evidencias: (dto.evidencias ?? []).map((e: any) => ({
      id: e.id, nombre: e.nombre, descripcion: e.descripcion ?? "",
      fecha: e.fecha?.split("T")[0] ?? "", responsable: e.responsable ?? "",
      tipo: e.tipo ?? "",
    })),
    latitud: dto.latitud ?? "",
    longitud: dto.longitud ?? "",
    altitud: dto.altitud ?? "",
    precisionGps: dto.precision_gps ?? "",
    observaciones: dto.observaciones ?? "",
    comentariosProductor: dto.comentarios_productor ?? "",
    recomendaciones: dto.recomendaciones ?? "",
    prioridadRecomendacion: dto.prioridad_recomendacion ?? "",
    responsableRecomendacion: dto.responsable_recomendacion ?? "",
    fechaRecomendacion: dto.fecha_recomendacion?.split("T")[0] ?? "",
    riesgoGeneral: dto.riesgo_general as Riesgo,
    resumenEjecutivo: dto.resumen_ejecutivo ?? "",
    fechaProximaInspeccion: dto.fecha_proxima_inspeccion?.split("T")[0] ?? "",
    nivelCumplimiento: dto.nivel_cumplimiento ?? "",
    historial: (dto.historial ?? []).map((h: any) => ({
      id: h.id, fecha: h.fecha?.split("T")[0] ?? "",
      titulo: h.titulo, descripcion: h.descripcion ?? "", tipo: h.tipo,
    })),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<Inspeccion>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.campaniaId !== undefined) out.campania_id = data.campaniaId;
  if (data.productorId !== undefined) out.productor_id = data.productorId;
  if (data.parcelaId !== undefined) out.parcela_id = data.parcelaId;
  if (data.cultivoId !== undefined) out.cultivo_id = data.cultivoId || null;
  if (data.fecha !== undefined) out.fecha = data.fecha;
  if (data.inspector !== undefined) out.inspector = data.inspector;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.resultado !== undefined) out.resultado = data.resultado || null;
  if (data.latitud !== undefined) out.latitud = data.latitud || null;
  if (data.longitud !== undefined) out.longitud = data.longitud || null;
  if (data.altitud !== undefined) out.altitud = data.altitud || null;
  if (data.precisionGps !== undefined) out.precision_gps = data.precisionGps || null;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  if (data.comentariosProductor !== undefined) out.comentarios_productor = data.comentariosProductor || null;
  if (data.recomendaciones !== undefined) out.recomendaciones = data.recomendaciones || null;
  if (data.prioridadRecomendacion !== undefined) out.prioridad_recomendacion = data.prioridadRecomendacion || null;
  if (data.responsableRecomendacion !== undefined) out.responsable_recomendacion = data.responsableRecomendacion || null;
  if (data.fechaRecomendacion !== undefined) out.fecha_recomendacion = data.fechaRecomendacion || null;
  if (data.riesgoGeneral !== undefined) out.riesgo_general = data.riesgoGeneral;
  if (data.resumenEjecutivo !== undefined) out.resumen_ejecutivo = data.resumenEjecutivo || null;
  if (data.fechaProximaInspeccion !== undefined) out.fecha_proxima_inspeccion = data.fechaProximaInspeccion || null;
  if (data.nivelCumplimiento !== undefined) out.nivel_cumplimiento = data.nivelCumplimiento || null;
  if (data.checklist !== undefined) out.checklist = data.checklist.map((c) => ({
    criterio: c.criterio, cumplimiento: c.cumplimiento,
    riesgo: c.riesgo, observacion: c.observacion, evidencia: c.evidencia,
  }));
  if (data.noConformidades !== undefined) out.no_conformidades = data.noConformidades.map((nc) => ({
    codigo: nc.codigo, tipo: nc.tipo, categoria: nc.categoria,
    descripcion: nc.descripcion, severidad: nc.severidad,
    responsable: nc.responsable, fecha_compromiso: nc.fechaCompromiso || null,
    estado: nc.estado, accion_correctiva: nc.accionCorrectiva,
  }));
  if (data.accionesCorrectivas !== undefined) out.acciones_correctivas = data.accionesCorrectivas.map((ac) => ({
    accion: ac.accion, responsable: ac.responsable,
    fecha_inicio: ac.fechaInicio || null, fecha_limite: ac.fechaLimite || null,
    estado: ac.estado, observaciones: ac.observaciones,
  }));
  if (data.evidencias !== undefined) out.evidencias = data.evidencias.map((e) => ({
    nombre: e.nombre, descripcion: e.descripcion, tipo: e.tipo,
    ruta_archivo: e.preview || null, fecha: e.fecha || null, responsable: e.responsable,
  }));
  if (data.historial !== undefined) out.historial = data.historial.map((h) => ({
    titulo: h.titulo, descripcion: h.descripcion, tipo: h.tipo, fecha: h.fecha,
  }));
  return out;
}

// ─── API calls ─────────────────────────────────────────────

export interface InspeccionesQuery {
  search?: string;
  estado?: string;
  campania_id?: string;
  productor_id?: string;
  parcela_id?: string;
  page?: number;
  limit?: number;
}

export async function fetchInspecciones(params?: InspeccionesQuery): Promise<{ data: Inspeccion[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.campania_id) query.campania_id = params.campania_id;
  if (params?.productor_id) query.productor_id = params.productor_id;
  if (params?.parcela_id) query.parcela_id = params.parcela_id;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const res = await api.get("/inspecciones", { params: query });
  return {
    data: (res.data.data ?? []).map(toFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchInspeccion(id: string): Promise<Inspeccion> {
  const res = await api.get(`/inspecciones/${id}`);
  return toFrontend(res.data.data);
}

export async function createInspeccion(data: Partial<Inspeccion>): Promise<Inspeccion> {
  const res = await api.post("/inspecciones", toBackend(data));
  return toFrontend(res.data.data);
}

export async function updateInspeccion(id: string, data: Partial<Inspeccion>): Promise<Inspeccion> {
  const res = await api.put(`/inspecciones/${id}`, toBackend(data));
  return toFrontend(res.data.data);
}

export async function deleteInspeccion(id: string): Promise<void> {
  await api.delete(`/inspecciones/${id}`);
}

// ─── Helpers ───────────────────────────────────────────────

export function formatFecha(fecha?: string): string {
  if (!fecha) return "—";
  const parts = fecha.split("-");
  if (parts.length !== 3) return fecha;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// ─── Options ───────────────────────────────────────────────

export const campaniasOpciones: string[] = [];

export const productoresOpciones: string[] = [];

export const parcelasOpciones: string[] = [];

export const cultivosOpciones: string[] = [];

export const inspectoresOpciones: string[] = [];

export const estadosOpciones: EstadoInspeccion[] = ["PENDIENTE", "APROBADA", "NO_CONFORME"];

export const resultadosOpciones: ResultadoInspeccion[] = [
  "CONFORME",
  "CONFORME_CON_OBSERVACIONES",
  "NO_CONFORME",
];

export const severidadesOpciones: Severidad[] = ["LEVE", "MODERADA", "CRITICA"];

export const riesgosOpciones: Riesgo[] = ["BAJO", "MEDIO", "ALTO"];

export const prioridadesOpciones = ["Alta", "Media", "Baja"];

export const estadosNoConformidadOpciones: EstadoNoConformidad[] = [
  "PENDIENTE",
  "EN_PROCESO",
  "CORREGIDA",
  "VERIFICADA",
];

export const estadosAccionCorrectivaOpciones: EstadoAccionCorrectiva[] = [
  "PENDIENTE",
  "EN_PROCESO",
  "COMPLETADA",
  "VERIFICADA",
];

export const responsablesOpciones: string[] = [];

export const tiposNoConformidadOpciones = [
  "Uso de insumo no permitido",
  "Falta de registro",
  "Manejo de residuos",
  "Señalización",
  "Almacenamiento",
  "Barreras de protección",
  "Otro",
];

export const categoriasNoConformidadOpciones = [
  "Manejo de insumos",
  "Registros",
  "Infraestructura",
  "Manejo de residuos",
  "Sanidad vegetal",
  "Prácticas culturales",
  "Otro",
];

export const tiposEvidenciaOpciones = ["Fotografía", "Video", "Documento", "Georreferencia"];

export const criteriosChecklistOpciones = [
  "Uso de insumos permitidos",
  "Barreras de protección",
  "Manejo de residuos",
  "Registros actualizados",
  "Señalización",
  "Almacenamiento",
  "Control de plagas y enfermedades",
  "Prácticas de conservación de suelos",
];

export function crearChecklist(): CriterioChecklist[] {
  return criteriosChecklistOpciones.map((criterio) => ({
    criterio,
    cumplimiento: null,
    riesgo: "BAJO",
    observacion: "",
    evidencia: "",
  }));
}
