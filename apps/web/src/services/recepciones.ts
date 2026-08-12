import api from "./api";

export interface Evidencia {
  id?: string;
  nombre: string;
  tipo?: string;
  ruta_archivo: string;
}

export interface HistorialRecepcion {
  id?: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  fecha: string;
}

export interface Recepcion {
  id: string;
  codigo: string;
  campaniaId: string;
  campaniaNombre: string;
  acopioId: string;
  acopioCodigo: string;
  loteProductor: string;
  fecha: string;
  responsable: string;
  planta: string;
  sacos: number;
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
  evidencias: Evidencia[];
  historial: HistorialRecepcion[];
  createdAt: string;
  updatedAt: string;
}

interface RecepcionDTO {
  id: string;
  codigo: string;
  campania_id: string;
  campania: { id: string; codigo: string; nombre: string } | null;
  acopio_id: string;
  acopio: { id: string; codigo: string } | null;
  lote_productor: string | null;
  fecha: string;
  responsable: string;
  planta: string;
  sacos: number;
  peso_campo: number;
  peso_bruto: number;
  tara: number;
  peso_neto: number;
  diferencia: number;
  merma: number;
  humedad: number;
  impurezas: number;
  materia_extrana: number;
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
  evidencias: Array<{ id: string; nombre: string; tipo?: string; ruta_archivo: string | null }>;
  historial: Array<{ id: string; titulo: string; descripcion: string; tipo: string; fecha: string }>;
  created_at: string;
  updated_at: string;
}

function toFrontend(dto: RecepcionDTO): Recepcion {
  return {
    id: dto.id,
    codigo: dto.codigo,
    campaniaId: dto.campania_id,
    campaniaNombre: dto.campania?.nombre ?? "",
    acopioId: dto.acopio_id,
    acopioCodigo: dto.acopio?.codigo ?? "",
    loteProductor: dto.lote_productor ?? "",
    fecha: dto.fecha?.split("T")[0] ?? "",
    responsable: dto.responsable,
    planta: dto.planta,
    sacos: dto.sacos,
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
    evidencias: (dto.evidencias ?? []).map(e => ({
      id: e.id,
      nombre: e.nombre,
      tipo: e.tipo ?? "",
      ruta_archivo: e.ruta_archivo ?? "",
    })),
    historial: (dto.historial ?? []).map(h => ({
      id: h.id,
      titulo: h.titulo,
      descripcion: h.descripcion,
      tipo: h.tipo,
      fecha: h.fecha,
    })),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<Recepcion>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.campaniaId !== undefined) out.campania_id = data.campaniaId;
  if (data.acopioId !== undefined) out.acopio_id = data.acopioId;
  if (data.loteProductor !== undefined) out.lote_productor = data.loteProductor || null;
  if (data.fecha !== undefined) out.fecha = data.fecha || null;
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
  if (data.activo !== undefined) out.activo = data.activo;
  if (data.evidencias !== undefined) out.evidencias = data.evidencias;
  return out;
}

// ─── Types ─────────────────────────────────────────────────

export interface RecepcionFormData {
  codigo: string;
  campaniaId: string;
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
  evidencias: Evidencia[];
}

export const emptyRecepcionForm: RecepcionFormData = {
  codigo: "",
  campaniaId: "",
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
  diferencia: 0,
  merma: 0,
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
  activo: true,
  evidencias: [],
};

export const recepcionEstados = ["PENDIENTE_PESAJE", "EN_CONTROL_CALIDAD", "DISPONIBLE", "RECHAZADA"] as const;
export const recepcionResultado = ["ACEPTADO", "ACEPTADO_CON_OBSERVACIONES", "RECHAZADO"] as const;

export interface RecepcionesQuery {
  search?: string;
  estado?: string;
  campania_id?: string;
  acopio_id?: string;
  planta?: string;
  categoria?: string;
  page?: number;
  limit?: number;
}

export async function fetchRecepciones(params?: RecepcionesQuery): Promise<{ data: Recepcion[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.campania_id) query.campania_id = params.campania_id;
  if (params?.acopio_id) query.acopio_id = params.acopio_id;
  if (params?.planta) query.planta = params.planta;
  if (params?.categoria) query.categoria = params.categoria;
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

export async function fetchRecepcion(id: string): Promise<Recepcion> {
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
