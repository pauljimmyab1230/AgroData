import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';
import type {
  EstadoCultivo,
  MetodoSiembra,
  SistemaProductivo,
  TipoAgricultura,
  CertificacionCultivo,
  ProcedenciaSemilla,
  DestinoProduccion,
} from '@agrodata/types';

// ─── Types ──────────────────────────────────────────────────

interface CultivoFilters {
  search?: string;
  estado?: string;
  campania_id?: string;
  parcela_id?: string;
  page?: number;
  limit?: number;
}

interface CultivoStatsFilters {
  search?: string;
  estado?: string;
  campania_id?: string;
}

const CULTIVO_INCLUDE = {
  campania: { select: { id: true, nombre: true, codigo: true } },
  parcela: {
    select: {
      id: true,
      nombre: true,
      codigo: true,
      cultivo: true,
      area: true,
      productor: {
        select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true, codigo: true },
      },
    },
  },
} as const;

// ─── Helpers ────────────────────────────────────────────────

const generateCodigo = async (): Promise<string> => {
  const last = await prisma.cultivo.findFirst({
    orderBy: { codigo: 'desc' },
    select: { codigo: true },
  });

  if (!last) return 'CUL-001';

  const num = parseInt(last.codigo.replace('CUL-', ''), 10) + 1;
  return `CUL-${String(num).padStart(3, '0')}`;
};

const ensureUniqueCodigo = async (codigo: string): Promise<string> => {
  let current = codigo;
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.cultivo.findUnique({ where: { codigo: current }, select: { id: true } });
    if (!exists) return current;
    const num = parseInt(current.replace('CUL-', ''), 10) + 1;
    current = `CUL-${String(num).padStart(3, '0')}`;
    attempts++;
  }
  throw createError('No se pudo generar un código único', 500);
};

const ensureCampaniaExists = async (id: number) => {
  const exists = await prisma.campanias.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw createError('Campaña no encontrada', 404);
};

const ensureParcelaExists = async (id: number) => {
  const exists = await prisma.parcela.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw createError('Parcela no encontrada', 404);
};

const buildSearchWhere = (search: string) => ({
  OR: [
    { codigo: { contains: search } },
    { cultivo: { contains: search } },
    { variedad: { contains: search } },
  ],
});

// ─── CRUD ──────────────────────────────────────────────────

export const getAll = async (filters: CultivoFilters) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado as EstadoCultivo;
  if (filters.campania_id) where.campania_id = Number(filters.campania_id);
  if (filters.parcela_id) where.parcela_id = Number(filters.parcela_id);
  if (filters.search) Object.assign(where, buildSearchWhere(filters.search));

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.cultivo.findMany({
      where,
      include: CULTIVO_INCLUDE,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.cultivo.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const cultivo = await prisma.cultivo.findFirst({
    where: { id: Number(id), activo: true },
    include: CULTIVO_INCLUDE,
  });

  if (!cultivo) {
    throw createError('Cultivo no encontrado', 404);
  }

  return cultivo;
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await ensureUniqueCodigo(await generateCodigo());
  } else {
    const exists = await prisma.cultivo.findUnique({ where: { codigo } });
    if (exists) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
  }

  const campaniaId = Number(data.campania_id);
  const parcelaId = Number(data.parcela_id);

  await ensureCampaniaExists(campaniaId);
  await ensureParcelaExists(parcelaId);

  return prisma.cultivo.create({
    data: {
      codigo,
      campania_id: campaniaId,
      parcela_id: parcelaId,
      cultivo: data.cultivo as string,
      variedad: (data.variedad as string) || null,
      area_sembrada: data.area_sembrada != null ? Number(data.area_sembrada) : null,
      fecha_siembra: data.fecha_siembra ? new Date(data.fecha_siembra as string) : null,
      metodo_siembra: (data.metodo_siembra as MetodoSiembra) || null,
      sistema_productivo: (data.sistema_productivo as SistemaProductivo) || null,
      tipo_agricultura: (data.tipo_agricultura as TipoAgricultura) || null,
      certificacion: (data.certificacion as CertificacionCultivo) || 'SIN_CERTIFICAR',
      procedencia_semilla: (data.procedencia_semilla as ProcedenciaSemilla) || null,
      cantidad_semilla: data.cantidad_semilla != null ? Number(data.cantidad_semilla) : null,
      unidad_semilla: (data.unidad_semilla as string) || null,
      fecha_cosecha: data.fecha_cosecha ? new Date(data.fecha_cosecha as string) : null,
      estado: (data.estado as EstadoCultivo) || 'EN_CRECIMIENTO',
      observaciones: (data.observaciones as string) || null,
      rendimiento_esperado: data.rendimiento_esperado != null ? Number(data.rendimiento_esperado) : null,
      produccion_estimada: data.produccion_estimada != null ? Number(data.produccion_estimada) : null,
      destino_produccion: (data.destino_produccion as DestinoProduccion) || null,
      distanciamiento_surcos: (data.distanciamiento_surcos as string) || null,
      distanciamiento_plantas: (data.distanciamiento_plantas as string) || null,
      densidad_siembra: (data.densidad_siembra as string) || null,
      tipo_semilla: (data.tipo_semilla as string) || null,
      lote_semilla: (data.lote_semilla as string) || null,
      proveedor_semilla: (data.proveedor_semilla as string) || null,
      created_by: userId || null,
    },
    include: CULTIVO_INCLUDE,
  });
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.cultivo.findFirst({ where: { id: Number(id), activo: true } });

  if (!existing) {
    throw createError('Cultivo no encontrado', 404);
  }

  const updateData: Record<string, unknown> = {};

  if (data.codigo !== undefined && (data.codigo as string).trim()) {
    const codigo = (data.codigo as string).trim();
    const existingCodigo = await prisma.cultivo.findFirst({
      where: { codigo, id: { not: Number(id) } },
      select: { id: true },
    });
    if (existingCodigo) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
    updateData.codigo = codigo;
  }

  const stringFields = ['cultivo', 'variedad', 'unidad_semilla', 'observaciones', 'distanciamiento_surcos', 'distanciamiento_plantas', 'densidad_siembra', 'tipo_semilla', 'lote_semilla', 'proveedor_semilla'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = (data[field] as string) || null;
  }

  if (data.campania_id !== undefined) {
    await ensureCampaniaExists(Number(data.campania_id));
    updateData.campania_id = Number(data.campania_id);
  }
  if (data.parcela_id !== undefined) {
    await ensureParcelaExists(Number(data.parcela_id));
    updateData.parcela_id = Number(data.parcela_id);
  }

  const enumFields = ['metodo_siembra', 'sistema_productivo', 'tipo_agricultura', 'certificacion', 'procedencia_semilla', 'estado', 'destino_produccion'];
  for (const field of enumFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  const dateFields = ['fecha_siembra', 'fecha_cosecha'];
  for (const field of dateFields) {
    if (data[field] !== undefined) updateData[field] = data[field] ? new Date(data[field] as string) : null;
  }

  const numberFields = ['area_sembrada', 'cantidad_semilla', 'rendimiento_esperado', 'produccion_estimada'];
  for (const field of numberFields) {
    if (data[field] !== undefined) updateData[field] = data[field] != null ? Number(data[field]) : null;
  }

  if (userId) updateData.updated_by = userId;

  return prisma.cultivo.update({
    where: { id: Number(id) },
    data: updateData,
    include: CULTIVO_INCLUDE,
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.cultivo.findFirst({ where: { id: Number(id), activo: true } });

  if (!existing) {
    throw createError('Cultivo no encontrado', 404);
  }

  await prisma.cultivo.update({
    where: { id: Number(id) },
    data: { activo: false },
  });

  return { message: 'Cultivo eliminado exitosamente' };
};

// ─── Stats ─────────────────────────────────────────────────

export const getGlobalStats = async (filters?: CultivoStatsFilters) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters?.estado) where.estado = filters.estado as EstadoCultivo;
  if (filters?.campania_id) where.campania_id = Number(filters.campania_id);
  if (filters?.search) Object.assign(where, buildSearchWhere(filters.search));

  const [total, porEstado, areaResult, campaniasIds] = await Promise.all([
    prisma.cultivo.count({ where }),
    prisma.cultivo.groupBy({
      by: ['estado'],
      where,
      _count: { id: true },
    }),
    prisma.cultivo.aggregate({
      where,
      _sum: { area_sembrada: true },
    }),
    prisma.cultivo.findMany({
      where,
      select: { campania_id: true },
      distinct: ['campania_id'],
    }),
  ]);

  const estados: Record<EstadoCultivo, number> = {
    EN_CRECIMIENTO: 0,
    COSECHADO: 0,
    PERDIDO: 0,
  };
  for (const item of porEstado) {
    estados[item.estado as EstadoCultivo] = item._count.id;
  }

  return {
    total,
    estados,
    areaSembrada: Math.round((Number(areaResult._sum.area_sembrada) || 0) * 100) / 100,
    campaniasActivas: campaniasIds.length,
  };
};
