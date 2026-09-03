import api from "./api";

// ─── Types ─────────────────────────────────────────────────

export interface Cultivo {
  id: string;
  codigo: string;
  campaniaId: string;
  campaniaNombre: string;
  campaniaCodigo: string;
  productorId: string;
  productorNombre: string;
  productorCodigo: string;
  parcelaId: string;
  parcelaNombre: string;
  parcelaCodigo: string;
  cultivo: string;
  variedad: string;
  areaSembrada: number | null;
  fechaSiembra: string;
  metodoSiembra: string;
  sistemaProductivo: string;
  tipoAgricultura: string;
  certificacion: string;
  procedenciaSemilla: string;
  cantidadSemilla: number | null;
  unidadSemilla: string;
  fechaCosecha: string;
  estado: string;
  observaciones: string;
  rendimientoEsperado: number | null;
  produccionEstimada: number | null;
  destinoProduccion: string;
  distanciamientoSurcos: string;
  distanciamientoPlantas: string;
  densidadSiembra: string;
  tipoSemilla: string;
  loteSemilla: string;
  proveedorSemilla: string;
  createdAt: string;
  updatedAt: string;
}

interface CultivoDTO {
  id: string;
  codigo: string;
  campania_id: string;
  campania: { id: string; nombre: string; codigo: string };
  productor_id: string;
  productor: { id: string; nombres: string; apellido_paterno: string; apellido_materno: string; codigo?: string };
  parcela_id: string;
  parcela: { id: string; nombre: string; codigo: string; cultivo?: string; area?: number };
  cultivo: string;
  variedad: string | null;
  area_sembrada: number | null;
  fecha_siembra: string | null;
  metodo_siembra: string | null;
  sistema_productivo: string | null;
  tipo_agricultura: string | null;
  certificacion: string;
  procedencia_semilla: string | null;
  cantidad_semilla: number | null;
  unidad_semilla: string | null;
  fecha_cosecha: string | null;
  estado: string;
  observaciones: string | null;
  rendimiento_esperado: number | null;
  produccion_estimada: number | null;
  destino_produccion: string | null;
  distanciamiento_surcos: string | null;
  distanciamiento_plantas: string | null;
  densidad_siembra: string | null;
  tipo_semilla: string | null;
  lote_semilla: string | null;
  proveedor_semilla: string | null;
  created_at: string;
  updated_at: string;
}

function toFrontend(dto: CultivoDTO): Cultivo {
  const p = dto.productor;
  return {
    id: dto.id,
    codigo: dto.codigo,
    campaniaId: dto.campania_id,
    campaniaNombre: dto.campania?.nombre ?? "",
    campaniaCodigo: dto.campania?.codigo ?? "",
    productorId: String(dto.productor_id),
    productorNombre: `${p?.nombres ?? ""} ${p?.apellido_paterno ?? ""} ${p?.apellido_materno ?? ""}`.trim(),
    productorCodigo: p?.codigo ?? "",
    parcelaId: String(dto.parcela_id),
    parcelaNombre: dto.parcela?.nombre ?? "",
    parcelaCodigo: dto.parcela?.codigo ?? "",
    cultivo: dto.cultivo,
    variedad: dto.variedad ?? "",
    areaSembrada: Number(dto.area_sembrada) || 0,
    fechaSiembra: dto.fecha_siembra?.split("T")[0] ?? "",
    metodoSiembra: dto.metodo_siembra ?? "",
    sistemaProductivo: dto.sistema_productivo ?? "",
    tipoAgricultura: dto.tipo_agricultura ?? "",
    certificacion: dto.certificacion,
    procedenciaSemilla: dto.procedencia_semilla ?? "",
    cantidadSemilla: Number(dto.cantidad_semilla) || 0,
    unidadSemilla: dto.unidad_semilla ?? "",
    fechaCosecha: dto.fecha_cosecha?.split("T")[0] ?? "",
    estado: dto.estado,
    observaciones: dto.observaciones ?? "",
    rendimientoEsperado: Number(dto.rendimiento_esperado) || 0,
    produccionEstimada: Number(dto.produccion_estimada) || 0,
    destinoProduccion: dto.destino_produccion ?? "",
    distanciamientoSurcos: dto.distanciamiento_surcos ?? "",
    distanciamientoPlantas: dto.distanciamiento_plantas ?? "",
    densidadSiembra: dto.densidad_siembra ?? "",
    tipoSemilla: dto.tipo_semilla ?? "",
    loteSemilla: dto.lote_semilla ?? "",
    proveedorSemilla: dto.proveedor_semilla ?? "",
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<Cultivo>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.campaniaId !== undefined) out.campania_id = data.campaniaId;
  if (data.productorId !== undefined) out.productor_id = Number(data.productorId) || data.productorId;
  if (data.parcelaId !== undefined) out.parcela_id = Number(data.parcelaId) || data.parcelaId;
  if (data.cultivo !== undefined) out.cultivo = data.cultivo;
  if (data.variedad !== undefined) out.variedad = data.variedad || null;
  if (data.areaSembrada !== undefined) out.area_sembrada = data.areaSembrada;
  if (data.fechaSiembra !== undefined) out.fecha_siembra = data.fechaSiembra || null;
  if (data.metodoSiembra !== undefined) out.metodo_siembra = data.metodoSiembra || null;
  if (data.sistemaProductivo !== undefined) out.sistema_productivo = data.sistemaProductivo || null;
  if (data.tipoAgricultura !== undefined) out.tipo_agricultura = data.tipoAgricultura || null;
  if (data.certificacion !== undefined) out.certificacion = data.certificacion;
  if (data.procedenciaSemilla !== undefined) out.procedencia_semilla = data.procedenciaSemilla || null;
  if (data.cantidadSemilla !== undefined) out.cantidad_semilla = data.cantidadSemilla;
  if (data.unidadSemilla !== undefined) out.unidad_semilla = data.unidadSemilla || null;
  if (data.fechaCosecha !== undefined) out.fecha_cosecha = data.fechaCosecha || null;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  if (data.rendimientoEsperado !== undefined) out.rendimiento_esperado = data.rendimientoEsperado;
  if (data.produccionEstimada !== undefined) out.produccion_estimada = data.produccionEstimada;
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
  productor_id?: string;
  parcela_id?: string;
  page?: number;
  limit?: number;
}

export async function fetchCultivos(params?: CultivosQuery): Promise<{ data: Cultivo[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.estado) query.estado = params.estado;
  if (params?.campania_id) query.campania_id = params.campania_id;
  if (params?.productor_id) query.productor_id = params.productor_id;
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

export const estadosCultivoValues = ["ACTIVO", "EN_DESARROLLO", "COSECHADO", "FINALIZADO"];
export const metodosSiembraValues = ["DIRECTA", "TRASPLANTE", "ALMACIGO", "OTRO"];
export const sistemasProductivosValues = ["AGROECOLOGICO", "ORGANICO", "CONVENCIONAL", "EN_TRANSICION"];
export const tiposAgriculturaValues = ["TRADICIONAL", "TECNIFICADA", "MIXTA"];
export const certificacionesValues = ["ORGANICA", "EN_TRANSICION", "SIN_CERTIFICAR"];
export const procedenciasSemillaValues = ["CERTIFICADA", "COMUN", "PRODUCIDA_EN_CAMPO", "CONSERVADA_POR_AGRICULTOR"];
export const unidadesSemillaValues = ["kg", "lb", "qq", "t"];
export const destinosProduccionValues = ["VENTA_COOPERATIVA", "COMERCIALIZACION_LOCAL", "AUTOCONSUMO", "SEMILLA"];
export const tiposSemillaValues = ["CERTIFICADA", "COMUN", "CONSERVADA", "HIBRIDA"];

// ─── Display labels (for view mode) ────────────────────────

export const estadosCultivoLabels: Record<string, string> = {
  ACTIVO: "Activo",
  EN_DESARROLLO: "En Desarrollo",
  COSECHADO: "Cosechado",
  FINALIZADO: "Finalizado",
};

export const metodosSiembraLabels: Record<string, string> = {
  DIRECTA: "Directa",
  TRASPLANTE: "Trasplante",
  ALMACIGO: "Almácigo",
  OTRO: "Otro",
};

export const sistemasProductivosLabels: Record<string, string> = {
  AGROECOLOGICO: "Agroecológico",
  ORGANICO: "Orgánico",
  CONVENCIONAL: "Convencional",
  EN_TRANSICION: "En Transición",
};

export const tiposAgriculturaLabels: Record<string, string> = {
  TRADICIONAL: "Tradicional",
  TECNIFICADA: "Tecnificada",
  MIXTA: "Mixta",
};

export const certificacionesLabels: Record<string, string> = {
  ORGANICA: "Orgánica",
  EN_TRANSICION: "En Transición",
  SIN_CERTIFICAR: "Sin certificar",
};

export const procedenciasSemillaLabels: Record<string, string> = {
  CERTIFICADA: "Semilla Certificada",
  COMUN: "Semilla Común",
  PRODUCIDA_EN_CAMPO: "Producida en campo",
  CONSERVADA_POR_AGRICULTOR: "Conservada por el agricultor",
};

export const unidadesSemillaLabels: Record<string, string> = {
  kg: "kg",
  lb: "lb",
  qq: "qq",
  t: "t",
};

export const destinosProduccionLabels: Record<string, string> = {
  VENTA_COOPERATIVA: "Venta a la cooperativa",
  COMERCIALIZACION_LOCAL: "Comercialización local",
  AUTOCONSUMO: "Autoconsumo",
  SEMILLA: "Semilla",
};

export const tiposSemillaLabels: Record<string, string> = {
  CERTIFICADA: "Certificada",
  COMUN: "Común",
  CONSERVADA: "Conservada",
  HIBRIDA: "Híbrida",
};

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
