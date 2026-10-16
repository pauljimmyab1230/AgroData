import api from "./api";
import { isoAFechaLocal } from "../utils/fechas";

// ─── Types ─────────────────────────────────────────────────

export type EstadoRecepcion = "PENDIENTE_PESAJE" | "EN_CONTROL_CALIDAD" | "DISPONIBLE" | "RECHAZADA";

export interface RecepcionSaco {
  id?: number;
  codigo: string;
  peso: number;
  observaciones?: string;
}

export interface Recepcion {
  id: number;
  codigo: string;
  loteProductor: string | null;
  fecha: string;
  responsable: string;
  planta: string;
  sacos: number;
  pesoCampo: number | null;
  pesoBruto: number | null;
  tara: number | null;
  pesoNeto: number | null;
  diferencia: number | null;
  merma: number | null;
  humedad: number | null;
  impurezas: number | null;
  materiaExtrana: number | null;
  color: string | null;
  olor: string | null;
  presenciaInsectos: string | null;
  estadoProducto: string | null;
  categoria: string | null;
  destino: string | null;
  resultado: string | null;
  motivo: string | null;
  estado: EstadoRecepcion;
  observaciones: string | null;
  acopioId: number | null;
  acopioCodigo: string | null;
  sacosDetalle: RecepcionSaco[];
}

export interface RecepcionesResponse {
  data: Recepcion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Mapping ───────────────────────────────────────────────

function recepcionToFrontend(dto: Record<string, unknown>): Recepcion {
  const acopio = dto.acopio as Record<string, unknown> | null;
  const sacos = dto.sacos_detalle as Array<Record<string, unknown>> | undefined;

  return {
    id: Number(dto.id ?? 0),
    codigo: String(dto.codigo ?? ""),
    loteProductor: dto.lote_productor != null ? String(dto.lote_productor) : null,
    fecha: isoAFechaLocal(String(dto.fecha ?? "")),
    responsable: String(dto.responsable ?? ""),
    planta: String(dto.planta ?? ""),
    sacos: Number(dto.sacos ?? 0),
    pesoCampo: dto.peso_campo != null ? Number(dto.peso_campo) : null,
    pesoBruto: dto.peso_bruto != null ? Number(dto.peso_bruto) : null,
    tara: dto.tara != null ? Number(dto.tara) : null,
    pesoNeto: dto.peso_neto != null ? Number(dto.peso_neto) : null,
    diferencia: dto.diferencia != null ? Number(dto.diferencia) : null,
    merma: dto.merma != null ? Number(dto.merma) : null,
    humedad: dto.humedad != null ? Number(dto.humedad) : null,
    impurezas: dto.impurezas != null ? Number(dto.impurezas) : null,
    materiaExtrana: dto.materia_extrana != null ? Number(dto.materia_extrana) : null,
    color: dto.color != null ? String(dto.color) : null,
    olor: dto.olor != null ? String(dto.olor) : null,
    presenciaInsectos: dto.presencia_insectos != null ? String(dto.presencia_insectos) : null,
    estadoProducto: dto.estado_producto != null ? String(dto.estado_producto) : null,
    categoria: dto.categoria != null ? String(dto.categoria) : null,
    destino: dto.destino != null ? String(dto.destino) : null,
    resultado: dto.resultado != null ? String(dto.resultado) : null,
    motivo: dto.motivo != null ? String(dto.motivo) : null,
    estado: (dto.estado as EstadoRecepcion) ?? "PENDIENTE_PESAJE",
    observaciones: dto.observaciones != null ? String(dto.observaciones) : null,
    acopioId: dto.acopio_id != null ? Number(dto.acopio_id) : null,
    acopioCodigo: acopio?.codigo != null ? String(acopio.codigo) : null,
    sacosDetalle: (sacos ?? []).map((s) => ({
      id: Number(s.id ?? 0),
      codigo: String(s.codigo ?? ""),
      peso: Number(s.peso ?? 0),
      observaciones: s.observaciones != null ? String(s.observaciones) : undefined,
    })),
  };
}

// ─── API Calls ─────────────────────────────────────────────

export async function fetchRecepciones(params?: {
  search?: string;
  estado?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}): Promise<RecepcionesResponse> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const res = await api.get("/recepciones", { params: query, signal: params?.signal });
  return {
    data: (res.data.data ?? []).map(recepcionToFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchRecepcion(id: number, signal?: AbortSignal): Promise<Recepcion> {
  const res = await api.get(`/recepciones/${id}`, { signal });
  return recepcionToFrontend(res.data.data);
}

function recepcionToBackend(data: Partial<Recepcion>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.acopioId !== undefined) out.acopio_id = data.acopioId || null;
  if (data.loteProductor !== undefined) out.lote_productor = data.loteProductor || null;
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
  if (data.sacosDetalle !== undefined) {
    out.sacos_detalle = data.sacosDetalle.map((s) => ({
      codigo: s.codigo,
      peso: s.peso,
      observaciones: s.observaciones || null,
    }));
  }
  return out;
}

export async function createRecepcion(data: Partial<Recepcion>): Promise<Recepcion> {
  const res = await api.post("/recepciones", recepcionToBackend(data));
  return recepcionToFrontend(res.data.data);
}

export async function updateRecepcion(id: number, data: Partial<Recepcion>): Promise<Recepcion> {
  const res = await api.put(`/recepciones/${id}`, recepcionToBackend(data));
  return recepcionToFrontend(res.data.data);
}

export async function deleteRecepcion(id: number): Promise<void> {
  await api.delete(`/recepciones/${id}`);
}
