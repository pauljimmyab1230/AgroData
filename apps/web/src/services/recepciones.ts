import api from "./api";

// ─── Types (synced with Prisma recepcion model) ───────────

export interface RecepcionSaco {
  id?: number;
  codigo: string;
  peso: number;
  observaciones?: string;
}

export interface RecepcionEvidencia {
  id?: string | number;
  nombre: string;
  tipo?: string;
  ruta_archivo: string;
}

export interface Recepcion {
  id: number;
  codigo: string;
  acopioId: number | null;
  acopioCodigo: string;
  loteProductor: string;
  fecha: string;
  responsable: string;
  planta: string;
  sacos: number;
  pesoTotal: number;
  pesoCampo: number;
  pesoBruto: number;
  tara: number;
  pesoNeto: number;
  diferencia: number;
  merma: number;
  humedad: number;
  impurezas: number;
  materiaExtrana: number;
  color: string;
  olor: string;
  presenciaInsectos: string;
  estadoProducto: string;
  categoria: string;
  destino: string;
  resultado: string;
  motivo: string;
  estado: string;
  observaciones: string;
  documentoFirmado: boolean;
  firmaResponsableUrl: string;
  activo: boolean;
  sacosDetalle: RecepcionSaco[];
  evidencias: RecepcionEvidencia[];
  createdAt: string;
  updatedAt: string;
}

interface RecepcionDTO {
  id: number;
  codigo: string;
  acopio_id: number | null;
  acopio: { id: number; codigo: string } | null;
  lote_productor: string | null;
  fecha: string;
  responsable: string;
  planta: string;
  sacos: number;
  peso_campo: number | string | null;
  peso_bruto: number | string | null;
  tara: number | string | null;
  peso_neto: number | string | null;
  diferencia: number | string | null;
  merma: number | string | null;
  humedad: number | string | null;
  impurezas: number | string | null;
  materia_extrana: number | string | null;
  color: string | null;
  olor: string | null;
  presencia_insectos: string | null;
  estado_producto: string | null;
  categoria: string | null;
  destino: string | null;
  resultado: string | null;
  motivo: string | null;
  estado: string;
  observaciones: string | null;
  documento_firmado: boolean;
  firma_responsable_url: string | null;
  activo: boolean;
  sacos_detalle: Array<{ id: number; codigo: string; peso: number | string; observaciones: string | null }>;
  evidencias?: Array<{ id?: string | number; nombre: string; tipo?: string; ruta_archivo: string }>;
  created_at: string;
  updated_at: string;
}

function toFrontend(dto: RecepcionDTO): Recepcion {
  const sacosDetalle = (dto.sacos_detalle ?? []).map(s => ({
    id: s.id,
    codigo: s.codigo,
    peso: Number(s.peso) || 0,
    observaciones: s.observaciones ?? "",
  }));

  const pesoTotal = sacosDetalle.reduce((sum, s) => sum + s.peso, 0);

  return {
    id: dto.id,
    codigo: dto.codigo,
    acopioId: dto.acopio_id,
    acopioCodigo: dto.acopio?.codigo ?? "",
    loteProductor: dto.lote_productor ?? "",
    fecha: dto.fecha?.split("T")[0] ?? "",
    responsable: dto.responsable,
    planta: dto.planta,
    sacos: dto.sacos,
    pesoTotal: Math.round(pesoTotal * 100) / 100,
    pesoCampo: Number(dto.peso_campo) || 0,
    pesoBruto: Number(dto.peso_bruto) || 0,
    tara: Number(dto.tara) || 0,
    pesoNeto: Number(dto.peso_neto) || 0,
    diferencia: Number(dto.diferencia) || 0,
    merma: Number(dto.merma) || 0,
    humedad: Number(dto.humedad) || 0,
    impurezas: Number(dto.impurezas) || 0,
    materiaExtrana: Number(dto.materia_extrana) || 0,
    color: dto.color ?? "",
    olor: dto.olor ?? "",
    presenciaInsectos: dto.presencia_insectos ?? "",
    estadoProducto: dto.estado_producto ?? "",
    categoria: dto.categoria ?? "",
    destino: dto.destino ?? "",
    resultado: dto.resultado ?? "",
    motivo: dto.motivo ?? "",
    estado: dto.estado,
    observaciones: dto.observaciones ?? "",
    documentoFirmado: dto.documento_firmado,
    firmaResponsableUrl: dto.firma_responsable_url ?? "",
    activo: dto.activo,
    sacosDetalle,
    evidencias: (dto.evidencias ?? []) as RecepcionEvidencia[],
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<Recepcion>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.acopioId !== undefined) out.acopio_id = data.acopioId || null;
  if (data.loteProductor !== undefined) out.lote_productor = data.loteProductor;
  if (data.fecha !== undefined) out.fecha = data.fecha;
  if (data.responsable !== undefined) out.responsable = data.responsable;
  if (data.planta !== undefined) out.planta = data.planta;
  if (data.sacos !== undefined) out.sacos = data.sacos;
  if (data.pesoCampo !== undefined) out.peso_campo = data.pesoCampo;
  if (data.pesoBruto !== undefined) out.peso_bruto = data.pesoBruto;
  if (data.tara !== undefined) out.tara = data.tara;
  if (data.pesoNeto !== undefined) out.peso_neto = data.pesoNeto;
  if (data.diferencia !== undefined) out.diferencia = data.diferencia;
  if (data.merma !== undefined) out.merma = data.merma;
  if (data.humedad !== undefined) out.humedad = data.humedad;
  if (data.impurezas !== undefined) out.impurezas = data.impurezas;
  if (data.materiaExtrana !== undefined) out.materia_extrana = data.materiaExtrana;
  if (data.color !== undefined) out.color = data.color || null;
  if (data.olor !== undefined) out.olor = data.olor || null;
  if (data.presenciaInsectos !== undefined) out.presencia_insectos = data.presenciaInsectos || null;
  if (data.estadoProducto !== undefined) out.estado_producto = data.estadoProducto || null;
  if (data.categoria !== undefined) out.categoria = data.categoria || null;
  if (data.destino !== undefined) out.destino = data.destino || null;
  if (data.resultado !== undefined) out.resultado = data.resultado || null;
  if (data.motivo !== undefined) out.motivo = data.motivo || null;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  if (data.documentoFirmado !== undefined) out.documento_firmado = data.documentoFirmado;
  if (data.firmaResponsableUrl !== undefined) out.firma_responsable_url = data.firmaResponsableUrl || null;
  if (data.sacosDetalle !== undefined) out.sacos_detalle = data.sacosDetalle;
  return out;
}

// ─── Form Types ───────────────────────────────────────────

export interface RecepcionFormData {
  acopioId: string;
  loteProductor: string;
  fecha: string;
  responsable: string;
  planta: string;
  sacos: number;
  pesoCampo: number;
  pesoBruto: number;
  tara: number;
  pesoNeto: number;
  humedad: number;
  impurezas: number;
  materiaExtrana: number;
  color: string;
  olor: string;
  presenciaInsectos: string;
  estadoProducto: string;
  categoria: string;
  destino: string;
  resultado: string;
  motivo: string;
  estado: string;
  observaciones: string;
  documentoFirmado: boolean;
  firmaResponsableUrl: string;
  sacosDetalle: RecepcionSaco[];
}

export const emptyRecepcionForm: RecepcionFormData = {
  acopioId: "",
  loteProductor: "",
  fecha: new Date().toISOString().split("T")[0],
  responsable: "",
  planta: "",
  sacos: 0,
  pesoCampo: 0,
  pesoBruto: 0,
  tara: 0,
  pesoNeto: 0,
  humedad: 0,
  impurezas: 0,
  materiaExtrana: 0,
  color: "",
  olor: "",
  presenciaInsectos: "",
  estadoProducto: "",
  categoria: "",
  destino: "",
  resultado: "",
  motivo: "",
  estado: "PENDIENTE_PESAJE",
  observaciones: "",
  documentoFirmado: false,
  firmaResponsableUrl: "",
  sacosDetalle: [],
};

// ─── Constants ────────────────────────────────────────────

export const recepcionEstados = ["PENDIENTE_PESAJE", "EN_CONTROL_CALIDAD", "DISPONIBLE", "RECHAZADA"] as const;
export const recepcionCategorias = ["PRIMERA", "SEGUNDA", "INDUSTRIAL", "DESCARTE"] as const;
export const recepcionDestinos = ["PROCESAMIENTO", "ALMACEN_TEMPORAL", "RECHAZADO"] as const;
export const recepcionResultado = ["ACEPTADO", "ACEPTADO_CON_OBSERVACIONES", "RECHAZADO"] as const;
export const recepcionEstadoProducto = ["EXCELENTE", "BUENO", "REGULAR", "RECHAZADO"] as const;

// ─── Query Type ───────────────────────────────────────────

export interface RecepcionesQuery {
  search?: string;
  estado?: string;
  page?: number;
  limit?: number;
}

// ─── API Calls ────────────────────────────────────────────

export async function fetchRecepciones(params?: RecepcionesQuery): Promise<{ data: Recepcion[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const res = await api.get("/recepciones", { params: query });
  return {
    data: (res.data.data ?? []).map(toFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchRecepcion(id: string | number): Promise<Recepcion> {
  const res = await api.get(`/recepciones/${id}`);
  return toFrontend(res.data.data);
}

export async function createRecepcion(data: Partial<Recepcion>): Promise<Recepcion> {
  const res = await api.post("/recepciones", toBackend(data));
  return toFrontend(res.data.data);
}

export async function updateRecepcion(id: string, data: Partial<Recepcion>): Promise<Recepcion> {
  const res = await api.put(`/recepciones/${id}`, toBackend(data));
  return toFrontend(res.data.data);
}

export async function deleteRecepcion(id: string): Promise<void> {
  await api.delete(`/recepciones/${id}`);
}

export interface RecepcionStats {
  total_recepciones: number;
  peso_neto_total: number;
  pendientes_pesaje: number;
  lotes_distintos: number;
}

export async function fetchRecepcionStats(): Promise<RecepcionStats> {
  const res = await api.get("/recepciones/stats");
  const d = res.data.data ?? {};
  return {
    total_recepciones: d.total_recepciones ?? 0,
    peso_neto_total: d.peso_neto_total ?? 0,
    pendientes_pesaje: d.pendientes_pesaje ?? 0,
    lotes_distintos: d.lotes_distintos ?? 0,
  };
}

// ─── Formatters ───────────────────────────────────────────

export function formatearFecha(fecha: string): string {
  if (!fecha) return "";
  return new Date(fecha).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatearPeso(peso: number | string): string {
  const n = typeof peso === "string" ? parseFloat(peso) : peso;
  return `${(n || 0).toFixed(2)} kg`;
}
