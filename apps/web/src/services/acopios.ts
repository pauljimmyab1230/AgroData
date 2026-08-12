import api from "./api";

export interface Saco {
  id?: string;
  codigo: string;
  peso: number;
  observaciones: string;
}

export interface FotoAcopio {
  id?: string;
  nombre: string;
  descripcion: string;
  ruta_archivo: string;
}

export interface Acopio {
  id: string;
  codigo: string;
  campaniaId: string;
  campaniaNombre: string;
  productorId: string;
  productorNombre: string;
  parcelaId: string;
  parcelaNombre: string;
  parcelaComunidad: string;
  cultivoId: string;
  cultivoNombre: string;
  fecha: string;
  acopiador: string;
  vehiculo: string;
  rutaAcopio: string;
  loteProductor: string;
  totalSacos: number;
  pesoTotal: number;
  pesoPromedio: number;
  pesoMaximo: number;
  pesoMinimo: number;
  estado: string;
  estadoProducto: string;
  humedad: number;
  impurezas: number;
  observacionesCalidad: string;
  firmaProductorUrl: string;
  firmaAcopiadorUrl: string;
  observaciones: string;
  sacos: Saco[];
  fotos: FotoAcopio[];
  createdAt: string;
  updatedAt: string;
}

interface AcopioDTO {
  id: string;
  codigo: string;
  campania_id: string;
  campania: { id: string; codigo: string; nombre: string } | null;
  productor_id: string;
  productor: { id: string; codigo: string; nombres: string; apellido_paterno: string; apellido_materno: string } | null;
  parcela_id: string;
  parcela: { id: string; codigo: string; nombre: string; comunidad: string } | null;
  cultivo_id: string | null;
  cultivo: { id: string; codigo: string; cultivo: string; variedad: string } | null;
  fecha: string;
  acopiador: string;
  vehiculo: string | null;
  ruta_acopio: string | null;
  lote_productor: string | null;
  total_sacos: number;
  peso_total: number;
  peso_promedio: number | null;
  peso_maximo: number | null;
  peso_minimo: number | null;
  estado: string;
  estado_producto: string | null;
  humedad: number | null;
  impurezas: number | null;
  observaciones_calidad: string | null;
  firma_productor_url: string | null;
  firma_acopiador_url: string | null;
  observaciones: string | null;
  sacos: Array<{ id: string; codigo: string; peso: number; observaciones: string | null }>;
  fotos: Array<{ id: string; nombre: string; descripcion: string | null; ruta_archivo: string | null }>;
  created_at: string;
  updated_at: string;
}

function toFrontend(dto: AcopioDTO): Acopio {
  return {
    id: dto.id,
    codigo: dto.codigo,
    campaniaId: dto.campania_id,
    campaniaNombre: dto.campania?.nombre ?? "",
    productorId: dto.productor_id,
    productorNombre: dto.productor
      ? `${dto.productor.nombres} ${dto.productor.apellido_paterno} ${dto.productor.apellido_materno}`.trim()
      : "",
    parcelaId: dto.parcela_id,
    parcelaNombre: dto.parcela?.nombre ?? "",
    parcelaComunidad: dto.parcela?.comunidad ?? "",
    cultivoId: dto.cultivo_id ?? "",
    cultivoNombre: dto.cultivo?.cultivo ?? "",
    fecha: dto.fecha?.split("T")[0] ?? "",
    acopiador: dto.acopiador,
    vehiculo: dto.vehiculo ?? "",
    rutaAcopio: dto.ruta_acopio ?? "",
    loteProductor: dto.lote_productor ?? "",
    totalSacos: Number(dto.total_sacos) || 0,
    pesoTotal: Number(dto.peso_total) || 0,
    pesoPromedio: Number(dto.peso_promedio) || 0,
    pesoMaximo: Number(dto.peso_maximo) || 0,
    pesoMinimo: Number(dto.peso_minimo) || 0,
    estado: dto.estado,
    estadoProducto: dto.estado_producto ?? "",
    humedad: Number(dto.humedad) || 0,
    impurezas: Number(dto.impurezas) || 0,
    observacionesCalidad: dto.observaciones_calidad ?? "",
    firmaProductorUrl: dto.firma_productor_url ?? "",
    firmaAcopiadorUrl: dto.firma_acopiador_url ?? "",
    observaciones: dto.observaciones ?? "",
    sacos: (dto.sacos ?? []).map(s => ({
      id: s.id,
      codigo: s.codigo,
      peso: Number(s.peso) || 0,
      observaciones: s.observaciones ?? "",
    })),
    fotos: (dto.fotos ?? []).map(f => ({
      id: f.id,
      nombre: f.nombre,
      descripcion: f.descripcion ?? "",
      ruta_archivo: f.ruta_archivo ?? "",
    })),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<Acopio>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.campaniaId !== undefined) out.campania_id = data.campaniaId;
  if (data.productorId !== undefined) out.productor_id = data.productorId;
  if (data.parcelaId !== undefined) out.parcela_id = data.parcelaId;
  if (data.cultivoId !== undefined) out.cultivo_id = data.cultivoId || null;
  if (data.fecha !== undefined) out.fecha = data.fecha || null;
  if (data.acopiador !== undefined) out.acopiador = data.acopiador;
  if (data.vehiculo !== undefined) out.vehiculo = data.vehiculo || null;
  if (data.rutaAcopio !== undefined) out.ruta_acopio = data.rutaAcopio || null;
  if (data.loteProductor !== undefined) out.lote_productor = data.loteProductor || null;
  if (data.totalSacos !== undefined) out.total_sacos = data.totalSacos;
  if (data.pesoTotal !== undefined) out.peso_total = data.pesoTotal;
  if (data.pesoPromedio !== undefined) out.peso_promedio = data.pesoPromedio;
  if (data.pesoMaximo !== undefined) out.peso_maximo = data.pesoMaximo;
  if (data.pesoMinimo !== undefined) out.peso_minimo = data.pesoMinimo;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.estadoProducto !== undefined) out.estado_producto = data.estadoProducto || null;
  if (data.humedad !== undefined) out.humedad = data.humedad;
  if (data.impurezas !== undefined) out.impurezas = data.impurezas;
  if (data.observacionesCalidad !== undefined) out.observaciones_calidad = data.observacionesCalidad || null;
  if (data.firmaProductorUrl !== undefined) out.firma_productor_url = data.firmaProductorUrl || null;
  if (data.firmaAcopiadorUrl !== undefined) out.firma_acopiador_url = data.firmaAcopiadorUrl || null;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  if (data.sacos !== undefined) out.sacos = data.sacos;
  if (data.fotos !== undefined) out.fotos = data.fotos;
  return out;
}

// ─── Types ─────────────────────────────────────────────────

export interface AcopioFormData {
  codigo: string;
  campaniaId: string;
  productorId: string;
  parcelaId: string;
  cultivoId: string;
  fecha: string;
  acopiador: string;
  vehiculo: string;
  rutaAcopio: string;
  loteProductor: string;
  totalSacos: number;
  pesoTotal: number;
  pesoPromedio: number;
  pesoMaximo: number;
  pesoMinimo: number;
  estado: string;
  estadoProducto: string;
  humedad: number;
  impurezas: number;
  observacionesCalidad: string;
  firmaProductorUrl: string;
  firmaAcopiadorUrl: string;
  observaciones: string;
  sacos: Saco[];
  fotos: FotoAcopio[];
}

export const emptyAcopioForm: AcopioFormData = {
  codigo: "",
  campaniaId: "",
  productorId: "",
  parcelaId: "",
  cultivoId: "",
  fecha: new Date().toISOString().split("T")[0],
  acopiador: "",
  vehiculo: "",
  rutaAcopio: "",
  loteProductor: "",
  totalSacos: 0,
  pesoTotal: 0,
  pesoPromedio: 0,
  pesoMaximo: 0,
  pesoMinimo: 0,
  estado: "EN_PROCESO",
  estadoProducto: "",
  humedad: 0,
  impurezas: 0,
  observacionesCalidad: "",
  firmaProductorUrl: "",
  firmaAcopiadorUrl: "",
  observaciones: "",
  sacos: [],
  fotos: [],
};

export const acopioEstados = ["EN_PROCESO", "COMPLETADO", "EN_PLANTA"] as const;
export const acopioEstadosProducto = ["EXCELENTE", "BUENO", "REGULAR", "RECHAZADO"] as const;

export interface AcopiosQuery {
  search?: string;
  estado?: string;
  campania_id?: string;
  productor_id?: string;
  comunidad?: string;
  acopiador?: string;
  page?: number;
  limit?: number;
}

export async function fetchAcopios(params?: AcopiosQuery): Promise<{ data: Acopio[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.campania_id) query.campania_id = params.campania_id;
  if (params?.productor_id) query.productor_id = params.productor_id;
  if (params?.comunidad) query.comunidad = params.comunidad;
  if (params?.acopiador) query.acopiador = params.acopiador;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const res = await api.get("/acopios", { params: query });
  return {
    data: (res.data.data ?? []).map(toFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchAcopio(id: string): Promise<Acopio> {
  const res = await api.get(`/acopios/${id}`);
  return toFrontend(res.data.data);
}

export async function createAcopio(data: Partial<Acopio>): Promise<Acopio> {
  const res = await api.post("/acopios", toBackend(data));
  return toFrontend(res.data.data);
}

export async function updateAcopio(id: string, data: Partial<Acopio>): Promise<Acopio> {
  const res = await api.put(`/acopios/${id}`, toBackend(data));
  return toFrontend(res.data.data);
}

export async function deleteAcopio(id: string): Promise<void> {
  await api.delete(`/acopios/${id}`);
}

export async function fetchAcopioStats(campaniaId?: string): Promise<{
  total_acopios: number;
  productores_atendidos: number;
  sacos_recibidos: number;
  kilogramos_acopiados: number;
}> {
  const query: Record<string, string> = {};
  if (campaniaId) query.campania_id = campaniaId;
  const res = await api.get("/acopios/stats", { params: query });
  return res.data.data;
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

export function obtenerSiguienteCodigo(codigoActual: string): string {
  const parts = codigoActual.split("-");
  const num = parseInt(parts.pop() || "0", 10) + 1;
  return `${parts.join("-")}-${String(num).padStart(2, "0")}`;
}

// ─── View Adapter (maps API Acopio to UI-friendly shape) ────

export type AcopioView = {
  id: number;
  codigo: string;
  fecha: string;
  campania: string;
  comunidad: string;
  acopiador: string;
  vehiculo: string;
  ruta: string;
  productor: string;
  parcela: string;
  cultivo: string;
  loteProductor: string;
  totalSacos: number;
  pesoTotal: number;
  pesoPromedio: number;
  pesoMaximo: number;
  pesoMinimo: number;
  estado: string;
  sacos: Array<{ id: number; codigo: string; peso: number; observaciones: string }>;
  estadoProducto: string;
  humedad: number;
  impurezas: number;
  observacionesCalidad: string;
  fotos: Array<{ id: number; nombre: string; descripcion: string; preview?: string }>;
  firmaProductor: boolean;
  firmaAcopiador: boolean;
  observaciones: string;
};

const displayEstado: Record<string, string> = {
  EN_PROCESO: "En Proceso",
  COMPLETADO: "Completado",
  EN_PLANTA: "En Planta",
};

const displayEstadoProducto: Record<string, string> = {
  EXCELENTE: "Excelente",
  BUENO: "Bueno",
  REGULAR: "Regular",
  RECHAZADO: "Rechazado",
};

export function toAcopioView(a: Acopio): AcopioView {
  return {
    id: parseInt(a.id, 10) || 0,
    codigo: a.codigo,
    fecha: a.fecha,
    campania: a.campaniaNombre,
    comunidad: a.parcelaComunidad,
    acopiador: a.acopiador,
    vehiculo: a.vehiculo,
    ruta: a.rutaAcopio,
    productor: a.productorNombre,
    parcela: a.parcelaNombre,
    cultivo: a.cultivoNombre,
    loteProductor: a.loteProductor,
    totalSacos: a.totalSacos,
    pesoTotal: a.pesoTotal,
    pesoPromedio: a.pesoPromedio,
    pesoMaximo: a.pesoMaximo,
    pesoMinimo: a.pesoMinimo,
    estado: displayEstado[a.estado] ?? a.estado,
    sacos: a.sacos.map((s) => ({
      id: parseInt(s.id, 10) || 0,
      codigo: s.codigo,
      peso: s.peso,
      observaciones: s.observaciones,
    })),
    estadoProducto: displayEstadoProducto[a.estadoProducto] ?? a.estadoProducto,
    humedad: a.humedad,
    impurezas: a.impurezas,
    observacionesCalidad: a.observacionesCalidad,
    fotos: a.fotos.map((f) => ({
      id: parseInt(f.id, 10) || 0,
      nombre: f.nombre,
      descripcion: f.descripcion,
    })),
    firmaProductor: Boolean(a.firmaProductorUrl),
    firmaAcopiador: Boolean(a.firmaAcopiadorUrl),
    observaciones: a.observaciones,
  };
}

export function formatFecha(fecha?: string): string {
  if (!fecha) return "—";
  const d = new Date(fecha.includes("T") ? fecha : fecha + "T00:00:00");
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatKg(peso: number): string {
  return `${Intl.NumberFormat("es-PE", { maximumFractionDigits: 1 }).format(peso)} kg`;
}

export const estadosAcopioDisplay = ["En Proceso", "Completado", "En Planta"] as const;
