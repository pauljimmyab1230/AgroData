import api from "./api";

// ─── Types ─────────────────────────────────────────────────

export interface Cultivo {
  id: number;
  codigo: string;
  campaniaId: number;
  campaniaNombre: string;
  campaniaCodigo: string;
  productorId: number;
  productorNombre: string;
  productorCodigo: string;
  parcelaId: number;
  parcelaNombre: string;
  parcelaCodigo: string;
  parcelaCultivo: string;
  parcelaArea: number | null;
  cultivo: string;
  variedad: string | null;
  areaSembrada: number | null;
  fechaSiembra: string | null;
  metodoSiembra: string | null;
  sistemaProductivo: string | null;
  tipoAgricultura: string | null;
  certificacion: string;
  procedenciaSemilla: string | null;
  cantidadSemilla: number | null;
  unidadSemilla: string | null;
  fechaCosecha: string | null;
  estado: string;
  observaciones: string | null;
  rendimientoEsperado: number | null;
  produccionEstimada: number | null;
  destinoProduccion: string | null;
  distanciamientoSurcos: string | null;
  distanciamientoPlantas: string | null;
  densidadSiembra: string | null;
  tipoSemilla: string | null;
  loteSemilla: string | null;
  proveedorSemilla: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CultivoDTO {
  id: number;
  codigo: string;
  campania_id: number;
  campania: { id: number; nombre: string; codigo: string };
  parcela_id: number;
  parcela: {
    id: number;
    nombre: string;
    codigo: string;
    cultivo: string;
    area: number;
    productor: { id: number; nombres: string; apellido_paterno: string; apellido_materno: string; codigo?: string };
  };
  cultivo: string;
  variedad: string | null;
  area_sembrada: number | string | null;
  fecha_siembra: string | null;
  metodo_siembra: string | null;
  sistema_productivo: string | null;
  tipo_agricultura: string | null;
  certificacion: string;
  procedencia_semilla: string | null;
  cantidad_semilla: number | string | null;
  unidad_semilla: string | null;
  fecha_cosecha: string | null;
  estado: string;
  observaciones: string | null;
  rendimiento_esperado: number | string | null;
  produccion_estimada: number | string | null;
  destino_produccion: string | null;
  distanciamiento_surcos: string | null;
  distanciamiento_plantas: string | null;
  densidad_siembra: string | null;
  tipo_semilla: string | null;
  lote_semilla: string | null;
  proveedor_semilla: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

function toFrontend(dto: CultivoDTO): Cultivo {
  const productor = dto.parcela?.productor;
  return {
    id: dto.id,
    codigo: dto.codigo,
    campaniaId: dto.campania_id,
    campaniaNombre: dto.campania?.nombre ?? "",
    campaniaCodigo: dto.campania?.codigo ?? "",
    productorId: productor?.id ?? 0,
    productorNombre: `${productor?.nombres ?? ""} ${productor?.apellido_paterno ?? ""} ${productor?.apellido_materno ?? ""}`.trim(),
    productorCodigo: productor?.codigo ?? "",
    parcelaId: dto.parcela_id,
    parcelaNombre: dto.parcela?.nombre ?? "",
    parcelaCodigo: dto.parcela?.codigo ?? "",
    parcelaCultivo: dto.parcela?.cultivo ?? "",
    parcelaArea: dto.parcela?.area != null ? Number(dto.parcela.area) : null,
    cultivo: dto.cultivo,
    variedad: dto.variedad ?? null,
    areaSembrada: dto.area_sembrada != null ? Number(dto.area_sembrada) : null,
    fechaSiembra: dto.fecha_siembra ? dto.fecha_siembra.split("T")[0] : null,
    metodoSiembra: dto.metodo_siembra ?? null,
    sistemaProductivo: dto.sistema_productivo ?? null,
    tipoAgricultura: dto.tipo_agricultura ?? null,
    certificacion: dto.certificacion,
    procedenciaSemilla: dto.procedencia_semilla ?? null,
    cantidadSemilla: dto.cantidad_semilla != null ? Number(dto.cantidad_semilla) : null,
    unidadSemilla: dto.unidad_semilla ?? null,
    fechaCosecha: dto.fecha_cosecha ? dto.fecha_cosecha.split("T")[0] : null,
    estado: dto.estado,
    observaciones: dto.observaciones ?? null,
    rendimientoEsperado: dto.rendimiento_esperado != null ? Number(dto.rendimiento_esperado) : null,
    produccionEstimada: dto.produccion_estimada != null ? Number(dto.produccion_estimada) : null,
    destinoProduccion: dto.destino_produccion ?? null,
    distanciamientoSurcos: dto.distanciamiento_surcos ?? null,
    distanciamientoPlantas: dto.distanciamiento_plantas ?? null,
    densidadSiembra: dto.densidad_siembra ?? null,
    tipoSemilla: dto.tipo_semilla ?? null,
    loteSemilla: dto.lote_semilla ?? null,
    proveedorSemilla: dto.proveedor_semilla ?? null,
    activo: dto.activo,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<Cultivo>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.campaniaId !== undefined) out.campania_id = data.campaniaId;
  if (data.parcelaId !== undefined) out.parcela_id = data.parcelaId;
  if (data.cultivo !== undefined) out.cultivo = data.cultivo;
  if (data.variedad !== undefined) out.variedad = data.variedad || null;
  if (data.areaSembrada !== undefined) out.area_sembrada = data.areaSembrada ?? null;
  if (data.fechaSiembra !== undefined) out.fecha_siembra = data.fechaSiembra || null;
  if (data.metodoSiembra !== undefined) out.metodo_siembra = data.metodoSiembra || null;
  if (data.sistemaProductivo !== undefined) out.sistema_productivo = data.sistemaProductivo || null;
  if (data.tipoAgricultura !== undefined) out.tipo_agricultura = data.tipoAgricultura || null;
  if (data.certificacion !== undefined) out.certificacion = data.certificacion;
  if (data.procedenciaSemilla !== undefined) out.procedencia_semilla = data.procedenciaSemilla || null;
  if (data.cantidadSemilla !== undefined) out.cantidad_semilla = data.cantidadSemilla ?? null;
  if (data.unidadSemilla !== undefined) out.unidad_semilla = data.unidadSemilla || null;
  if (data.fechaCosecha !== undefined) out.fecha_cosecha = data.fechaCosecha || null;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  if (data.rendimientoEsperado !== undefined) out.rendimiento_esperado = data.rendimientoEsperado ?? null;
  if (data.produccionEstimada !== undefined) out.produccion_estimada = data.produccionEstimada ?? null;
  if (data.destinoProduccion !== undefined) out.destino_produccion = data.destinoProduccion || null;
  if (data.distanciamientoSurcos !== undefined) out.distanciamiento_surcos = data.distanciamientoSurcos || null;
  if (data.distanciamientoPlantas !== undefined) out.distanciamiento_plantas = data.distanciamientoPlantas || null;
  if (data.densidadSiembra !== undefined) out.densidad_siembra = data.densidadSiembra || null;
  if (data.tipoSemilla !== undefined) out.tipo_semilla = data.tipoSemilla || null;
  if (data.loteSemilla !== undefined) out.lote_semilla = data.loteSemilla || null;
  if (data.proveedorSemilla !== undefined) out.proveedor_semilla = data.proveedorSemilla || null;
  return out;
}

// ─── API calls ─────────────────────────────────────────────

export interface CultivosQuery {
  search?: string;
  estado?: string;
  campania_id?: string;
  parcela_id?: string;
  page?: number;
  limit?: number;
}

export async function fetchCultivos(params?: CultivosQuery): Promise<{ data: Cultivo[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.campania_id) query.campania_id = params.campania_id;
  if (params?.parcela_id) query.parcela_id = params.parcela_id;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const res = await api.get("/cultivos", { params: query });
  return {
    data: (res.data.data ?? []).map(toFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchCultivo(id: string): Promise<Cultivo> {
  const res = await api.get(`/cultivos/${id}`);
  return toFrontend(res.data.data);
}

export async function createCultivo(data: Partial<Cultivo>): Promise<Cultivo> {
  const res = await api.post("/cultivos", toBackend(data));
  return toFrontend(res.data.data);
}

export async function updateCultivo(id: string, data: Partial<Cultivo>): Promise<Cultivo> {
  const res = await api.put(`/cultivos/${id}`, toBackend(data));
  return toFrontend(res.data.data);
}

export async function deleteCultivo(id: string): Promise<void> {
  await api.delete(`/cultivos/${id}`);
}

// ─── Global Stats ─────────────────────────────────────────

export interface CultivoGlobalStats {
  total: number;
  estados: Record<string, number>;
  areaSembrada: number;
  campaniasActivas: number;
}

export async function fetchCultivoGlobalStats(params?: {
  search?: string;
  estado?: string;
  campania_id?: string;
}): Promise<CultivoGlobalStats> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.campania_id) query.campania_id = params.campania_id;

  const res = await api.get("/cultivos/stats", { params: query });
  return res.data.data;
}

// ─── Enum values (UPPERCASE, matching backend) ─────────────

export const estadosCultivoValues = ["EN_CRECIMIENTO", "COSECHADO", "PERDIDO"];
export const metodosSiembraValues = ["DIRECTA", "TRASPLANTE", "ALMACIGO", "OTRO"];
export const sistemasProductivosValues = ["AGROECOLOGICO", "ORGANICO", "CONVENCIONAL", "EN_TRANSICION"];
export const tiposAgriculturaValues = ["TRADICIONAL", "TECNIFICADA", "MIXTA"];
export const certificacionesValues = ["ORGANICA", "EN_TRANSICION", "SIN_CERTIFICAR"];
export const procedenciasSemillaValues = ["CERTIFICADA", "COMUN", "PRODUCIDA_EN_CAMPO", "CONSERVADA_POR_AGRICULTOR"];
export const unidadesSemillaValues = ["kg", "lb", "qq", "t"];
export const destinosProduccionValues = ["VENTA_COOPERATIVA", "COMERCIALIZACION_LOCAL", "AUTOCONSUMO", "SEMILLA"];
export const tiposSemillaValues = ["CERTIFICADA", "COMUN", "CONSERVADA", "HIBRIDA"];

// ─── Cultivo options ───────────────────────────────────────

export const cultivosOpciones = ["Quinua", "Papa Nativa", "Cebada", "Trigo", "Maíz", "Ají", "Frijol"];
export const variedadesOpciones = ["Negra Collana", "Blanca Junín", "Huamantanga", "Peruanita", "Bordaleza", "Blanco Gigante", "Común", "Andino"];

// ─── Additional types ──────────────────────────────────────

export type CultivoHistorialEvento = {
  id: number;
  titulo: string;
  fecha?: string;
  descripcion?: string;
  tipo: "registro" | "siembra" | "emergencia" | "actividad" | "inspeccion" | "floracion" | "cosecha";
  completado: boolean;
};
