import api from "./api";

// ─── Types ─────────────────────────────────────────────────

export type Cumplimiento = "CUMPLE" | "NO_CUMPLE" | "NO_APLICA";
export type Severidad = "LEVE" | "MODERADA" | "CRITICA";
export type Riesgo = "BAJO" | "MEDIO" | "ALTO";
export type EstadoInspeccion = "PENDIENTE" | "APROBADA" | "NO_CONFORME";
export type ResultadoInspeccion = "CONFORME" | "CONFORME_CON_OBSERVACIONES" | "NO_CONFORME";
export type EstadoNoConformidad = "PENDIENTE" | "EN_PROCESO" | "CORREGIDA" | "VERIFICADA";
export type EstadoAccionCorrectiva = "PENDIENTE" | "EN_PROCESO" | "COMPLETADA" | "VERIFICADA";

export interface CriterioChecklist {
  id?: number;
  criterio: string;
  cumplimiento: Cumplimiento | null;
  riesgo: Riesgo;
  observacion: string;
  evidencia: string;
}

export interface AccionCorrectiva {
  id?: number;
  accion: string;
  responsable: string;
  fechaInicio: string;
  fechaLimite: string;
  estado: EstadoAccionCorrectiva;
  observaciones: string;
}

export interface NoConformidad {
  id?: number;
  codigo: string;
  tipo: string;
  categoria: string;
  descripcion: string;
  severidad: Severidad;
  responsable: string;
  fechaCompromiso: string;
  estado: EstadoNoConformidad;
  accionCorrectiva: string;
  acciones: AccionCorrectiva[];
}

export interface Evidencia {
  id?: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  responsable: string;
  tipo: string;
  rutaArchivo: string;
}

export interface Inspeccion {
  id: number;
  codigo: string;
  fecha: string;
  cultivoId: number;
  cultivo?: {
    id: number;
    cultivo: string;
    codigo: string;
    campania: { id: number; nombre: string; codigo: string };
    parcela: {
      id: number;
      nombre: string;
      codigo: string;
      productor: { id: number; nombres: string; apellidoPaterno: string; apellidoMaterno: string; codigo: string };
    };
  };
  inspector: string;
  estado: EstadoInspeccion;
  resultado: ResultadoInspeccion | null;
  checklist: CriterioChecklist[];
  noConformidades: NoConformidad[];
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
}

export interface InspeccionesResponse {
  data: Inspeccion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InspeccionStats {
  total: number;
  pendientes: number;
  aprobadas: number;
  noConformes: number;
}

// ─── Helpers ───────────────────────────────────────────────

function sanitizeStringOrNull(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

function formatDateToISO(dateStr: string | undefined | null): string | undefined {
  if (!dateStr) return undefined;
  if (dateStr.includes('T')) return dateStr;
  return `${dateStr}T00:00:00.000Z`;
}

// ─── Mapping ───────────────────────────────────────────────

function inspeccionToFrontend(dto: Record<string, unknown>): Inspeccion {
  const cultivo = dto.cultivo as Record<string, unknown> | undefined;
  const campania = cultivo?.campania as Record<string, unknown> | undefined;
  const parcela = cultivo?.parcela as Record<string, unknown> | undefined;
  const productor = parcela?.productor as Record<string, unknown> | undefined;

  const rawChecklist = dto.checklist as Array<Record<string, unknown>> | undefined;
  const rawNoConformidades = dto.no_conformidades as Array<Record<string, unknown>> | undefined;
  const rawEvidencias = dto.evidencias as Array<Record<string, unknown>> | undefined;

  return {
    id: Number(dto.id ?? 0),
    codigo: String(dto.codigo ?? ""),
    fecha: sanitizeStringOrNull(dto.fecha)?.split("T")[0] ?? "",
    cultivoId: Number(dto.cultivo_id ?? 0),
    cultivo: cultivo ? {
      id: Number(cultivo.id ?? 0),
      cultivo: String(cultivo.cultivo ?? ""),
      codigo: String(cultivo.codigo ?? ""),
      campania: campania ? { id: Number(campania.id ?? 0), nombre: String(campania.nombre ?? ""), codigo: String(campania.codigo ?? "") } : { id: 0, nombre: "", codigo: "" },
      parcela: parcela ? {
        id: Number(parcela.id ?? 0),
        nombre: String(parcela.nombre ?? ""),
        codigo: String(parcela.codigo ?? ""),
        productor: productor ? {
          id: Number(productor.id ?? 0),
          nombres: String(productor.nombres ?? ""),
          apellidoPaterno: String(productor.apellido_paterno ?? ""),
          apellidoMaterno: String(productor.apellido_materno ?? ""),
          codigo: String(productor.codigo ?? ""),
        } : { id: 0, nombres: "", apellidoPaterno: "", apellidoMaterno: "", codigo: "" },
      } : { id: 0, nombre: "", codigo: "", productor: { id: 0, nombres: "", apellidoPaterno: "", apellidoMaterno: "", codigo: "" } },
    } : undefined,
    inspector: String(dto.inspector ?? ""),
    estado: (dto.estado as EstadoInspeccion) ?? "PENDIENTE",
    resultado: (dto.resultado as ResultadoInspeccion) ?? null,
    checklist: (rawChecklist ?? []).map((c) => ({
      id: Number(c.id ?? 0),
      criterio: String(c.criterio ?? ""),
      cumplimiento: (c.cumplimiento as Cumplimiento) ?? null,
      riesgo: (c.riesgo as Riesgo) ?? "BAJO",
      observacion: sanitizeStringOrNull(c.observacion) ?? "",
      evidencia: sanitizeStringOrNull(c.evidencia) ?? "",
    })),
    noConformidades: (rawNoConformidades ?? []).map((nc) => ({
      id: Number(nc.id ?? 0),
      codigo: sanitizeStringOrNull(nc.codigo) ?? "",
      tipo: String(nc.tipo ?? ""),
      categoria: String(nc.categoria ?? ""),
      descripcion: String(nc.descripcion ?? ""),
      severidad: (nc.severidad as Severidad) ?? "LEVE",
      responsable: String(nc.responsable ?? ""),
      fechaCompromiso: sanitizeStringOrNull(nc.fecha_compromiso)?.split("T")[0] ?? "",
      estado: (nc.estado as EstadoNoConformidad) ?? "PENDIENTE",
      accionCorrectiva: sanitizeStringOrNull(nc.accion_correctiva) ?? "",
      acciones: ((nc.acciones as Array<Record<string, unknown>>) ?? []).map((ac) => ({
        id: Number(ac.id ?? 0),
        accion: String(ac.accion ?? ""),
        responsable: String(ac.responsable ?? ""),
        fechaInicio: sanitizeStringOrNull(ac.fecha_inicio)?.split("T")[0] ?? "",
        fechaLimite: sanitizeStringOrNull(ac.fecha_limite)?.split("T")[0] ?? "",
        estado: (ac.estado as EstadoAccionCorrectiva) ?? "PENDIENTE",
        observaciones: sanitizeStringOrNull(ac.observaciones) ?? "",
      })),
    })),
    evidencias: (rawEvidencias ?? []).map((e) => ({
      id: Number(e.id ?? 0),
      nombre: String(e.nombre ?? ""),
      descripcion: sanitizeStringOrNull(e.descripcion) ?? "",
      fecha: sanitizeStringOrNull(e.fecha)?.split("T")[0] ?? "",
      responsable: sanitizeStringOrNull(e.responsable) ?? "",
      tipo: sanitizeStringOrNull(e.tipo) ?? "",
      rutaArchivo: sanitizeStringOrNull(e.ruta_archivo) ?? "",
    })),
    latitud: sanitizeStringOrNull(dto.latitud) ?? "",
    longitud: sanitizeStringOrNull(dto.longitud) ?? "",
    altitud: sanitizeStringOrNull(dto.altitud) ?? "",
    precisionGps: sanitizeStringOrNull(dto.precision_gps) ?? "",
    observaciones: sanitizeStringOrNull(dto.observaciones) ?? "",
    comentariosProductor: sanitizeStringOrNull(dto.comentarios_productor) ?? "",
    recomendaciones: sanitizeStringOrNull(dto.recomendaciones) ?? "",
    prioridadRecomendacion: sanitizeStringOrNull(dto.prioridad_recomendacion) ?? "",
    responsableRecomendacion: sanitizeStringOrNull(dto.responsable_recomendacion) ?? "",
    fechaRecomendacion: sanitizeStringOrNull(dto.fecha_recomendacion)?.split("T")[0] ?? "",
    riesgoGeneral: (dto.riesgo_general as Riesgo) ?? "BAJO",
    resumenEjecutivo: sanitizeStringOrNull(dto.resumen_ejecutivo) ?? "",
    fechaProximaInspeccion: sanitizeStringOrNull(dto.fecha_proxima_inspeccion)?.split("T")[0] ?? "",
    nivelCumplimiento: sanitizeStringOrNull(dto.nivel_cumplimiento) ?? "",
  };
}

function inspeccionToBackend(data: Partial<Inspeccion>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.cultivoId !== undefined) out.cultivo_id = data.cultivoId;
  if (data.fecha !== undefined) out.fecha = formatDateToISO(data.fecha);
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
  if (data.fechaRecomendacion !== undefined) out.fecha_recomendacion = formatDateToISO(data.fechaRecomendacion) || null;
  if (data.riesgoGeneral !== undefined) out.riesgo_general = data.riesgoGeneral;
  if (data.resumenEjecutivo !== undefined) out.resumen_ejecutivo = data.resumenEjecutivo || null;
  if (data.fechaProximaInspeccion !== undefined) out.fecha_proxima_inspeccion = formatDateToISO(data.fechaProximaInspeccion) || null;
  if (data.nivelCumplimiento !== undefined) out.nivel_cumplimiento = data.nivelCumplimiento || null;
  if (data.checklist !== undefined) {
    out.checklist = data.checklist.map((c) => ({
      criterio: c.criterio,
      cumplimiento: c.cumplimiento,
      riesgo: c.riesgo,
      observacion: c.observacion,
      evidencia: c.evidencia,
    }));
  }
  if (data.noConformidades !== undefined) {
    out.no_conformidades = data.noConformidades.map((nc) => ({
      codigo: nc.codigo,
      tipo: nc.tipo,
      categoria: nc.categoria,
      descripcion: nc.descripcion,
      severidad: nc.severidad,
      responsable: nc.responsable,
      fecha_compromiso: formatDateToISO(nc.fechaCompromiso) || null,
      estado: nc.estado,
      accion_correctiva: nc.accionCorrectiva,
      acciones: nc.acciones.map((ac) => ({
        accion: ac.accion,
        responsable: ac.responsable,
        fecha_inicio: formatDateToISO(ac.fechaInicio) || null,
        fecha_limite: formatDateToISO(ac.fechaLimite) || null,
        estado: ac.estado,
        observaciones: ac.observaciones,
      })),
    }));
  }
  if (data.evidencias !== undefined) {
    out.evidencias = data.evidencias.map((e) => ({
      nombre: e.nombre,
      descripcion: e.descripcion,
      tipo: e.tipo,
      ruta_archivo: e.rutaArchivo || null,
      fecha: formatDateToISO(e.fecha) || null,
      responsable: e.responsable,
    }));
  }
  return out;
}

// ─── API calls ─────────────────────────────────────────────

export async function fetchInspecciones(filters?: {
  search?: string;
  estado?: string;
  cultivo_id?: number;
  page?: number;
  limit?: number;
}, signal?: AbortSignal): Promise<InspeccionesResponse> {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.estado) params.append("estado", filters.estado);
  if (filters?.cultivo_id) params.append("cultivo_id", String(filters.cultivo_id));
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const { data } = await api.get(`/inspecciones?${params.toString()}`, { signal });
  return {
    ...data,
    data: (data.data ?? []).map(inspeccionToFrontend),
  };
}

export async function fetchInspeccion(id: number, signal?: AbortSignal): Promise<Inspeccion> {
  const { data } = await api.get(`/inspecciones/${id}`, { signal });
  return inspeccionToFrontend(data.data ?? data);
}

export async function createInspeccion(data: Partial<Inspeccion>): Promise<Inspeccion> {
  const { data: res } = await api.post("/inspecciones", inspeccionToBackend(data));
  return inspeccionToFrontend(res.data ?? res);
}

export async function updateInspeccion(id: number, data: Partial<Inspeccion>): Promise<Inspeccion> {
  const { data: res } = await api.put(`/inspecciones/${id}`, inspeccionToBackend(data));
  return inspeccionToFrontend(res.data ?? res);
}

export async function deleteInspeccion(id: number): Promise<void> {
  await api.delete(`/inspecciones/${id}`);
}

export async function fetchInspeccionStats(filters?: {
  search?: string;
  estado?: string;
  cultivo_id?: number;
}, signal?: AbortSignal): Promise<InspeccionStats> {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.estado) params.append("estado", filters.estado);
  if (filters?.cultivo_id) params.append("cultivo_id", String(filters.cultivo_id));

  const { data } = await api.get(`/inspecciones/stats?${params.toString()}`, { signal });
  return data.data ?? data;
}

// ─── Options ───────────────────────────────────────────────

export const estadosInspeccionOptions: EstadoInspeccion[] = ["PENDIENTE", "APROBADA", "NO_CONFORME"];
export const resultadosInspeccionOptions: ResultadoInspeccion[] = ["CONFORME", "CONFORME_CON_OBSERVACIONES", "NO_CONFORME"];
export const severidadesOptions: Severidad[] = ["LEVE", "MODERADA", "CRITICA"];
export const riesgosOptions: Riesgo[] = ["BAJO", "MEDIO", "ALTO"];
export const cumplimientoOptions: Cumplimiento[] = ["CUMPLE", "NO_CUMPLE", "NO_APLICA"];
export const estadosNoConformidadOptions: EstadoNoConformidad[] = ["PENDIENTE", "EN_PROCESO", "CORREGIDA", "VERIFICADA"];
export const estadosAccionCorrectivaOptions: EstadoAccionCorrectiva[] = ["PENDIENTE", "EN_PROCESO", "COMPLETADA", "VERIFICADA"];
export const tiposNoConformidadOptions = ["Uso de insumo no permitido", "Falta de registro", "Manejo de residuos", "Señalización", "Almacenamiento", "Barreras de protección", "Otro"];
export const categoriasNoConformidadOptions = ["Manejo de insumos", "Registros", "Infraestructura", "Manejo de residuos", "Sanidad vegetal", "Prácticas culturales", "Otro"];
export const tiposEvidenciaOptions = ["Fotografía", "Video", "Documento", "Georreferencia"];

export const criteriosChecklistOpciones = [
  "¿El productor utiliza únicamente insumos permitidos por el SIC?",
  "¿El productor realiza el control de plagas mediante prácticas permitidas?",
  "¿El productor realiza el control de enfermedades mediante prácticas permitidas?",
  "¿El productor realiza el control de malezas mediante prácticas permitidas?",
  "¿El productor aplica prácticas para conservar la fertilidad del suelo?",
  "¿El productor realiza rotación de cultivos?",
  "¿La unidad productiva presenta diversidad de cultivos?",
  "¿El suelo presenta condiciones adecuadas de compactación?",
  "¿El productor cuenta con cuaderno de registros actualizado?",
  "¿El productor comercializó conforme a procedimientos COOPAFA?",
];

export function crearChecklistPorDefecto(): CriterioChecklist[] {
  return criteriosChecklistOpciones.map((criterio) => ({
    criterio,
    cumplimiento: null,
    riesgo: "BAJO" as Riesgo,
    observacion: "",
    evidencia: "",
  }));
}
