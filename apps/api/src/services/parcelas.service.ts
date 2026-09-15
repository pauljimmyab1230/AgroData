import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';
import { polygon as turfPolygon } from '@turf/helpers';
import turfArea from '@turf/area';

type Coord = [number, number];

type CoordInput = [number, number] | number[];

function isValidCoordArray(coords: unknown): coords is Coord[] {
  return (
    Array.isArray(coords) &&
    coords.length >= 3 &&
    coords.every(
      (c): c is Coord =>
        Array.isArray(c) &&
        c.length === 2 &&
        typeof c[0] === 'number' &&
        typeof c[1] === 'number' &&
        Number.isFinite(c[0]) &&
        Number.isFinite(c[1]),
    )
  );
}

function sanitizeCoords(coords: unknown): Coord[] | null {
  if (!isValidCoordArray(coords)) return null;
  return coords.map((c) => [c[0], c[1]] as Coord);
}

function validatePolygon(coords: Coord[]): { valid: boolean; error?: string } {
  if (coords.length < 3) {
    return { valid: false, error: 'El polígono debe tener al menos 3 vértices' };
  }

  for (let i = 0; i < coords.length; i++) {
    const [lat, lng] = coords[i];
    if (lat < -90 || lat > 90) {
      return { valid: false, error: `Latitud ${lat} fuera de rango [-90, 90] en vértice ${i + 1}` };
    }
    if (lng < -180 || lng > 180) {
      return { valid: false, error: `Longitud ${lng} fuera de rango [-180, 180] en vértice ${i + 1}` };
    }
  }

  const closed = coords[0][0] === coords[coords.length - 1][0] && coords[0][1] === coords[coords.length - 1][1];
  const ring = closed ? coords : [...coords, coords[0]];

  try {
    const geom = turfPolygon([ring]);
    const area = turfArea(geom);
    if (area <= 0) {
      return { valid: false, error: 'El polígono tiene área cero o negativa' };
    }
  } catch {
    return { valid: false, error: 'Geometría del polígono inválida' };
  }

  const seen = new Set<string>();
  for (const [lat, lng] of coords) {
    const key = `${lat.toFixed(8)},${lng.toFixed(8)}`;
    if (seen.has(key)) {
      return { valid: false, error: 'El polígono tiene vértices duplicados consecutivos' };
    }
    seen.add(key);
  }

  return { valid: true };
}

function coordsToJson(coords: Coord[] | null): string | null {
  if (!coords || coords.length < 3) return null;
  const closed = coords[0][0] === coords[coords.length - 1][0] && coords[0][1] === coords[coords.length - 1][1];
  const ring = closed ? coords : [...coords, coords[0]];
  return JSON.stringify(ring);
}

function jsonToCoords(json: string | null): Coord[] | null {
  if (!json) return null;
  try {
    const parsed: unknown = JSON.parse(json);
    if (!isValidCoordArray(parsed)) return null;
    return parsed.map((c) => [c[0], c[1]] as Coord);
  } catch {
    return null;
  }
}

function calculatePolygonMetrics(coords: Coord[]): { areaHa: number; perimeterM: number } {
  const closed = coords[0][0] === coords[coords.length - 1][0] && coords[0][1] === coords[coords.length - 1][1];
  const ring = closed ? coords : [...coords, coords[0]];
  const geom = turfPolygon([ring]);
  const areaHa = turfArea(geom) / 10000;

  let perimeterM = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [lat1, lng1] = ring[i];
    const [lat2, lng2] = ring[i + 1];
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    perimeterM += 2 * 6371000 * Math.asin(Math.sqrt(a));
  }

  return { areaHa, perimeterM };
}

const productorSelect = {
  id: true,
  codigo: true,
  nombres: true,
  apellido_paterno: true,
  apellido_materno: true,
} as const;

export const getStats = async (filters: {
  search?: string;
  comunidad?: string;
  cultivo?: string;
  estado?: string;
  productores_id?: string;
}) => {
  const where: Record<string, unknown> = { activo: true };
  if (filters.comunidad) where.comunidad = filters.comunidad;
  if (filters.cultivo) where.cultivo = filters.cultivo;
  if (filters.estado) where.estado = filters.estado;
  if (filters.productores_id) where.productores_id = Number(filters.productores_id);
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    where.OR = [
      { codigo: { contains: searchTerm } },
      { nombre: { contains: searchTerm } },
      { cultivo: { contains: searchTerm } },
      { comunidad: { contains: searchTerm } },
      { productor: { nombres: { contains: searchTerm } } },
      { productor: { apellido_paterno: { contains: searchTerm } } },
      { productor: { apellido_materno: { contains: searchTerm } } },
    ];
  }
  const [total, areaResult, productoresResult, certificadasResult] = await Promise.all([
    prisma.parcela.count({ where }),
    prisma.parcela.aggregate({ where, _sum: { area: true } }),
    prisma.parcela.findMany({
      where,
      select: { productores_id: true },
      distinct: ['productores_id'],
    }),
    prisma.parcela.count({
      where: { ...where, certificacion: 'ORGANICA' },
    }),
  ]);
  return {
    total,
    areaTotal: Number(areaResult._sum.area ?? 0),
    productoresUnicos: productoresResult.length,
    certificadas: certificadasResult,
  };
};

const generateCodigoParcela = async (): Promise<string> => {
  return prisma.$transaction(async (tx) => {
    const last = await tx.parcela.findFirst({
      orderBy: { codigo: 'desc' },
      select: { codigo: true },
    });
    if (!last) return 'PAR-001';
    const num = parseInt(last.codigo.replace('PAR-', ''), 10) + 1;
    return `PAR-${String(num).padStart(3, '0')}`;
  });
};

export const getAll = async (filters: {
  search?: string;
  comunidad?: string;
  cultivo?: string;
  estado?: string;
  productores_id?: string;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };
  if (filters.comunidad) where.comunidad = filters.comunidad;
  if (filters.cultivo) where.cultivo = filters.cultivo;
  if (filters.estado) where.estado = filters.estado;
  if (filters.productores_id) where.productores_id = Number(filters.productores_id);
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    where.OR = [
      { codigo: { contains: searchTerm } },
      { nombre: { contains: searchTerm } },
      { cultivo: { contains: searchTerm } },
      { comunidad: { contains: searchTerm } },
      { productor: { nombres: { contains: searchTerm } } },
      { productor: { apellido_paterno: { contains: searchTerm } } },
      { productor: { apellido_materno: { contains: searchTerm } } },
    ];
  }
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const [parcelas, total] = await Promise.all([
    prisma.parcela.findMany({
      where,
      include: {
        productor: { select: productorSelect },
        _count: { select: { documentos: true, fotos: true } },
      },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.parcela.count({ where }),
  ]);
  const data = parcelas.map((p) => ({
    ...p,
    poligono: jsonToCoords(p.poligono),
  }));
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: number) => {
  const parcela = await prisma.parcela.findFirst({
    where: { id, activo: true },
    include: {
      productor: { select: productorSelect },
      documentos: true,
      fotos: true,
    },
  });
  if (!parcela) {
    throw createError('Parcela no encontrada', 404);
  }
  return { ...parcela, poligono: jsonToCoords(parcela.poligono) };
};

const buildCreateData = (data: Record<string, unknown>) => ({
  nombre: String(data.nombre ?? ''),
  cultivo: String(data.cultivo_principal ?? data.cultivo ?? ''),
  area: Number(data.area_total ?? data.area),
  area_certificada: data.area_certificada !== undefined ? Number(data.area_certificada) : null,
  area_unidad: String(data.area_unidad || 'ha'),
  acreditacion: data.acreditacion ? String(data.acreditacion) : null,
  ubicacion: data.ubicacion ? String(data.ubicacion) : data.comunidad ? String(data.comunidad) : null,
  comunidad: data.comunidad ? String(data.comunidad) : null,
  sector: data.sector ? String(data.sector) : null,
  altitud: data.altitud ? String(data.altitud) : null,
  departamento: data.departamento ? String(data.departamento) : null,
  provincia: data.provincia ? String(data.provincia) : null,
  distrito: data.distrito ? String(data.distrito) : null,
  centro_poblado: data.centro_poblado ? String(data.centro_poblado) : null,
  ubigeo: data.ubigeo ? String(data.ubigeo) : null,
  latitud: data.latitud ? String(data.latitud) : null,
  longitud: data.longitud ? String(data.longitud) : null,
  precision_gps: data.precision_gps ? String(data.precision_gps) : null,
  utm_este: data.utm_este ? String(data.utm_este) : null,
  utm_norte: data.utm_norte ? String(data.utm_norte) : null,
  utm_zona: data.utm_zona ? String(data.utm_zona) : null,
  tipo_suelo: data.tipo_suelo ? String(data.tipo_suelo) : null,
  textura: data.textura ? String(data.textura) : null,
  pendiente: data.pendiente ? String(data.pendiente) : null,
  fuente_agua: data.fuente_agua ? String(data.fuente_agua) : null,
  sistema_riego: data.sistema_riego ? String(data.sistema_riego) : null,
  zona_agroecologica: data.zona_agroecologica ? String(data.zona_agroecologica) : null,
  disponibilidad_agua: data.disponibilidad_agua ? String(data.disponibilidad_agua) : null,
  observaciones: data.observaciones ? String(data.observaciones) : null,
  area_calculada: data.area_calculada ? String(data.area_calculada) : null,
  perimetro: data.perimetro ? String(data.perimetro) : null,
  vertices: data.vertices !== undefined ? Number(data.vertices) : null,
  fecha_levantamiento: data.fecha_levantamiento ? new Date(data.fecha_levantamiento as string) : null,
  responsable: data.responsable ? String(data.responsable) : null,
  certificacion: (data.certificacion as 'ORGANICA' | 'EN_TRANSICION' | 'CONVENCIONAL') || 'CONVENCIONAL',
  estado: (data.estado as 'ACTIVA' | 'INACTIVA') || 'ACTIVA',
});

export const create = async (data: Record<string, unknown>, userId?: string) => {
  const productorId = Number(data.productores_id);
  if (!Number.isFinite(productorId) || productorId <= 0 || !Number.isInteger(productorId)) {
    throw createError('ID del productor inválido', 422);
  }
  await ensureProductorExists(productorId);

  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await generateCodigoParcela();
  } else {
    const exists = await prisma.parcela.findFirst({ where: { codigo } });
    if (exists) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
  }

  let ubigeoId = data.ubigeo_id ? Number(data.ubigeo_id) : null;
  if (!ubigeoId && data.ubigeo) {
    const ubigeoRecord = await prisma.ubigeo.findUnique({ where: { ubigeo: data.ubigeo as string } });
    if (ubigeoRecord) ubigeoId = ubigeoRecord.id;
  }

  const rawCoords = sanitizeCoords(data.poligono);
  let areaCalculada: string | null = null;
  let perimetro: string | null = null;
  let verticesCount: number | null = null;

  if (rawCoords) {
    const validation = validatePolygon(rawCoords);
    if (!validation.valid) {
      throw createError(validation.error!, 422);
    }
    const metrics = calculatePolygonMetrics(rawCoords);
    areaCalculada = `${metrics.areaHa.toFixed(2)} ha`;
    perimetro = `${metrics.perimeterM.toFixed(0)} m`;
    verticesCount = rawCoords.length;
  }

  const parcela = await prisma.$transaction(async (tx) => {
    const result = await tx.parcela.create({
      data: {
        productores_id: productorId,
        ubigeo_id: ubigeoId,
        codigo,
        ...buildCreateData(data),
        poligono: coordsToJson(rawCoords),
        area_calculada: (areaCalculada ?? (data.area_calculada as string)) || null,
        perimetro: (perimetro ?? (data.perimetro as string)) || null,
        vertices: verticesCount ?? (data.vertices !== undefined ? Number(data.vertices) : null),
        created_by: userId || null,
      },
      include: { productor: { select: productorSelect } },
    });
    return result;
  });

  await createHistorial(parcela.id, {
    tipo: 'registro',
    titulo: 'Parcela registrada',
    descripcion: `Se registró la parcela ${parcela.codigo} (${parcela.nombre})`,
    usuario: userId || undefined,
  });

  return { ...parcela, poligono: rawCoords };
};

export const update = async (id: number, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.parcela.findFirst({ where: { id, activo: true } });
  if (!existing) {
    throw createError('Parcela no encontrada', 404);
  }

  const updateData: Record<string, unknown> = {};
  const stringFields = [
    'ubicacion', 'comunidad', 'sector', 'altitud', 'acreditacion',
    'departamento', 'provincia', 'distrito', 'centro_poblado', 'ubigeo',
    'latitud', 'longitud', 'precision_gps', 'utm_este', 'utm_norte', 'utm_zona',
    'tipo_suelo', 'textura', 'pendiente', 'fuente_agua', 'sistema_riego',
    'zona_agroecologica', 'disponibilidad_agua', 'observaciones',
    'area_calculada', 'perimetro', 'responsable', 'area_unidad',
  ];
  for (const field of stringFields) {
    if (data[field] !== undefined) {
      const val = data[field];
      updateData[field] = val === '' || val === null ? null : String(val);
    }
  }

  if (data.ubigeo_id !== undefined) {
    updateData.ubigeo_id = data.ubigeo_id ? Number(data.ubigeo_id) : null;
  } else if (data.ubigeo !== undefined && data.ubigeo) {
    const ubigeoRecord = await prisma.ubigeo.findUnique({ where: { ubigeo: data.ubigeo as string } });
    updateData.ubigeo_id = ubigeoRecord?.id ?? null;
  } else if (data.ubigeo !== undefined && !data.ubigeo) {
    updateData.ubigeo_id = null;
  }

  if (data.nombre !== undefined) updateData.nombre = data.nombre;
  if (data.cultivo_principal !== undefined) updateData.cultivo = data.cultivo_principal;
  if (data.cultivo !== undefined) updateData.cultivo = data.cultivo;
  if (data.area_total !== undefined) updateData.area = Number(data.area_total);
  if (data.area !== undefined) updateData.area = Number(data.area);
  if (data.area_certificada !== undefined) {
    const val = data.area_certificada;
    if (val === '' || val === null || val === undefined) {
      updateData.area_certificada = null;
    } else {
      const num = Number(val);
      updateData.area_certificada = num >= 0 ? num : null;
    }
  }
  if (data.vertices !== undefined) {
    updateData.vertices = data.vertices === null ? null : Number(data.vertices);
  }
  if (data.fecha_levantamiento !== undefined) {
    updateData.fecha_levantamiento = data.fecha_levantamiento ? new Date(data.fecha_levantamiento as string) : null;
  }
  if (data.certificacion !== undefined) updateData.certificacion = data.certificacion;
  if (data.estado !== undefined) updateData.estado = data.estado;
  if (data.codigo !== undefined) updateData.codigo = data.codigo;
  if (data.productores_id !== undefined && data.productores_id !== '') {
    const parsedProductorId = Number(data.productores_id);
    if (!Number.isFinite(parsedProductorId) || parsedProductorId <= 0 || !Number.isInteger(parsedProductorId)) {
      throw createError('ID del productor inválido', 422);
    }
    await ensureProductorExists(parsedProductorId);
    updateData.productores_id = parsedProductorId;
  }
  if (userId) updateData.updated_by = userId;

  if (data.poligono !== undefined) {
    const rawCoords = sanitizeCoords(data.poligono);
    if (rawCoords) {
      const validation = validatePolygon(rawCoords);
      if (!validation.valid) {
        throw createError(validation.error!, 422);
      }
      const metrics = calculatePolygonMetrics(rawCoords);
      updateData.poligono = coordsToJson(rawCoords);
      updateData.area_calculada = `${metrics.areaHa.toFixed(2)} ha`;
      updateData.perimetro = `${metrics.perimeterM.toFixed(0)} m`;
      updateData.vertices = rawCoords.length;
    } else if (data.poligono === null) {
      updateData.poligono = null;
      updateData.area_calculada = null;
      updateData.perimetro = null;
      updateData.vertices = null;
    }
  }

  const updated = await prisma.parcela.update({
    where: { id },
    data: updateData,
    include: { productor: { select: productorSelect } },
  });

  await createHistorial(id, {
    tipo: 'actualizacion',
    titulo: 'Parcela actualizada',
    descripcion: `Se actualizó la parcela ${updated.codigo}`,
    usuario: userId || undefined,
  });

  return { ...updated, poligono: jsonToCoords(updated.poligono) };
};

export const remove = async (id: number) => {
  const existing = await prisma.parcela.findFirst({ where: { id, activo: true } });
  if (!existing) {
    throw createError('Parcela no encontrada', 404);
  }
  await prisma.parcela.update({
    where: { id },
    data: { activo: false, estado: 'INACTIVA' },
  });

  await createHistorial(id, {
    tipo: 'baja',
    titulo: 'Parcela eliminada',
    descripcion: `Se eliminó la parcela ${existing.codigo}`,
  });

  return { message: 'Parcela eliminada exitosamente' };
};

// --- Documentos ---

export const getDocumentos = async (parcelaId: number) => {
  await ensureParcelaExists(parcelaId);
  return prisma.parcela_documentos.findMany({
    where: { parcela_id: parcelaId },
    orderBy: { created_at: 'desc' },
  });
};

export const createDocumento = async (parcelaId: number, data: Record<string, unknown>) => {
  await ensureParcelaExists(parcelaId);
  return prisma.parcela_documentos.create({
    data: {
      parcela_id: parcelaId,
      tipo: data.tipo as string,
      nombre_archivo: data.nombre_archivo as string,
      ruta_archivo: data.ruta_archivo as string,
      tamano_bytes: data.tamano_bytes as number,
      mime_type: data.mime_type as string,
      estado: (data.estado as string) || 'PENDIENTE',
    },
  });
};

export const updateDocumento = async (parcelaId: number, documentoId: number, data: Record<string, unknown>) => {
  await ensureParcelaExists(parcelaId);
  const existing = await prisma.parcela_documentos.findFirst({
    where: { id: documentoId, parcela_id: parcelaId },
  });
  if (!existing) {
    throw createError('Documento no encontrado', 404);
  }
  const updateData: Record<string, unknown> = {};
  const fields = ['tipo', 'nombre_archivo', 'ruta_archivo', 'tamano_bytes', 'mime_type', 'estado'];
  for (const field of fields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }
  return prisma.parcela_documentos.update({
    where: { id: documentoId },
    data: updateData,
  });
};

export const removeDocumento = async (parcelaId: number, documentoId: number) => {
  await ensureParcelaExists(parcelaId);
  const existing = await prisma.parcela_documentos.findFirst({
    where: { id: documentoId, parcela_id: parcelaId },
  });
  if (!existing) {
    throw createError('Documento no encontrado', 404);
  }
  await prisma.parcela_documentos.delete({ where: { id: documentoId } });
  return { message: 'Documento eliminado exitosamente' };
};

// --- Fotos ---

export const getFotos = async (parcelaId: number) => {
  await ensureParcelaExists(parcelaId);
  return prisma.parcela_fotos.findMany({
    where: { parcela_id: parcelaId },
    orderBy: { created_at: 'asc' },
  });
};

export const createFoto = async (parcelaId: number, data: Record<string, unknown>) => {
  await ensureParcelaExists(parcelaId);
  return prisma.parcela_fotos.create({
    data: {
      parcela_id: parcelaId,
      titulo: data.titulo as string,
      descripcion: (data.descripcion as string) || null,
      fecha: data.fecha ? new Date(data.fecha as string) : null,
      autor: (data.autor as string) || null,
      observaciones: (data.observaciones as string) || null,
      ruta_archivo: (data.ruta_archivo as string) || null,
    },
  });
};

export const updateFoto = async (parcelaId: number, fotoId: number, data: Record<string, unknown>) => {
  await ensureParcelaExists(parcelaId);
  const existing = await prisma.parcela_fotos.findFirst({
    where: { id: fotoId, parcela_id: parcelaId },
  });
  if (!existing) {
    throw createError('Fotografía no encontrada', 404);
  }
  const updateData: Record<string, unknown> = {};
  const stringFields = ['titulo', 'descripcion', 'autor', 'observaciones', 'ruta_archivo'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }
  if (data.fecha !== undefined) {
    updateData.fecha = data.fecha ? new Date(data.fecha as string) : null;
  }
  return prisma.parcela_fotos.update({
    where: { id: fotoId },
    data: updateData,
  });
};

export const removeFoto = async (parcelaId: number, fotoId: number) => {
  await ensureParcelaExists(parcelaId);
  const existing = await prisma.parcela_fotos.findFirst({
    where: { id: fotoId, parcela_id: parcelaId },
  });
  if (!existing) {
    throw createError('Fotografía no encontrada', 404);
  }
  await prisma.parcela_fotos.delete({ where: { id: fotoId } });
  return { message: 'Fotografía eliminada exitosamente' };
};

// --- Historial ---

export const getHistorial = async (parcelaId: number) => {
  await ensureParcelaExists(parcelaId);
  return prisma.parcela_historial.findMany({
    where: { parcela_id: parcelaId },
    orderBy: { created_at: 'desc' },
  });
};

export const createHistorial = async (
  parcelaId: number,
  data: { tipo: string; titulo: string; descripcion?: string; usuario?: string },
) => {
  await ensureParcelaExists(parcelaId);
  return prisma.parcela_historial.create({
    data: {
      parcela_id: parcelaId,
      tipo: data.tipo,
      titulo: data.titulo,
      descripcion: data.descripcion || null,
      usuario: data.usuario || null,
    },
  });
};

// --- Helpers ---

const ensureProductorExists = async (id: number) => {
  const exists = await prisma.productor.findUnique({ where: { id }, select: { id: true } });
  if (!exists) {
    throw createError('Productor no encontrado', 404);
  }
};

const ensureParcelaExists = async (id: number) => {
  const exists = await prisma.parcela.findUnique({ where: { id }, select: { id: true } });
  if (!exists) {
    throw createError('Parcela no encontrada', 404);
  }
};
