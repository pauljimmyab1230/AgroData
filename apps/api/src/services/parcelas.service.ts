import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

// ─── WKT / Geometry helpers ──────────────────────────────────

type Coord = [number, number];

/** Convert [lat, lng][] → MULTIPOLYGON WKT (lng lat order for WKT) */
function coordsToWkt(coords: Coord[]): string {
  const ring = [...coords, coords[0]].map(([lat, lng]) => `${lng} ${lat}`).join(',');
  return `MULTIPOLYGON(((${ring})))`;
}

/** Convert MULTIPOLYGON WKT → [lat, lng][] */
function wktToCoords(wkt: string): Coord[] | null {
  if (!wkt) return null;
  const inner = wkt.replace(/^MULTIPOLYGON\(\(\(/, '').replace(/\)\)\)$/, '');
  if (!inner) return null;
  return inner.split(',').map((pair) => {
    const [lng, lat] = pair.trim().split(' ').map(Number);
    return [lat, lng] as Coord;
  });
}

async function savePoligono(parcelaId: number, coords: Coord[] | null): Promise<void> {
  if (!coords || coords.length < 3) {
    await prisma.$executeRawUnsafe(
      'UPDATE parcela SET poligono = NULL WHERE id = ?',
      parcelaId,
    );
    return;
  }
  const wkt = coordsToWkt(coords);
  await prisma.$executeRawUnsafe(
    'UPDATE parcela SET poligono = ST_GeomFromText(?, 4326) WHERE id = ?',
    wkt,
    parcelaId,
  );
}

async function fetchPoligono(parcelaId: number): Promise<Coord[] | null> {
  try {
    const rows = await prisma.$queryRaw<{ poligono: string }[]>`
      SELECT ST_AsWKT(poligono) AS poligono FROM parcela WHERE id = ${parcelaId}
    `;
    if (!rows.length || !rows[0].poligono) return null;
    return wktToCoords(rows[0].poligono);
  } catch {
    return null;
  }
}

// ─── End helpers ─────────────────────────────────────────────

const generateCodigoParcela = async (): Promise<string> => {
  const last = await prisma.parcela.findFirst({
    orderBy: { codigo: 'desc' },
    select: { codigo: true },
  });

  if (!last) return 'PAR-001';

  const num = parseInt(last.codigo.replace('PAR-', ''), 10) + 1;
  return `PAR-${String(num).padStart(3, '0')}`;
};

const productorSelect = {
  id: true,
  codigo: true,
  nombres: true,
  apellido_paterno: true,
  apellido_materno: true,
} as const;

// ─── Parcelas ───────────────────────────────────────────────

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
    where.OR = [
      { codigo: { contains: filters.search, mode: 'insensitive' } },
      { nombre: { contains: filters.search, mode: 'insensitive' } },
      { cultivo: { contains: filters.search, mode: 'insensitive' } },
      { comunidad: { contains: filters.search, mode: 'insensitive' } },
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

  let polyMap = new Map<number, Coord[] | null>();
  if (parcelas.length > 0) {
    try {
      const poligonos = await prisma.$queryRaw<{ id: number; wkt: string }[]>`
        SELECT id, ST_AsWKT(poligono) AS wkt
        FROM parcela
        WHERE id IN (${parcelas.map((p) => p.id)})
          AND poligono IS NOT NULL
      `;
      polyMap = new Map(poligonos.map((r) => [r.id, wktToCoords(r.wkt)]));
    } catch {
      // poligono column may not support ST_AsWKT
    }
  }

  const data = parcelas.map((p) => ({
    ...p,
    poligono: polyMap.get(p.id) ?? null,
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

  const poligono = await fetchPoligono(id);

  return { ...parcela, poligono };
};

const buildCreateData = (data: Record<string, unknown>) => ({
  nombre: data.nombre as string,
  cultivo: (data.cultivo_principal as string) ?? (data.cultivo as string),
  area: Number(data.area_total ?? data.area),
  area_certificada: data.area_certificada !== undefined ? Number(data.area_certificada) : null,
  area_unidad: (data.area_unidad as string) || 'ha',
  acreditacion: (data.acreditacion as string) || null,
  ubicacion: (data.ubicacion as string) || (data.comunidad as string) || null,
  comunidad: (data.comunidad as string) || null,
  sector: (data.sector as string) || null,
  altitud: (data.altitud as string) || null,
  departamento: (data.departamento as string) || null,
  provincia: (data.provincia as string) || null,
  distrito: (data.distrito as string) || null,
  centro_poblado: (data.centro_poblado as string) || null,
  ubigeo: (data.ubigeo as string) || null,
  latitud: (data.latitud as string) || null,
  longitud: (data.longitud as string) || null,
  precision_gps: (data.precision_gps as string) || null,
  utm_este: (data.utm_este as string) || null,
  utm_norte: (data.utm_norte as string) || null,
  utm_zona: (data.utm_zona as string) || null,
  tipo_suelo: (data.tipo_suelo as string) || null,
  textura: (data.textura as string) || null,
  pendiente: (data.pendiente as string) || null,
  fuente_agua: (data.fuente_agua as string) || null,
  sistema_riego: (data.sistema_riego as string) || null,
  zona_agroecologica: (data.zona_agroecologica as string) || null,
  disponibilidad_agua: (data.disponibilidad_agua as string) || null,
  observaciones: (data.observaciones as string) || null,
  area_calculada: (data.area_calculada as string) || null,
  perimetro: (data.perimetro as string) || null,
  vertices: data.vertices !== undefined ? Number(data.vertices) : null,
  fecha_levantamiento: data.fecha_levantamiento ? new Date(data.fecha_levantamiento as string) : null,
  responsable: (data.responsable as string) || null,
  certificacion: (data.certificacion as 'ORGANICA' | 'EN_TRANSICION' | 'CONVENCIONAL') || 'CONVENCIONAL',
  estado: (data.estado as 'ACTIVA' | 'INACTIVA') || 'ACTIVA',
});

export const create = async (data: Record<string, unknown>, userId?: string) => {
  const productorId = Number(data.productores_id);
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

  const parcela = await prisma.parcela.create({
    data: {
      productores_id: productorId,
      codigo,
      ...buildCreateData(data),
      created_by: userId || null,
    },
    include: { productor: { select: productorSelect } },
  });

  const poligono = data.poligono as Coord[] | null | undefined;
  if (poligono !== undefined) {
    await savePoligono(parcela.id, poligono);
  }

  return { ...parcela, poligono: poligono ?? null };
};

export const update = async (id: number, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.parcela.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Parcela no encontrada', 404);
  }

  const updateData: Record<string, unknown> = {};

  const stringFields = [
    'ubicacion',
    'comunidad',
    'sector',
    'altitud',
    'acreditacion',
    'departamento',
    'provincia',
    'distrito',
    'centro_poblado',
    'ubigeo',
    'latitud',
    'longitud',
    'precision_gps',
    'utm_este',
    'utm_norte',
    'utm_zona',
    'tipo_suelo',
    'textura',
    'pendiente',
    'fuente_agua',
    'sistema_riego',
    'zona_agroecologica',
    'disponibilidad_agua',
    'observaciones',
    'area_calculada',
    'perimetro',
    'responsable',
    'area_unidad',
  ];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = (data[field] as string) || null;
  }

  if (data.ubigeo_id !== undefined) {
    updateData.ubigeo_id = data.ubigeo_id ? Number(data.ubigeo_id) : null;
  } else if (data.ubigeo !== undefined && data.ubigeo) {
    const ubigeoRecord = await prisma.ubigeo.findUnique({ where: { ubigeo: data.ubigeo as string } });
    updateData.ubigeo_id = ubigeoRecord?.id ?? null;
  }

  if (data.nombre !== undefined) updateData.nombre = data.nombre;
  if (data.cultivo_principal !== undefined) updateData.cultivo = data.cultivo_principal;
  if (data.cultivo !== undefined) updateData.cultivo = data.cultivo;
  if (data.area_total !== undefined) updateData.area = Number(data.area_total);
  if (data.area !== undefined) updateData.area = Number(data.area);
  if (data.area_certificada !== undefined) {
    updateData.area_certificada = data.area_certificada === '' || data.area_certificada === null ? null : Number(data.area_certificada);
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
    await ensureProductorExists(Number(data.productores_id));
    updateData.productores_id = Number(data.productores_id);
  }

  if (userId) updateData.updated_by = userId;

  const updated = await prisma.parcela.update({
    where: { id },
    data: updateData,
    include: { productor: { select: productorSelect } },
  });

  if (data.poligono !== undefined) {
    await savePoligono(id, data.poligono as Coord[] | null);
  }

  const poligono = await fetchPoligono(id);

  return { ...updated, poligono };
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

  return { message: 'Parcela eliminada exitosamente' };
};

// ─── Documentos ─────────────────────────────────────────────

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

// ─── Fotos ──────────────────────────────────────────────────

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

// ─── Helpers ────────────────────────────────────────────────

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
