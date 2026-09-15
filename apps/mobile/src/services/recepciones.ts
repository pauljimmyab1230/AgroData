import api from "./api";

// ─── Types ─────────────────────────────────────────────────

export type EstadoRecepcion = "PENDIENTE_PESAJE" | "EN_VERIFICACION" | "APROBADA" | "RECHAZADA";

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
    fecha: String(dto.fecha ?? "").split("T")[0],
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

  const res = await api.get("/recepcion", { params: query, signal: params?.signal });
  return {
    data: (res.data.data ?? []).map(recepcionToFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchRecepcion(id: number, signal?: AbortSignal): Promise<Recepcion> {
  const res = await api.get(`/recepcion/${id}`, { signal });
  return recepcionToFrontend(res.data.data);
}

export async function deleteRecepcion(id: number): Promise<void> {
  await api.delete(`/recepcion/${id}`);
}
