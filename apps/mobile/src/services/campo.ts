import api from "./api";

// ─── Sanitization Utilities ────────────────────────────────

function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/`/g, "&#x60;");
}

function sanitizeNumber(value: unknown, fallback: number = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function sanitizeNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function sanitizeStringOrNull(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

function formatDateToISO(dateStr: string | undefined | null): string | undefined {
  if (!dateStr) return undefined;
  if (dateStr.includes('T')) return dateStr;
  return `${dateStr}T00:00:00.000Z`;
}

// ─── Parcelas ───────────────────────────────────────────────

export interface Parcela {
  id: number;
  codigo: string;
  nombre: string;
  productorId: number;
  productor?: { id: number; nombres: string; apellidoPaterno: string; apellidoMaterno: string; codigo: string };
  area: number;
  areaCertificada: number | null;
  areaUnidad: string;
  cultivo: string | null;
  estado: string;
  certificacion: string | null;
  acreditacion: string | null;
  ubicacion: string | null;
  sector: string | null;
  comunidad: string | null;
  centroPoblado: string | null;
  departamento: string;
  provincia: string;
  distrito: string;
  latitud: string | null;
  longitud: string | null;
  altitud: string | null;
  precisionGps: string | null;
  utmEste: string | null;
  utmNorte: string | null;
  utmZona: string | null;
  tipoSuelo: string | null;
  textura: string | null;
  pendiente: string | null;
  fuenteAgua: string | null;
  sistemaRiego: string | null;
  zonaAgroecologica: string | null;
  disponibilidadAgua: string | null;
  observaciones: string | null;
  poligono: number[][] | null;
  areaCalculada: string | null;
  perimetro: string | null;
  vertices: number | null;
  fechaLevantamiento: string | null;
  responsable: string | null;
}

export interface ParcelasResponse {
  data: Parcela[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ParcelaStats {
  total: number;
  areaTotal: number;
  productoresUnicos: number;
  certificadas: number;
}

export interface ParcelaHistorial {
  id: number;
  parcela_id: number;
  tipo: string;
  titulo: string;
  descripcion: string | null;
  usuario: string | null;
  created_at: string;
}

export interface ParcelaDocumento {
  id: number;
  parcela_id: number;
  tipo: string;
  nombre_archivo: string;
  ruta_archivo: string;
  tamano_bytes: number;
  mime_type: string;
  estado: string;
  created_at: string;
}

export interface ParcelaFoto {
  id: number;
  parcela_id: number;
  titulo: string;
  descripcion: string | null;
  fecha: string | null;
  autor: string | null;
  observaciones: string | null;
  ruta_archivo: string | null;
  created_at: string;
}

function parcelaToFrontend(dto: Record<string, unknown>): Parcela {
  const productor = dto.productor as Record<string, unknown> | undefined;
  return {
    id: sanitizeNumber(dto.id),
    codigo: String(dto.codigo ?? ""),
    nombre: String(dto.nombre ?? ""),
    productorId: sanitizeNumber(dto.productores_id ?? (dto as Record<string, unknown>).productorId ?? 0),
    productor: productor ? {
      id: sanitizeNumber(productor.id),
      nombres: String(productor.nombres ?? ""),
      apellidoPaterno: String(productor.apellido_paterno ?? ""),
      apellidoMaterno: String(productor.apellido_materno ?? ""),
      codigo: String(productor.codigo ?? ""),
    } : undefined,
    area: sanitizeNumber(dto.area ?? 0),
    areaCertificada: sanitizeNumberOrNull(dto.area_certificada),
    areaUnidad: String(dto.area_unidad ?? "ha"),
    cultivo: sanitizeStringOrNull(dto.cultivo ?? dto.cultivo_principal),
    estado: String(dto.estado ?? "ACTIVA"),
    certificacion: sanitizeStringOrNull(dto.certificacion),
    acreditacion: sanitizeStringOrNull(dto.acreditacion),
    ubicacion: sanitizeStringOrNull(dto.ubicacion),
    sector: sanitizeStringOrNull(dto.sector),
    comunidad: sanitizeStringOrNull(dto.comunidad),
    centroPoblado: sanitizeStringOrNull(dto.centro_poblado),
    departamento: String(dto.departamento ?? ""),
    provincia: String(dto.provincia ?? ""),
    distrito: String(dto.distrito ?? ""),
    latitud: sanitizeStringOrNull(dto.latitud),
    longitud: sanitizeStringOrNull(dto.longitud),
    altitud: sanitizeStringOrNull(dto.altitud),
    precisionGps: sanitizeStringOrNull(dto.precision_gps),
    utmEste: sanitizeStringOrNull(dto.utm_este),
    utmNorte: sanitizeStringOrNull(dto.utm_norte),
    utmZona: sanitizeStringOrNull(dto.utm_zona),
    tipoSuelo: sanitizeStringOrNull(dto.tipo_suelo),
    textura: sanitizeStringOrNull(dto.textura),
    pendiente: sanitizeStringOrNull(dto.pendiente),
    fuenteAgua: sanitizeStringOrNull(dto.fuente_agua),
    sistemaRiego: sanitizeStringOrNull(dto.sistema_riego),
    zonaAgroecologica: sanitizeStringOrNull(dto.zona_agroecologica),
    disponibilidadAgua: sanitizeStringOrNull(dto.disponibilidad_agua),
    observaciones: sanitizeStringOrNull(dto.observaciones),
    poligono: (() => {
      const raw = dto.poligono;
      if (!raw) return null;
      if (Array.isArray(raw)) return raw as number[][];
      if (typeof raw === "string") {
        try {
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : null;
        } catch { return null; }
      }
      return null;
    })(),
    areaCalculada: sanitizeStringOrNull(dto.area_calculada),
    perimetro: sanitizeStringOrNull(dto.perimetro),
    vertices: sanitizeNumberOrNull(dto.vertices),
    fechaLevantamiento: sanitizeStringOrNull(dto.fecha_levantamiento),
    responsable: sanitizeStringOrNull(dto.responsable),
  };
}

function parcelaToBackend(data: Partial<Parcela>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.nombre !== undefined) out.nombre = data.nombre;
  if (data.productorId !== undefined) out.productores_id = data.productorId;
  if (data.area !== undefined) out.area_total = data.area;
  if (data.areaCertificada !== undefined) out.area_certificada = data.areaCertificada;
  if (data.areaUnidad !== undefined) out.area_unidad = data.areaUnidad;
  if (data.cultivo !== undefined) out.cultivo_principal = data.cultivo || null;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.certificacion !== undefined) out.certificacion = data.certificacion || null;
  if (data.acreditacion !== undefined) out.acreditacion = data.acreditacion || null;
  if (data.ubicacion !== undefined) out.ubicacion = data.ubicacion || null;
  if (data.sector !== undefined) out.sector = data.sector || null;
  if (data.comunidad !== undefined) out.comunidad = data.comunidad || null;
  if (data.centroPoblado !== undefined) out.centro_poblado = data.centroPoblado || null;
  if (data.departamento !== undefined) out.departamento = data.departamento || null;
  if (data.provincia !== undefined) out.provincia = data.provincia || null;
  if (data.distrito !== undefined) out.distrito = data.distrito || null;
  if (data.latitud !== undefined) out.latitud = data.latitud || null;
  if (data.longitud !== undefined) out.longitud = data.longitud || null;
  if (data.altitud !== undefined) out.altitud = data.altitud || null;
  if (data.precisionGps !== undefined) out.precision_gps = data.precisionGps || null;
  if (data.utmEste !== undefined) out.utm_este = data.utmEste || null;
  if (data.utmNorte !== undefined) out.utm_norte = data.utmNorte || null;
  if (data.utmZona !== undefined) out.utm_zona = data.utmZona || null;
  if (data.tipoSuelo !== undefined) out.tipo_suelo = data.tipoSuelo || null;
  if (data.textura !== undefined) out.textura = data.textura || null;
  if (data.pendiente !== undefined) out.pendiente = data.pendiente || null;
  if (data.fuenteAgua !== undefined) out.fuente_agua = data.fuenteAgua || null;
  if (data.sistemaRiego !== undefined) out.sistema_riego = data.sistemaRiego || null;
  if (data.zonaAgroecologica !== undefined) out.zona_agroecologica = data.zonaAgroecologica || null;
  if (data.disponibilidadAgua !== undefined) out.disponibilidad_agua = data.disponibilidadAgua || null;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  if (data.poligono !== undefined) {
    if (data.poligono && Array.isArray(data.poligono) && data.poligono.length >= 3) {
      out.poligono = data.poligono;
    } else {
      out.poligono = null;
    }
  }
  if (data.fechaLevantamiento !== undefined) out.fecha_levantamiento = formatDateToISO(data.fechaLevantamiento) || null;
  if (data.responsable !== undefined) out.responsable = data.responsable || null;
  return out;
}

export async function fetchParcelas(filters?: {
  search?: string;
  page?: number;
  limit?: number;
  comunidad?: string;
  cultivo?: string;
  estado?: string;
  productor_id?: number;
}, signal?: AbortSignal): Promise<ParcelasResponse> {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));
  if (filters?.comunidad) params.append("comunidad", filters.comunidad);
  if (filters?.cultivo) params.append("cultivo", filters.cultivo);
  if (filters?.estado) params.append("estado", filters.estado);
  if (filters?.productor_id) params.append("productor_id", String(filters.productor_id));

  const { data } = await api.get(`/parcelas?${params.toString()}`, { signal });
  return {
    ...data,
    data: (data.data ?? []).map(parcelaToFrontend),
  };
}

export async function fetchParcelaStats(filters?: {
  search?: string;
  comunidad?: string;
  cultivo?: string;
  estado?: string;
  productor_id?: number;
}, signal?: AbortSignal): Promise<ParcelaStats> {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.comunidad) params.append("comunidad", filters.comunidad);
  if (filters?.cultivo) params.append("cultivo", filters.cultivo);
  if (filters?.estado) params.append("estado", filters.estado);
  if (filters?.productor_id) params.append("productor_id", String(filters.productor_id));

  const { data } = await api.get(`/parcelas/stats?${params.toString()}`, { signal });
  return data.data ?? data;
}

export async function fetchParcela(id: number, signal?: AbortSignal): Promise<Parcela> {
  const { data } = await api.get(`/parcelas/${id}`, { signal });
  return parcelaToFrontend(data.data ?? data);
}

export async function fetchParcelaHistorial(id: number, signal?: AbortSignal): Promise<ParcelaHistorial[]> {
  const { data } = await api.get(`/parcelas/${id}/historial`, { signal });
  return data.data ?? [];
}

export async function createParcela(data: Partial<Parcela>): Promise<Parcela> {
  const { data: res } = await api.post("/parcelas", parcelaToBackend(data));
  return parcelaToFrontend(res.data ?? res);
}

export async function updateParcela(id: number, data: Partial<Parcela>): Promise<Parcela> {
  const { data: res } = await api.put(`/parcelas/${id}`, parcelaToBackend(data));
  return parcelaToFrontend(res.data ?? res);
}

export async function deleteParcela(id: number): Promise<void> {
  await api.delete(`/parcelas/${id}`);
}

// ─── Documentos ─────────────────────────────────────────────

export async function fetchParcelaDocumentos(parcelaId: number, signal?: AbortSignal): Promise<ParcelaDocumento[]> {
  const { data } = await api.get(`/parcelas/${parcelaId}/documentos`, { signal });
  return data.data ?? [];
}

export async function createParcelaDocumento(parcelaId: number, doc: Omit<ParcelaDocumento, "id" | "parcela_id" | "created_at">): Promise<ParcelaDocumento> {
  const { data: res } = await api.post(`/parcelas/${parcelaId}/documentos`, doc);
  return res.data ?? res;
}

export async function deleteParcelaDocumento(parcelaId: number, docId: number): Promise<void> {
  await api.delete(`/parcelas/${parcelaId}/documentos/${docId}`);
}

// ─── Fotos ──────────────────────────────────────────────────

export async function fetchParcelaFotos(parcelaId: number, signal?: AbortSignal): Promise<ParcelaFoto[]> {
  const { data } = await api.get(`/parcelas/${parcelaId}/fotos`, { signal });
  return data.data ?? [];
}

export async function createParcelaFoto(parcelaId: number, foto: Omit<ParcelaFoto, "id" | "parcela_id" | "created_at">): Promise<ParcelaFoto> {
  const { data: res } = await api.post(`/parcelas/${parcelaId}/fotos`, foto);
  return res.data ?? res;
}

export async function deleteParcelaFoto(parcelaId: number, fotoId: number): Promise<void> {
  await api.delete(`/parcelas/${parcelaId}/fotos/${fotoId}`);
}

// ─── Campañas ───────────────────────────────────────────────

export interface Campania {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  anio_agricola: string;
  fechaInicio: string;
  fechaFin: string | null;
  estado: string;
  responsable: string;
  tecnicoCoordinador: string;
  objetivo: string;
  observaciones: string | null;
}

export interface CampaniasResponse {
  data: Campania[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function campaniaToFrontend(dto: Record<string, unknown>): Campania {
  return {
    id: sanitizeNumber(dto.id),
    codigo: String(dto.codigo ?? ""),
    nombre: String(dto.nombre ?? ""),
    descripcion: sanitizeStringOrNull(dto.descripcion),
    anio_agricola: String(dto.anio_agricola ?? ""),
    fechaInicio: String(dto.fecha_inicio ?? dto.fechaInicio ?? ""),
    fechaFin: sanitizeStringOrNull(dto.fecha_fin ?? dto.fechaFin),
    estado: String(dto.estado ?? "PLANIFICADA"),
    responsable: String(dto.responsable ?? ""),
    tecnicoCoordinador: String(dto.tecnico_coordinador ?? ""),
    objetivo: String(dto.objetivo ?? ""),
    observaciones: sanitizeStringOrNull(dto.observaciones),
  };
}

function campaniaToBackend(data: Partial<Campania>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.nombre !== undefined) out.nombre = data.nombre;
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.descripcion !== undefined) out.descripcion = data.descripcion || null;
  if (data.anio_agricola !== undefined) out.anio_agricola = data.anio_agricola;
  if (data.fechaInicio !== undefined) out.fecha_inicio = formatDateToISO(data.fechaInicio);
  if (data.fechaFin !== undefined) out.fecha_fin = formatDateToISO(data.fechaFin) || null;
  if (data.estado !== undefined) out.estado = data.estado;
  if (data.responsable !== undefined) out.responsable = data.responsable;
  if (data.tecnicoCoordinador !== undefined) out.tecnico_coordinador = data.tecnicoCoordinador;
  if (data.objetivo !== undefined) out.objetivo = data.objetivo || null;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones || null;
  return out;
}

export async function fetchCampanias(filters?: {
  search?: string;
  estado?: string;
  page?: number;
  limit?: number;
}, signal?: AbortSignal): Promise<CampaniasResponse> {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.estado) params.append("estado", filters.estado);
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const { data } = await api.get(`/campanias?${params.toString()}`, { signal });
  return {
    ...data,
    data: (data.data ?? []).map(campaniaToFrontend),
  };
}

export async function fetchCampania(id: number, signal?: AbortSignal): Promise<Campania> {
  const { data } = await api.get(`/campanias/${id}`, { signal });
  return campaniaToFrontend(data.data ?? data);
}

export async function createCampania(data: Partial<Campania>): Promise<Campania> {
  const { data: res } = await api.post("/campanias", campaniaToBackend(data));
  return campaniaToFrontend(res.data ?? res);
}

export async function updateCampania(id: number, data: Partial<Campania>): Promise<Campania> {
  const { data: res } = await api.patch(`/campanias/${id}`, campaniaToBackend(data));
  return campaniaToFrontend(res.data ?? res);
}

export async function deleteCampania(id: number): Promise<void> {
  await api.delete(`/campanias/${id}`);
}

// ─── Cultivos ───────────────────────────────────────────────

export interface Cultivo {
  id: number;
  codigo: string;
  cultivo: string;
  variedad: string | null;
  parcelaId: number;
  parcela?: { id: number; nombre: string; codigo: string; cultivo: string; area: number; productor: { id: number; nombres: string; apellidoPaterno: string; apellidoMaterno: string; codigo: string } };
  campaniaId: number;
  campania?: { id: number; nombre: string; codigo: string };
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
}

export interface CultivosResponse {
  data: Cultivo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CultivoStats {
  total: number;
  estados: Record<string, number>;
  areaSembrada: number;
  campaniasActivas: number;
}

function cultivoToFrontend(dto: Record<string, unknown>): Cultivo {
  const parcela = dto.parcela as Record<string, unknown> | undefined;
  const campania = dto.campania as Record<string, unknown> | undefined;
  const productor = parcela?.productor as Record<string, unknown> | undefined;
  return {
    id: sanitizeNumber(dto.id),
    codigo: String(dto.codigo ?? ""),
    cultivo: String(dto.cultivo ?? ""),
    variedad: sanitizeStringOrNull(dto.variedad),
    parcelaId: sanitizeNumber(dto.parcela_id ?? (dto as Record<string, unknown>).parcelaId ?? 0),
    parcela: parcela ? {
      id: sanitizeNumber(parcela.id),
      nombre: String(parcela.nombre ?? ""),
      codigo: String(parcela.codigo ?? ""),
      cultivo: String(parcela.cultivo ?? ""),
      area: sanitizeNumber(parcela.area),
      productor: productor ? {
        id: sanitizeNumber(productor.id),
        nombres: String(productor.nombres ?? ""),
        apellidoPaterno: String(productor.apellido_paterno ?? ""),
        apellidoMaterno: String(productor.apellido_materno ?? ""),
        codigo: String(productor.codigo ?? ""),
      } : { id: 0, nombres: "", apellidoPaterno: "", apellidoMaterno: "", codigo: "" },
    } : undefined,
    campaniaId: sanitizeNumber(dto.campania_id ?? (dto as Record<string, unknown>).campaniaId ?? 0),
    campania: campania ? { id: sanitizeNumber(campania.id), nombre: String(campania.nombre ?? ""), codigo: String(campania.codigo ?? "") } : undefined,
    areaSembrada: sanitizeNumberOrNull(dto.area_sembrada),
    fechaSiembra: sanitizeStringOrNull(dto.fecha_siembra)?.split("T")[0] ?? null,
    metodoSiembra: sanitizeStringOrNull(dto.metodo_siembra),
    sistemaProductivo: sanitizeStringOrNull(dto.sistema_productivo),
    tipoAgricultura: sanitizeStringOrNull(dto.tipo_agricultura),
    certificacion: String(dto.certificacion ?? "SIN_CERTIFICAR"),
    procedenciaSemilla: sanitizeStringOrNull(dto.procedencia_semilla),
    cantidadSemilla: sanitizeNumberOrNull(dto.cantidad_semilla),
    unidadSemilla: sanitizeStringOrNull(dto.unidad_semilla),
    fechaCosecha: sanitizeStringOrNull(dto.fecha_cosecha)?.split("T")[0] ?? null,
    estado: String(dto.estado ?? "EN_CRECIMIENTO"),
    observaciones: sanitizeStringOrNull(dto.observaciones),
    rendimientoEsperado: sanitizeNumberOrNull(dto.rendimiento_esperado),
    produccionEstimada: sanitizeNumberOrNull(dto.produccion_estimada),
    destinoProduccion: sanitizeStringOrNull(dto.destino_produccion),
    distanciamientoSurcos: sanitizeStringOrNull(dto.distanciamiento_surcos),
    distanciamientoPlantas: sanitizeStringOrNull(dto.distanciamiento_plantas),
    densidadSiembra: sanitizeStringOrNull(dto.densidad_siembra),
    tipoSemilla: sanitizeStringOrNull(dto.tipo_semilla),
    loteSemilla: sanitizeStringOrNull(dto.lote_semilla),
    proveedorSemilla: sanitizeStringOrNull(dto.proveedor_semilla),
  };
}

function cultivoToBackend(data: Partial<Cultivo>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.cultivo !== undefined) out.cultivo = data.cultivo;
  if (data.variedad !== undefined) out.variedad = data.variedad || null;
  if (data.parcelaId !== undefined) out.parcela_id = data.parcelaId;
  if (data.campaniaId !== undefined) out.campania_id = data.campaniaId;
  if (data.areaSembrada !== undefined) out.area_sembrada = data.areaSembrada;
  if (data.fechaSiembra !== undefined) out.fecha_siembra = formatDateToISO(data.fechaSiembra) || null;
  if (data.metodoSiembra !== undefined) out.metodo_siembra = data.metodoSiembra || null;
  if (data.sistemaProductivo !== undefined) out.sistema_productivo = data.sistemaProductivo || null;
  if (data.tipoAgricultura !== undefined) out.tipo_agricultura = data.tipoAgricultura || null;
  if (data.certificacion !== undefined) out.certificacion = data.certificacion;
  if (data.procedenciaSemilla !== undefined) out.procedencia_semilla = data.procedenciaSemilla || null;
  if (data.cantidadSemilla !== undefined) out.cantidad_semilla = data.cantidadSemilla;
  if (data.unidadSemilla !== undefined) out.unidad_semilla = data.unidadSemilla || null;
  if (data.fechaCosecha !== undefined) out.fecha_cosecha = formatDateToISO(data.fechaCosecha) || null;
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

export async function fetchCultivos(filters?: {
  search?: string;
  page?: number;
  limit?: number;
}, signal?: AbortSignal): Promise<CultivosResponse> {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const { data } = await api.get(`/cultivos?${params.toString()}`, { signal });
  return {
    ...data,
    data: (data.data ?? []).map(cultivoToFrontend),
  };
}

export async function fetchCultivo(id: number, signal?: AbortSignal): Promise<Cultivo> {
  const { data } = await api.get(`/cultivos/${id}`, { signal });
  return cultivoToFrontend(data.data ?? data);
}

export async function createCultivo(data: Partial<Cultivo>): Promise<Cultivo> {
  const { data: res } = await api.post("/cultivos", cultivoToBackend(data));
  return cultivoToFrontend(res.data ?? res);
}

export async function updateCultivo(id: number, data: Partial<Cultivo>): Promise<Cultivo> {
  const { data: res } = await api.put(`/cultivos/${id}`, cultivoToBackend(data));
  return cultivoToFrontend(res.data ?? res);
}

export async function deleteCultivo(id: number): Promise<void> {
  await api.delete(`/cultivos/${id}`);
}

export async function fetchCultivoStats(filters?: {
  search?: string;
  estado?: string;
  campania_id?: string;
}, signal?: AbortSignal): Promise<CultivoStats> {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.estado) params.append("estado", filters.estado);
  if (filters?.campania_id) params.append("campania_id", filters.campania_id);

  const { data } = await api.get(`/cultivos/stats?${params.toString()}`, { signal });
  return data.data ?? data;
}

export { sanitizeHtml, sanitizeNumber, sanitizeNumberOrNull, sanitizeStringOrNull };
