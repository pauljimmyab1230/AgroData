import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

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

const ensureRelationExists = async (model: string, id: string | number) => {
  const numId = Number(id);
  const lookupId = !isNaN(numId) && String(numId) === String(id) ? numId : id;
  const exists = await (prisma as any)[model].findUnique({ where: { id: lookupId }, select: { id: true } });
  if (!exists) throw createError(`${model} no encontrado`, 404);
};

// ─── CRUD ──────────────────────────────────────────────────

export const getAll = async (filters: {
  search?: string;
  estado?: string;
  campanias_id?: string;
  parcela_id?: string;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;
  if (filters.campanias_id) where.campanias_id = Number(filters.campanias_id);
  if (filters.parcela_id) where.parcela_id = Number(filters.parcela_id);

  if (filters.search) {
    where.OR = [
      { codigo: { contains: filters.search, mode: 'insensitive' } },
      { cultivo: { contains: filters.search, mode: 'insensitive' } },
      { variedad: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.cultivo.findMany({
      where,
      include: {
        campania: { select: { id: true, nombre: true, codigo: true } },
        parcela: { select: { id: true, nombre: true, codigo: true } },
      },
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
    include: {
      campania: { select: { id: true, nombre: true, codigo: true } },
      parcela: { select: { id: true, nombre: true, codigo: true, cultivo: true, area: true } },
    },
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

  await ensureRelationExists('campanias', Number(data.campania_id));
  await ensureRelationExists('parcela', Number(data.parcela_id));

  return prisma.cultivo.create({
    data: {
      codigo,
      campanias_id: Number(data.campania_id),
      parcela_id: Number(data.parcela_id),
      cultivo: data.cultivo as string,
      variedad: (data.variedad as string) || null,
      area_sembrada: data.area_sembrada ? Number(data.area_sembrada) : null,
      fecha_siembra: data.fecha_siembra ? new Date(data.fecha_siembra as string) : null,
      metodo_siembra: (data.metodo_siembra as any) || null,
      sistema_productivo: (data.sistema_productivo as any) || null,
      tipo_agricultura: (data.tipo_agricultura as any) || null,
      certificacion: (data.certificacion as any) || 'SIN_CERTIFICAR',
      procedencia_semilla: (data.procedencia_semilla as any) || null,
      cantidad_semilla: data.cantidad_semilla ? Number(data.cantidad_semilla) : null,
      unidad_semilla: (data.unidad_semilla as string) || null,
      fecha_cosecha: data.fecha_cosecha ? new Date(data.fecha_cosecha as string) : null,
      estado: (data.estado as any) || 'ACTIVO',
      observaciones: (data.observaciones as string) || null,
      rendimiento_esperado: data.rendimiento_esperado ? Number(data.rendimiento_esperado) : null,
      produccion_estimada: data.produccion_estimada ? Number(data.produccion_estimada) : null,
      destino_produccion: (data.destino_produccion as any) || null,
      distanciamiento_surcos: (data.distanciamiento_surcos as string) || null,
      distanciamiento_plantas: (data.distanciamiento_plantas as string) || null,
      densidad_siembra: (data.densidad_siembra as string) || null,
      tipo_semilla: (data.tipo_semilla as string) || null,
      lote_semilla: (data.lote_semilla as string) || null,
      proveedor_semilla: (data.proveedor_semilla as string) || null,
      created_by: userId || null,
    },
    include: {
      campania: { select: { id: true, nombre: true, codigo: true } },
      parcela: { select: { id: true, nombre: true, codigo: true } },
    },
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

  const uuidFields = ['campania_id', 'parcela_id'];
  const uuidModelMap: Record<string, string> = {
    campania_id: 'campanias',
    parcela_id: 'parcela',
  };
  for (const field of uuidFields) {
    if (data[field] !== undefined) {
      const model = uuidModelMap[field];
      if (model) await ensureRelationExists(model, Number(data[field]));
      const dbField = field === 'campania_id' ? 'campanias_id' : field;
      updateData[dbField] = Number(data[field]);
    }
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
    if (data[field] !== undefined) updateData[field] = data[field] !== null ? Number(data[field]) : null;
  }

  if (userId) updateData.updated_by = userId;

  return prisma.cultivo.update({
    where: { id: Number(id) },
    data: updateData,
    include: {
      campania: { select: { id: true, nombre: true, codigo: true } },
      parcela: { select: { id: true, nombre: true, codigo: true } },
    },
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

// ─── Global Stats ─────────────────────────────────────────

export const getGlobalStats = async (filters?: {
  search?: string;
  estado?: string;
  campanias_id?: string;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters?.estado) where.estado = filters.estado;
  if (filters?.campanias_id) where.campanias_id = Number(filters.campanias_id);

  if (filters?.search) {
    where.OR = [
      { codigo: { contains: filters.search, mode: 'insensitive' } },
      { cultivo: { contains: filters.search, mode: 'insensitive' } },
      { variedad: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [total, porEstado, areaResult, campaniasResult] = await Promise.all([
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
      select: { campanias_id: true },
      distinct: ['campanias_id'],
    }),
  ]);

  const estados: Record<string, number> = {
    ACTIVO: 0,
    EN_DESARROLLO: 0,
    COSECHADO: 0,
    FINALIZADO: 0,
  };
  for (const item of porEstado) {
    estados[item.estado] = item._count.id;
  }

  return {
    total,
    estados,
    areaSembrada: Math.round((Number(areaResult._sum.area_sembrada) || 0) * 100) / 100,
    campaniasActivas: campaniasResult.length,
  };
};
