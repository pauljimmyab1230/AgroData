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
  campaniaId: number;
  campaniaNombre: string;
  campaniaCodigo: string;
  productorId: number;
  productorNombre: string;
  productorCodigo: string;
  parcelaId: number;
  parcelaNombre: string;
  parcelaCodigo: string;
  cultivoId: number;
  cultivoNombre: string;
  cultivoCodigo: string;
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
  createdAt: string;
  updatedAt: string;
}

// ─── DTO (API response shape) ──────────────────────────────

interface InspeccionDTO {
  id: number;
  codigo: string;
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
  created_at: string;
  updated_at: string;
  cultivo_id: number;
  cultivo: {
    id: number;
    cultivo: string;
    codigo: string;
    campania: { id: number; nombre: string; codigo: string };
    parcela: {
      id: number;
      nombre: string;
      codigo: string;
      productor: { id: number; nombres: string; apellido_paterno: string; apellido_materno: string; codigo: string };
    };
  } | null;
  checklist: Array<{ id: number; criterio: string; cumplimiento: string | null; riesgo: string; observacion: string | null; evidencia: string | null }>;
  no_conformidades: Array<{
    id: number;
    codigo: string | null;
    tipo: string;
    categoria: string;
    descripcion: string;
    severidad: string;
    responsable: string;
    fecha_compromiso: string | null;
    estado: string;
    accion_correctiva: string | null;
    acciones: Array<{ id: number; accion: string; responsable: string; fecha_inicio: string | null; fecha_limite: string | null; estado: string; observaciones: string | null }>;
  }>;
  evidencias: Array<{ id: number; nombre: string; descripcion: string | null; tipo: string | null; ruta_archivo: string | null; fecha: string | null; responsable: string | null }>;
}

// ─── Mapping ───────────────────────────────────────────────

const splitDate = (v?: string | null): string => v?.split("T")[0] ?? "";

function toFrontend(dto: InspeccionDTO): Inspeccion {
  const cultivo = dto.cultivo;
  const parcela = cultivo?.parcela;
  const productor = parcela?.productor;
  const campania = cultivo?.campania;

  return {
    id: dto.id,
    codigo: dto.codigo,
    fecha: splitDate(dto.fecha),
    campaniaId: campania?.id ?? 0,
    campaniaNombre: campania?.nombre ?? "",
    campaniaCodigo: campania?.codigo ?? "",
    productorId: productor?.id ?? 0,
    productorNombre: productor ? `${productor.nombres} ${productor.apellido_paterno} ${productor.apellido_materno}`.trim() : "",
    productorCodigo: productor?.codigo ?? "",
    parcelaId: parcela?.id ?? 0,
    parcelaNombre: parcela?.nombre ?? "",
    parcelaCodigo: parcela?.codigo ?? "",
    cultivoId: cultivo?.id ?? 0,
    cultivoNombre: cultivo?.cultivo ?? "",
    cultivoCodigo: cultivo?.codigo ?? "",
    inspector: dto.inspector,
    estado: dto.estado as EstadoInspeccion,
    resultado: (dto.resultado as ResultadoInspeccion) || null,
    checklist: (dto.checklist ?? []).map((c) => ({
      id: c.id,
      criterio: c.criterio,
      cumplimiento: c.cumplimiento as Cumplimiento | null,
      riesgo: c.riesgo as Riesgo,
      observacion: c.observacion ?? "",
      evidencia: c.evidencia ?? "",
    })),
    noConformidades: (dto.no_conformidades ?? []).map((nc) => ({
      id: nc.id,
      codigo: nc.codigo ?? "",
      tipo: nc.tipo,
      categoria: nc.categoria,
      descripcion: nc.descripcion,
      severidad: nc.severidad as Severidad,
      responsable: nc.responsable,
      fechaCompromiso: splitDate(nc.fecha_compromiso),
      estado: nc.estado as EstadoNoConformidad,
      accionCorrectiva: nc.accion_correctiva ?? "",
      acciones: (nc.acciones ?? []).map((ac) => ({
        id: ac.id,
        accion: ac.accion,
        responsable: ac.responsable,
        fechaInicio: splitDate(ac.fecha_inicio),
        fechaLimite: splitDate(ac.fecha_limite),
        estado: ac.estado as EstadoAccionCorrectiva,
        observaciones: ac.observaciones ?? "",
      })),
    })),
    evidencias: (dto.evidencias ?? []).map((e) => ({
      id: e.id,
      nombre: e.nombre,
      descripcion: e.descripcion ?? "",
      fecha: splitDate(e.fecha),
      responsable: e.responsable ?? "",
      tipo: e.tipo ?? "",
      rutaArchivo: e.ruta_archivo ?? "",
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
    fechaRecomendacion: splitDate(dto.fecha_recomendacion),
    riesgoGeneral: dto.riesgo_general as Riesgo,
    resumenEjecutivo: dto.resumen_ejecutivo ?? "",
    fechaProximaInspeccion: splitDate(dto.fecha_proxima_inspeccion),
    nivelCumplimiento: dto.nivel_cumplimiento ?? "",
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<Inspeccion>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.cultivoId !== undefined) out.cultivo_id = data.cultivoId;
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
      fecha_compromiso: nc.fechaCompromiso || null,
      estado: nc.estado,
      accion_correctiva: nc.accionCorrectiva,
      acciones: nc.acciones.map((ac) => ({
        accion: ac.accion,
        responsable: ac.responsable,
        fecha_inicio: ac.fechaInicio || null,
        fecha_limite: ac.fechaLimite || null,
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
      fecha: e.fecha || null,
      responsable: e.responsable,
    }));
  }
  return out;
}

// ─── API calls ─────────────────────────────────────────────

export interface InspeccionesQuery {
  search?: string;
  estado?: string;
  cultivo_id?: number;
  page?: number;
  limit?: number;
}

export async function fetchInspecciones(params?: InspeccionesQuery): Promise<{ data: Inspeccion[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.cultivo_id) query.cultivo_id = String(params.cultivo_id);
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
  if (!fecha) return "\u2014";
  const parts = fecha.split("-");
  if (parts.length !== 3) return fecha;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// ─── Options ───────────────────────────────────────────────

export const estadosOpciones: EstadoInspeccion[] = ["PENDIENTE", "APROBADA", "NO_CONFORME"];

export const resultadosOpciones: ResultadoInspeccion[] = [
  "CONFORME",
  "CONFORME_CON_OBSERVACIONES",
  "NO_CONFORME",
];

export const severidadesOpciones: Severidad[] = ["LEVE", "MODERADA", "CRITICA"];

export const riesgosOpciones: Riesgo[] = ["BAJO", "MEDIO", "ALTO"];

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
  "¿Las semillas utilizadas para la siembra son de origen permitido para la producción orgánica?",
  "¿Las semillas utilizadas para la siembra fueron sometidas únicamente a tratamientos permitidos para la producción orgánica?",
  "¿Los abonos y fertilizantes utilizados en la unidad productiva son de origen permitido para la producción orgánica?",
  "¿El productor utiliza únicamente insumos permitidos por el SIC para el manejo del cultivo?",
  "¿El productor realiza el control de plagas mediante prácticas permitidas para la producción orgánica?",
  "¿El productor realiza el control de enfermedades mediante prácticas permitidas para la producción orgánica?",
  "¿El productor realiza el control de malezas mediante prácticas permitidas para la producción orgánica?",
  "¿El productor evita el uso de productos no permitidos para el control de plagas, enfermedades y malezas?",
  "¿El productor aplica prácticas destinadas a conservar y mejorar la fertilidad del suelo?",
  "¿El productor aplica prácticas para mantener o mejorar las condiciones físicas del suelo?",
  "¿El productor realiza rotación de cultivos en la unidad productiva?",
  "¿El productor cuenta con un historial de rotación de cultivos de la unidad productiva?",
  "¿La unidad productiva se encuentra libre de evidencias significativas de erosión del suelo?",
  "¿El productor aplica medidas para prevenir o reducir la erosión del suelo cuando esta se presenta?",
  "¿La unidad productiva presenta colindancia con áreas de producción convencional?",
  "¿La unidad productiva cuenta con medidas de protección frente a posibles riesgos provenientes de áreas de producción convencional colindantes?",
  "¿La unidad productiva cuenta con barreras físicas o vegetales para reducir el riesgo de contaminación proveniente de áreas colindantes?",
  "¿Las barreras de protección de la unidad productiva se encuentran en condiciones adecuadas para cumplir su función?",
  "¿Cuando corresponde, la unidad productiva cuenta con zonas de amortiguamiento frente a áreas de producción convencional?",
  "¿La unidad productiva presenta diversidad de cultivos como parte de su manejo agrícola?",
  "¿La unidad productiva presenta una cobertura vegetal adecuada que proteja el suelo?",
  "¿La cobertura del suelo observada contribuye a reducir la erosión y pérdida de suelo?",
  "¿El suelo de la unidad productiva presenta condiciones adecuadas de compactación?",
  "¿El suelo presenta características físicas favorables para el desarrollo del cultivo?",
  "¿El suelo presenta una estructura adecuada para favorecer la infiltración de agua y el desarrollo de las raíces?",
  "¿El suelo presenta características de color compatibles con condiciones adecuadas de manejo y conservación?",
  "¿El suelo presenta un olor característico de un suelo con condiciones adecuadas?",
  "¿Los agregados del suelo presentan una estabilidad adecuada?",
  "¿El suelo se encuentra libre de costras superficiales o capas endurecidas que afecten significativamente la infiltración de agua?",
  "¿El productor cuenta con su cuaderno de registros de producción?",
  "¿El cuaderno de registros del productor se encuentra actualizado?",
  "¿El productor registra las ventas realizadas en su cuaderno?",
  "¿El productor registra las compras de insumos y materiales utilizados para la producción?",
  "¿El productor registra las actividades realizadas durante el proceso de producción?",
  "¿El productor registra los costos asociados a las actividades de producción?",
  "¿El productor registra las cantidades cosechadas en su cuaderno?",
  "¿El productor conserva los comprobantes de compra de los insumos utilizados en la producción?",
  "¿El productor cuenta con una copia del contrato suscrito con la COOPAFA?",
  "¿El productor cuenta con una copia o resumen del Reglamento del SIC?",
  "¿El productor cuenta con la lista de insumos permitidos para la producción orgánica?",
  "¿El productor comercializó la cosecha anterior de acuerdo con los procedimientos establecidos por la COOPAFA?",
  "¿El productor dispone de un espacio adecuado para el almacenamiento de productos orgánicos?",
  "¿El espacio destinado al almacenamiento de productos orgánicos se encuentra en condiciones adecuadas de limpieza y orden?",
  "¿Los productos orgánicos se encuentran almacenados sobre pallets, madera, estantes u otra superficie que evite el contacto directo con el suelo?",
  "¿El área destinada al almacenamiento de productos orgánicos se encuentra claramente identificada?",
  "¿Los productos orgánicos se encuentran separados de los productos no orgánicos?",
  "¿El almacenamiento de los productos orgánicos evita el riesgo de contaminación cruzada?",
  "¿El almacén se encuentra protegido de fuentes potenciales de contaminación?",
  "¿Los productos orgánicos se encuentran almacenados de manera que se preserve su integridad y condición?",
  "¿El productor conoce los costos asociados a la producción de su cultivo?",
  "¿El productor registra los costos de producción en su cuaderno de registros?",
];

export function crearChecklist(criterios?: string[]): CriterioChecklist[] {
  const lista = criterios && criterios.length > 0 ? criterios : criteriosChecklistOpciones;
  return lista.map((criterio) => ({
    criterio,
    cumplimiento: null,
    riesgo: "BAJO" as Riesgo,
    observacion: "",
    evidencia: "",
  }));
}
