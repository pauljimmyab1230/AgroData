import api from "./api";

export interface ParcelaDocumento {
  id: string;
  tipo: string;
  nombreArchivo: string;
  rutaArchivo: string;
  tamanoBytes: number;
  mimeType: string;
  estado: string;
  fecha: string;
}

export interface ParcelaFoto {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  autor: string | null;
  observaciones: string | null;
  rutaArchivo: string | null;
}

export interface Parcela {
  id: string;
  codigo: string;
  nombre: string;
  productorId: string;
  productorNombre: string;
  cultivo: string;
  area: string;
  areaCertificada: string;
  areaUnidad: string;
  ubicacion: string;
  comunidad: string;
  sector: string;
  altitud: string;
  departamento: string;
  provincia: string;
  distrito: string;
  centroPoblado: string;
  ubigeo: string;
  latitud: string;
  longitud: string;
  precisionGps: string;
  tipoSuelo: string;
  textura: string;
  pendiente: string;
  fuenteAgua: string;
  sistemaRiego: string;
  zonaAgroecologica: string;
  disponibilidadAgua: string;
  observaciones: string;
  areaCalculada: string;
  perimetro: string;
  vertices: number | null;
  poligono: [number, number][] | null;
  fechaLevantamiento: string;
  responsable: string;
  certificacion: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
  _count?: { documentos: number; fotos: number };
  documentos?: ParcelaDocumento[];
  fotos?: ParcelaFoto[];
}

interface ParcelaProductorRef {
  id: string;
  codigo: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
}

interface ParcelaDTO {
  id: string;
  codigo: string;
  nombre: string;
  productor_id: string;
  productor: ParcelaProductorRef;
  cultivo: string;
  area: number | string;
  area_certificada: number | string | null;
  area_unidad: string;
  ubicacion: string | null;
  comunidad: string | null;
  sector: string | null;
  altitud: string | null;
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
  centro_poblado: string | null;
  ubigeo: string | null;
  latitud: string | null;
  longitud: string | null;
  precision_gps: string | null;
  tipo_suelo: string | null;
  textura: string | null;
  pendiente: string | null;
  fuente_agua: string | null;
  sistema_riego: string | null;
  zona_agroecologica: string | null;
  disponibilidad_agua: string | null;
  observaciones: string | null;
  area_calculada: string | null;
  perimetro: string | null;
  vertices: number | null;
  poligono: [number, number][] | null;
  fecha_levantamiento: string | null;
  responsable: string | null;
  certificacion: string;
  estado: string;
  created_at: string;
  updated_at: string;
  _count?: { documentos: number; fotos: number };
  documentos?: ParcelaDocumentoDTO[];
  fotos?: ParcelaFotoDTO[];
}

interface ParcelaDocumentoDTO {
  id: string;
  tipo: string;
  nombre_archivo: string;
  ruta_archivo: string;
  tamano_bytes: number;
  mime_type: string;
  estado: string;
  created_at: string;
}

interface ParcelaFotoDTO {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha: string | null;
  autor: string | null;
  observaciones: string | null;
  ruta_archivo: string | null;
}

const numToStr = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "";
  return String(value);
};

function documentoToFrontend(dto: ParcelaDocumentoDTO): ParcelaDocumento {
  return {
    id: dto.id,
    tipo: dto.tipo,
    nombreArchivo: dto.nombre_archivo,
    rutaArchivo: dto.ruta_archivo,
    tamanoBytes: dto.tamano_bytes,
    mimeType: dto.mime_type,
    estado: dto.estado,
    fecha: dto.created_at?.split("T")[0] ?? "",
  };
}

function fotoToFrontend(dto: ParcelaFotoDTO): ParcelaFoto {
  return {
    id: dto.id,
    titulo: dto.titulo,
    descripcion: dto.descripcion,
    fecha: dto.fecha?.split("T")[0] ?? "",
    autor: dto.autor,
    observaciones: dto.observaciones,
    rutaArchivo: dto.ruta_archivo,
  };
}

function toFrontend(dto: ParcelaDTO): Parcela {
  return {
    id: dto.id,
    codigo: dto.codigo,
    nombre: dto.nombre,
    productorId: dto.productor_id,
    productorNombre: `${dto.productor.nombres} ${dto.productor.apellido_paterno} ${dto.productor.apellido_materno}`.trim(),
    cultivo: dto.cultivo,
    area: numToStr(dto.area),
    areaCertificada: numToStr(dto.area_certificada),
    areaUnidad: dto.area_unidad,
    ubicacion: dto.ubicacion ?? "",
    comunidad: dto.comunidad ?? "",
    sector: dto.sector ?? "",
    altitud: dto.altitud ?? "",
    departamento: dto.departamento ?? "",
    provincia: dto.provincia ?? "",
    distrito: dto.distrito ?? "",
    centroPoblado: dto.centro_poblado ?? "",
    ubigeo: dto.ubigeo ?? "",
    latitud: dto.latitud ?? "",
    longitud: dto.longitud ?? "",
    precisionGps: dto.precision_gps ?? "",
    tipoSuelo: dto.tipo_suelo ?? "",
    textura: dto.textura ?? "",
    pendiente: dto.pendiente ?? "",
    fuenteAgua: dto.fuente_agua ?? "",
    sistemaRiego: dto.sistema_riego ?? "",
    zonaAgroecologica: dto.zona_agroecologica ?? "",
    disponibilidadAgua: dto.disponibilidad_agua ?? "",
    observaciones: dto.observaciones ?? "",
    areaCalculada: dto.area_calculada ?? "",
    perimetro: dto.perimetro ?? "",
    vertices: dto.vertices,
    poligono: Array.isArray(dto.poligono) ? (dto.poligono as [number, number][]) : null,
    fechaLevantamiento: dto.fecha_levantamiento?.split("T")[0] ?? "",
    responsable: dto.responsable ?? "",
    certificacion: dto.certificacion,
    estado: dto.estado,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    _count: dto._count,
    documentos: dto.documentos?.map(documentoToFrontend),
    fotos: dto.fotos?.map(fotoToFrontend),
  };
}

function toBackend(data: Partial<Parcela>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.productorId !== undefined) out.productor_id = data.productorId;
  if (data.codigo !== undefined) out.codigo = data.codigo;
  if (data.nombre !== undefined) out.nombre = data.nombre;
  if (data.cultivo !== undefined) out.cultivo_principal = data.cultivo;
  if (data.area !== undefined) out.area_total = data.area === "" ? undefined : Number(data.area);
  if (data.areaCertificada !== undefined)
    out.area_certificada = data.areaCertificada === "" ? null : Number(data.areaCertificada);
  if (data.areaUnidad !== undefined) out.area_unidad = data.areaUnidad;
  if (data.ubicacion !== undefined) out.ubicacion = data.ubicacion;
  if (data.comunidad !== undefined) out.comunidad = data.comunidad;
  if (data.sector !== undefined) out.sector = data.sector;
  if (data.altitud !== undefined) out.altitud = data.altitud;
  if (data.departamento !== undefined) out.departamento = data.departamento;
  if (data.provincia !== undefined) out.provincia = data.provincia;
  if (data.distrito !== undefined) out.distrito = data.distrito;
  if (data.centroPoblado !== undefined) out.centro_poblado = data.centroPoblado;
  if (data.ubigeo !== undefined) out.ubigeo = data.ubigeo;
  if (data.latitud !== undefined) out.latitud = data.latitud;
  if (data.longitud !== undefined) out.longitud = data.longitud;
  if (data.precisionGps !== undefined) out.precision_gps = data.precisionGps;
  if (data.tipoSuelo !== undefined) out.tipo_suelo = data.tipoSuelo;
  if (data.textura !== undefined) out.textura = data.textura;
  if (data.pendiente !== undefined) out.pendiente = data.pendiente;
  if (data.fuenteAgua !== undefined) out.fuente_agua = data.fuenteAgua;
  if (data.sistemaRiego !== undefined) out.sistema_riego = data.sistemaRiego;
  if (data.zonaAgroecologica !== undefined) out.zona_agroecologica = data.zonaAgroecologica;
  if (data.disponibilidadAgua !== undefined) out.disponibilidad_agua = data.disponibilidadAgua;
  if (data.observaciones !== undefined) out.observaciones = data.observaciones;
  if (data.areaCalculada !== undefined) out.area_calculada = data.areaCalculada;
  if (data.perimetro !== undefined) out.perimetro = data.perimetro;
  if (data.vertices !== undefined) out.vertices = data.vertices;
  if (data.poligono !== undefined) out.poligono = data.poligono;
  if (data.fechaLevantamiento !== undefined) out.fecha_levantamiento = data.fechaLevantamiento || null;
  if (data.responsable !== undefined) out.responsable = data.responsable;
  if (data.certificacion !== undefined) out.certificacion = data.certificacion;
  if (data.estado !== undefined) out.estado = data.estado;
  return out;
}

export interface ParcelasQuery {
  search?: string;
  comunidad?: string;
  cultivo?: string;
  estado?: string;
  productorId?: string;
  page?: number;
  limit?: number;
}

export async function fetchParcelas(params?: ParcelasQuery): Promise<{ data: Parcela[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.comunidad) query.comunidad = params.comunidad;
  if (params?.cultivo) query.cultivo = params.cultivo;
  if (params?.estado) query.estado = params.estado;
  if (params?.productorId) query.productor_id = params.productorId;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const res = await api.get("/parcelas", { params: query });
  return {
    data: (res.data.data ?? []).map(toFrontend),
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 20,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchParcela(id: string): Promise<Parcela> {
  const res = await api.get(`/parcelas/${id}`);
  return toFrontend(res.data.data);
}

export async function createParcela(data: Partial<Parcela>): Promise<Parcela> {
  const res = await api.post("/parcelas", toBackend(data));
  return toFrontend(res.data.data);
}

export async function updateParcela(id: string, data: Partial<Parcela>): Promise<Parcela> {
  const res = await api.put(`/parcelas/${id}`, toBackend(data));
  return toFrontend(res.data.data);
}

export async function deleteParcela(id: string): Promise<void> {
  await api.delete(`/parcelas/${id}`);
}

// ─── Documentos ─────────────────────────────────────────────

export async function fetchDocumentos(parcelaId: string): Promise<ParcelaDocumento[]> {
  const res = await api.get(`/parcelas/${parcelaId}/documentos`);
  return (res.data.data ?? []).map(documentoToFrontend);
}

export async function createDocumento(
  parcelaId: string,
  data: Pick<ParcelaDocumento, "tipo" | "nombreArchivo" | "rutaArchivo" | "tamanoBytes" | "mimeType" | "estado">,
): Promise<ParcelaDocumento> {
  const res = await api.post(`/parcelas/${parcelaId}/documentos`, {
    tipo: data.tipo,
    nombre_archivo: data.nombreArchivo,
    ruta_archivo: data.rutaArchivo,
    tamano_bytes: data.tamanoBytes,
    mime_type: data.mimeType,
    estado: data.estado,
  });
  return documentoToFrontend(res.data.data);
}

export async function deleteDocumento(parcelaId: string, documentoId: string): Promise<void> {
  await api.delete(`/parcelas/${parcelaId}/documentos/${documentoId}`);
}

// ─── Fotos ──────────────────────────────────────────────────

export async function fetchFotos(parcelaId: string): Promise<ParcelaFoto[]> {
  const res = await api.get(`/parcelas/${parcelaId}/fotos`);
  return (res.data.data ?? []).map(fotoToFrontend);
}

export async function createFoto(
  parcelaId: string,
  data: Partial<Omit<ParcelaFoto, "id">>,
): Promise<ParcelaFoto> {
  const res = await api.post(`/parcelas/${parcelaId}/fotos`, {
    titulo: data.titulo,
    descripcion: data.descripcion || null,
    fecha: data.fecha || null,
    autor: data.autor || null,
    observaciones: data.observaciones || null,
    ruta_archivo: data.rutaArchivo || null,
  });
  return fotoToFrontend(res.data.data);
}

export async function deleteFoto(parcelaId: string, fotoId: string): Promise<void> {
  await api.delete(`/parcelas/${parcelaId}/fotos/${fotoId}`);
}

// ─── Opciones de productores (para el select del formulario) ─

export async function fetchProductoresOpciones(): Promise<{ value: string; label: string }[]> {
  const res = await api.get("/productores");
  const data: Array<{ id: string; nombres: string; apellido_paterno: string; apellido_materno: string }> =
    res.data.data ?? [];
  return data.map((p) => ({
    value: p.id,
    label: `${p.nombres} ${p.apellido_paterno} ${p.apellido_materno}`.trim(),
  }));
}
