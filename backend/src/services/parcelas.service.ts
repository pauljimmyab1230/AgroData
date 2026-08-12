import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigoParcela = async (): Promise<string> => {
  const last = await prisma.parcelas_productor.findFirst({
    orderBy: { created_at: 'desc' },
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
  productor_id?: string;
}) => {
  const where: Record<string, unknown> = {};

  if (filters.comunidad) where.comunidad = filters.comunidad;
  if (filters.cultivo) where.cultivo = filters.cultivo;
  if (filters.estado) where.estado = filters.estado;
  if (filters.productor_id) where.productor_id = filters.productor_id;

  if (filters.search) {
    where.OR = [
      { codigo: { contains: filters.search } },
      { nombre: { contains: filters.search } },
      { cultivo: { contains: filters.search } },
      { comunidad: { contains: filters.search } },
      { productor: { nombres: { contains: filters.search } } },
    ];
  }

  return prisma.parcelas_productor.findMany({
    where,
    include: {
      productor: { select: productorSelect },
      _count: { select: { documentos: true, fotos: true } },
    },
    orderBy: { created_at: 'desc' },
  });
};

export const getById = async (id: string) => {
  const parcela = await prisma.parcelas_productor.findUnique({
    where: { id },
    include: {
      productor: { select: productorSelect },
      documentos: true,
      fotos: true,
    },
  });

  if (!parcela) {
    throw createError('Parcela no encontrada', 404);
  }

  return parcela;
};

const buildCreateData = (data: Record<string, unknown>) => ({
  nombre: data.nombre as string,
  cultivo: (data.cultivo_principal as string) ?? (data.cultivo as string),
  area: Number(data.area_total ?? data.area),
  area_certificada: data.area_certificada !== undefined ? Number(data.area_certificada) : null,
  area_unidad: (data.area_unidad as string) || 'ha',
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
  poligono: (data.poligono as unknown as number[][]) ?? null,
  fecha_levantamiento: data.fecha_levantamiento ? new Date(data.fecha_levantamiento as string) : null,
  responsable: (data.responsable as string) || null,
  certificacion: (data.certificacion as 'ORGANICA' | 'EN_TRANSICION' | 'CONVENCIONAL') || 'CONVENCIONAL',
  estado: (data.estado as 'ACTIVA' | 'INACTIVA') || 'ACTIVA',
});

export const create = async (data: Record<string, unknown>) => {
  const productorId = data.productor_id as string;
  await ensureProductorExists(productorId);

  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await generateCodigoParcela();
  } else {
    const exists = await prisma.parcelas_productor.findFirst({ where: { codigo } });
    if (exists) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
  }

  return prisma.parcelas_productor.create({
    data: {
      productor_id: productorId,
      codigo,
      ...buildCreateData(data),
    },
    include: { productor: { select: productorSelect } },
  });
};

export const update = async (id: string, data: Record<string, unknown>) => {
  const existing = await prisma.parcelas_productor.findUnique({ where: { id } });

  if (!existing) {
    throw createError('Parcela no encontrada', 404);
  }

  const updateData: Record<string, unknown> = {};

  const stringFields = [
    'ubicacion',
    'comunidad',
    'sector',
    'altitud',
    'departamento',
    'provincia',
    'distrito',
    'centro_poblado',
    'ubigeo',
    'latitud',
    'longitud',
    'precision_gps',
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
  if (data.poligono !== undefined) {
    updateData.poligono = data.poligono === null ? null : data.poligono;
  }
  if (data.fecha_levantamiento !== undefined) {
    updateData.fecha_levantamiento = data.fecha_levantamiento ? new Date(data.fecha_levantamiento as string) : null;
  }
  if (data.certificacion !== undefined) updateData.certificacion = data.certificacion;
  if (data.estado !== undefined) updateData.estado = data.estado;
  if (data.codigo !== undefined) updateData.codigo = data.codigo;
  if (data.productor_id !== undefined) {
    await ensureProductorExists(data.productor_id as string);
    updateData.productor_id = data.productor_id;
  }

  return prisma.parcelas_productor.update({
    where: { id },
    data: updateData,
    include: { productor: { select: productorSelect } },
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.parcelas_productor.findUnique({ where: { id } });

  if (!existing) {
    throw createError('Parcela no encontrada', 404);
  }

  await prisma.parcelas_productor.delete({ where: { id } });

  return { message: 'Parcela eliminada exitosamente' };
};

// ─── Documentos ─────────────────────────────────────────────

export const getDocumentos = async (parcelaId: string) => {
  await ensureParcelaExists(parcelaId);

  return prisma.parcela_documentos.findMany({
    where: { parcela_id: parcelaId },
    orderBy: { created_at: 'desc' },
  });
};

export const createDocumento = async (parcelaId: string, data: Record<string, unknown>) => {
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

export const updateDocumento = async (parcelaId: string, documentoId: string, data: Record<string, unknown>) => {
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

export const removeDocumento = async (parcelaId: string, documentoId: string) => {
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

export const getFotos = async (parcelaId: string) => {
  await ensureParcelaExists(parcelaId);

  return prisma.parcela_fotos.findMany({
    where: { parcela_id: parcelaId },
    orderBy: { created_at: 'asc' },
  });
};

export const createFoto = async (parcelaId: string, data: Record<string, unknown>) => {
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

export const updateFoto = async (parcelaId: string, fotoId: string, data: Record<string, unknown>) => {
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

export const removeFoto = async (parcelaId: string, fotoId: string) => {
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

const ensureProductorExists = async (id: string) => {
  const exists = await prisma.productores.findUnique({ where: { id }, select: { id: true } });
  if (!exists) {
    throw createError('Productor no encontrado', 404);
  }
};

const ensureParcelaExists = async (id: string) => {
  const exists = await prisma.parcelas_productor.findUnique({ where: { id }, select: { id: true } });
  if (!exists) {
    throw createError('Parcela no encontrada', 404);
  }
};
