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
  fechaEmergencia: string;
  fechaFloracion: string;
  fechaCosecha: string;
  estado: string;
  observaciones: string;
  estadoFenologico: string;
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
  fecha_emergencia: string | null;
  fecha_floracion: string | null;
  fecha_cosecha: string | null;
  estado: string;
  observaciones: string | null;
  estado_fenologico: string | null;
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
    productorId: dto.productor_id,
    productorNombre: `${p?.nombres ?? ""} ${p?.apellido_paterno ?? ""} ${p?.apellido_materno ?? ""}`.trim(),
    productorCodigo: p?.codigo ?? "",
    parcelaId: dto.parcela_id,
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
    fechaEmergencia: dto.fecha_emergencia?.split("T")[0] ?? "",
    fechaFloracion: dto.fecha_floracion?.split("T")[0] ?? "",
    fechaCosecha: dto.fecha_cosecha?.split("T")[0] ?? "",
    estado: dto.estado,
    observaciones: dto.observaciones ?? "",
    estadoFenologico: dto.estado_fenologico ?? "",
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
  if (data.productorId !== undefined) out.productor_id = data.productorId;
  if (data.parcelaId !== undefined) out.parcela_id = data.parcelaId;
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
  if (data.fechaEmergencia !== undefined) out.fecha_emergencia = data.fechaEmergencia || null;
  if (data.fechaFloracion !== undefined) out.fecha_floracion = data.fechaFloracion || null;
  if (data.fechaCosecha !== undefined) out.fecha_cosecha = data.fechaCosecha || null;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  if (data.estadoFenologico !== undefined) out.estado_fenologico = data.estadoFenologico || null;
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

// ─── Options for selects ───────────────────────────────────

export const metodosSiembra = ["DIRECTA", "TRASPLANTE", "ALMACIGO", "OTRO"];
export const sistemasProductivos = ["AGROECOLOGICO", "ORGANICO", "CONVENCIONAL", "EN_TRANSICION"];
export const tiposAgricultura = ["TRADICIONAL", "TECNIFICADA", "MIXTA"];
export const certificacionesCultivo = ["ORGANICA", "EN_TRANSICION", "SIN_CERTIFICAR"];
export const procedenciasSemilla = ["CERTIFICADA", "COMUN", "PRODUCIDA_EN_CAMPO", "CONSERVADA_POR_AGRICULTOR"];
export const unidadesSemilla = ["kg", "lb", "qq", "t"];
export const estadosCultivo = ["ACTIVO", "EN_DESARROLLO", "COSECHADO", "FINALIZADO"];
export const destinosProduccion = ["VENTA_COOPERATIVA", "COMERCIALIZACION_LOCAL", "AUTOCONSUMO", "SEMILLA"];

// ─── Additional types (for photos, documents, history) ─────

export type CultivoFoto = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha?: string;
  responsable?: string;
};

export type CultivoDocumento = {
  id: number;
  tipo: string;
  nombre: string;
  tamano: string;
  fecha: string;
  estado: string;
  categoria: "Técnicos" | "Análisis" | "Otros";
};

export type CultivoHistorialEvento = {
  id: number;
  titulo: string;
  fecha?: string;
  descripcion?: string;
  tipo: "registro" | "siembra" | "emergencia" | "actividad" | "inspeccion" | "floracion" | "cosecha";
  completado: boolean;
};

// ─── Display-friendly option arrays ────────────────────────

export const cultivosOpciones = ["Quinua", "Papa Nativa", "Cebada", "Trigo", "Maíz", "Ají", "Frijol"];
export const productoresOpciones = ["Apolinario Condori", "María Huamán", "Pedro Rojas", "Rosa Chávez", "Juan Gutiérrez", "Lucía Mendoza"];
export const campanasOpciones = ["Campaña 2025-2026", "Campaña 2024-2025"];
export const parcelasOpciones = ["Parcela A - Ñawpa Rumi", "Parcela B - Pampa Urku", "Parcela C - Qucha Pata"];
export const variedadesOpciones = ["Negra Collana", "Blanca Junín", "Huamantanga", "Peruanita", "Bordaleza", "Blanco Gigante", "Común", "Andino"];
export const estadosOpciones = ["Activo", "En Desarrollo", "Cosechado", "Finalizado"];
export const metodosSiembraOpciones = ["Directa", "Trasplante", "Almácigo", "Otro"];
export const sistemasProductivosOpciones = ["Agroecológico", "Orgánica", "Convencional", "En Transición"];
export const tiposAgriculturaOpciones = ["Tradicional", "Tecnificada", "Mixta"];
export const certificacionesOpciones = ["Orgánica", "En Transición", "Sin certificar"];
export const procedenciasSemillaOpciones = ["Semilla Certificada", "Semilla Común", "Producida en campo", "Conservada por el agricultor"];
export const unidadesSemillaOpciones = ["kg", "lb", "qq", "t"];
export const fenologicoOpciones = ["Preparación del terreno", "Siembra", "Emergencia", "Desarrollo vegetativo", "Floración", "Fructificación", "Maduración", "Cosecha"];
export const destinosProduccionOpciones = ["Venta a la cooperativa", "Comercialización local", "Autoconsumo", "Semilla"];
export const tiposSemillaOpciones = ["Certificada", "Común", "Conservada", "Híbrida"];
