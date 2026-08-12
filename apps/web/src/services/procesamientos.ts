import api from "./api";

export interface OperacionProcesamiento {
  id?: string;
  nombre: string;
  tipo: string;
  estado: string;
  fechaInicio: string;
  fechaFin: string;
  responsable: string;
  observaciones: string;
}

export interface EvidenciaProcesamiento {
  id?: string;
  nombre: string;
  tipo: string;
  ruta_archivo: string;
}

export interface HistorialProcesamiento {
  id?: string;
  accion: string;
  usuario: string;
  fecha: string;
  observaciones: string;
}

export interface OrdenProcesamiento {
  id: string;
  codigo: string;
  campaniaId: string;
  campaniaNombre: string;
  fecha: string;
  producto: string;
  responsable: string;
  planta: string;
  lineaProcesamiento: string;
  estado: string;
  observaciones: string;
  pesoEntrada: number;
  pesoSalida: number;
  merma: number;
  rendimiento: number;
  productoBase: string;
  calidadProducto: string;
  pesoFinal: number;
  humedadFinal: number;
  lotes: string[];
  operaciones: OperacionProcesamiento[];
  evidencias: EvidenciaProcesamiento[];
  historial: HistorialProcesamiento[];
  createdAt: string;
  updatedAt: string;
}

interface OrdenProcesamientoDTO {
  id: string;
  codigo: string;
  campania_id: string;
  campania: { id: string; codigo: string; nombre: string } | null;
  fecha: string;
  producto: string;
  responsable: string;
  planta: string;
  linea_procesamiento: string;
  estado: string;
  observaciones: string | null;
  peso_entrada: number;
  peso_salida: number;
  merma: number;
  rendimiento: number;
  producto_base: string | null;
  calidad_producto: string | null;
  peso_final: number | null;
  humedad_final: number | null;
  lotes: string[];
  operaciones: Array<{ id: string; nombre: string; tipo: string; estado: string; fecha_inicio: string | null; fecha_fin: string | null; responsable: string; observaciones: string | null }>;
  evidencias: Array<{ id: string; nombre: string; tipo: string; ruta_archivo: string | null }>;
  historial: Array<{ id: string; accion: string; usuario: string; fecha: string; observaciones: string | null }>;
  created_at: string;
  updated_at: string;
}

function toFrontend(dto: OrdenProcesamientoDTO): OrdenProcesamiento {
  return {
    id: dto.id,
    codigo: dto.codigo,
    campaniaId: dto.campania_id,
    campaniaNombre: dto.campania?.nombre ?? "",
    fecha: dto.fecha?.split("T")[0] ?? "",
    producto: dto.producto,
    responsable: dto.responsable,
    planta: dto.planta,
    lineaProcesamiento: dto.linea_procesamiento,
    estado: dto.estado,
    observaciones: dto.observaciones ?? "",
    pesoEntrada: Number(dto.peso_entrada) || 0,
    pesoSalida: Number(dto.peso_salida) || 0,
    merma: Number(dto.merma) || 0,
    rendimiento: Number(dto.rendimiento) || 0,
    productoBase: dto.producto_base ?? "",
    calidadProducto: dto.calidad_producto ?? "",
    pesoFinal: Number(dto.peso_final) || 0,
    humedadFinal: Number(dto.humedad_final) || 0,
    lotes: dto.lotes ?? [],
    operaciones: (dto.operaciones ?? []).map(o => ({
      id: o.id,
      nombre: o.nombre,
      tipo: o.tipo,
      estado: o.estado,
      fechaInicio: o.fecha_inicio ?? "",
      fechaFin: o.fecha_fin ?? "",
      responsable: o.responsable,
      observaciones: o.observaciones ?? "",
    })),
    evidencias: (dto.evidencias ?? []).map(e => ({
      id: e.id,
      nombre: e.nombre,
      tipo: e.tipo,
      ruta_archivo: e.ruta_archivo ?? "",
    })),
    historial: (dto.historial ?? []).map(h => ({
      id: h.id,
      accion: h.accion,
      usuario: h.usuario,
      fecha: h.fecha,
      observaciones: h.observaciones ?? "",
    })),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<OrdenProcesamiento>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.campaniaId !== undefined) out.campania_id = data.campaniaId;
  if (data.fecha !== undefined) out.fecha = data.fecha || null;
  if (data.producto !== undefined) out.producto = data.producto;
  if (data.responsable !== undefined) out.responsable = data.responsable;
  if (data.planta !== undefined) out.planta = data.planta;
  if (data.lineaProcesamiento !== undefined) out.linea_procesamiento = data.lineaProcesamiento;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  if (data.pesoEntrada !== undefined) out.peso_entrada = data.pesoEntrada;
  if (data.pesoSalida !== undefined) out.peso_salida = data.pesoSalida;
  if (data.merma !== undefined) out.merma = data.merma;
  if (data.rendimiento !== undefined) out.rendimiento = data.rendimiento;
  if (data.productoBase !== undefined) out.producto_base = data.productoBase || null;
  if (data.calidadProducto !== undefined) out.calidad_producto = data.calidadProducto || null;
  if (data.pesoFinal !== undefined) out.peso_final = data.pesoFinal;
  if (data.humedadFinal !== undefined) out.humedad_final = data.humedadFinal;
  if (data.lotes !== undefined) out.lotes = data.lotes;
  if (data.operaciones !== undefined) out.operaciones = data.operaciones;
  if (data.evidencias !== undefined) out.evidencias = data.evidencias;
  return out;
}

// ─── Types ─────────────────────────────────────────────────

export interface OrdenProcesamientoFormData {
  codigo: string;
  campaniaId: string;
  fecha: string;
  producto: string;
  responsable: string;
  planta: string;
  lineaProcesamiento: string;
  estado: string;
  observaciones: string;
  pesoEntrada: number;
  pesoSalida: number;
  merma: number;
  rendimiento: number;
  productoBase: string;
  calidadProducto: string;
  pesoFinal: number;
  humedadFinal: number;
  lotes: string[];
  operaciones: OperacionProcesamiento[];
  evidencias: EvidenciaProcesamiento[];
}

export const emptyOrdenProcesamientoForm: OrdenProcesamientoFormData = {
  codigo: "",
  campaniaId: "",
  fecha: new Date().toISOString().split("T")[0],
  producto: "",
  responsable: "",
  planta: "",
  lineaProcesamiento: "",
  estado: "PENDIENTE",
  observaciones: "",
  pesoEntrada: 0,
  pesoSalida: 0,
  merma: 0,
  rendimiento: 0,
  productoBase: "",
  calidadProducto: "",
  pesoFinal: 0,
  humedadFinal: 0,
  lotes: [],
  operaciones: [],
  evidencias: [],
};

export const procesamientoEstados = ["REGISTRADA", "EN_PROCESO", "COMPLETADA", "PAUSADA", "CANCELADA"] as const;
export const procesamientoLineas = ["LIMPIEZA", "SECADO", "MOLIENDA", "TOSTADO", "EMPAQUE"] as const;

export interface ProcesamientosQuery {
  search?: string;
  estado?: string;
  campania_id?: string;
  planta?: string;
  linea_procesamiento?: string;
  page?: number;
  limit?: number;
}

export async function fetchProcesamientos(params?: ProcesamientosQuery): Promise<{ data: OrdenProcesamiento[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.campania_id) query.campania_id = params.campania_id;
  if (params?.planta) query.planta = params.planta;
  if (params?.linea_procesamiento) query.linea_procesamiento = params.linea_procesamiento;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const res = await api.get("/procesamientos", { params: query });
  return {
    data: (res.data.data ?? []).map(toFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchProcesamiento(id: string): Promise<OrdenProcesamiento> {
  const res = await api.get(`/procesamientos/${id}`);
  return toFrontend(res.data.data);
}

export async function createProcesamiento(data: Partial<OrdenProcesamiento>): Promise<OrdenProcesamiento> {
  const res = await api.post("/procesamientos", toBackend(data));
  return toFrontend(res.data.data);
}

export async function updateProcesamiento(id: string, data: Partial<OrdenProcesamiento>): Promise<OrdenProcesamiento> {
  const res = await api.put(`/procesamientos/${id}`, toBackend(data));
  return toFrontend(res.data.data);
}

export async function deleteProcesamiento(id: string): Promise<void> {
  await api.delete(`/procesamientos/${id}`);
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

export function calcularRendimiento(pesoEntrada: number, pesoSalida: number): number {
  if (pesoEntrada === 0) return 0;
  return ((pesoSalida / pesoEntrada) * 100);
}

export const formatKg = formatearPeso;
export const formatFecha = formatearFecha;
export function formatPct(pct: number): string {
  return `${pct.toFixed(1)}%`;
}

export const calidadesOpciones = ["PRIMERA", "SEGUNDA", "TERCERA", "DESCARTE"] as const;
export const lineasOpciones = ["GRANOS", "TUBERCULOS", "LEGUMBRES", "SEmillAS"] as const;

export type EventoHistorial = HistorialProcesamiento;
export type TipoEventoHistorial = string;
export type Operacion = OperacionProcesamiento;

export interface LoteProductorProcesado {
  loteProductor: string;
  productor: string;
  parcela: string;
  cultivo: string;
  pesoRecepcionado: number;
}

export const campaniasOpciones = ["Campaña Quinua Orgánica 2024-2025", "Campaña Papa Nativa 2024-2025"] as const;
export const lineasProcesamientoOpciones = ["GRANOS", "TUBERCULOS", "LEGUMBRES", "SEmillAS"] as const;
export const plantasOpciones = ["Planta Procesadora San Juan", "Planta Procesadora Chuschi"] as const;
export const productosOpciones = ["Quinua", "Papa Nativa", "Cebada", "Frijol", "Tarwi", "Maíz"] as const;
export const responsablesOpciones = ["Ing. Carlos Mendoza", "Ing. María García"] as const;
export const lotesProductorDisponibles: LoteProductorProcesado[] = [
  { loteProductor: "LP-TEO-001", productor: "Teófilo Huanca", parcela: "PAR-001", cultivo: "Quinua", pesoRecepcionado: 2025 },
  { loteProductor: "LP-JUA-001", productor: "Juana Mamani", parcela: "PAR-004", cultivo: "Quinua", pesoRecepcionado: 2790 },
  { loteProductor: "LP-ROS-001", productor: "Rosa Ccallpa", parcela: "PAR-008", cultivo: "Quinua", pesoRecepcionado: 2250 },
  { loteProductor: "LP-VAL-001", productor: "Valeriano Quispe", parcela: "PAR-010", cultivo: "Quinua", pesoRecepcionado: 1350 },
];
