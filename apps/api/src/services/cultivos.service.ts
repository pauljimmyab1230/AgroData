import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const last = await prisma.cultivos.findFirst({
    orderBy: { created_at: 'desc' },
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
    const exists = await prisma.cultivos.findUnique({ where: { codigo: current }, select: { id: true } });
    if (!exists) return current;
    const num = parseInt(current.replace('CUL-', ''), 10) + 1;
    current = `CUL-${String(num).padStart(3, '0')}`;
    attempts++;
  }
  throw createError('No se pudo generar un código único', 500);
};

const ensureRelationExists = async (model: string, id: string) => {
  const exists = await (prisma as any)[model].findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw createError(`${model} no encontrado`, 404);
};

// ─── CRUD ──────────────────────────────────────────────────

export const getAll = async (filters: {
  search?: string;
  estado?: string;
  campania_id?: string;
  productor_id?: string;
  parcela_id?: string;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;
  if (filters.campania_id) where.campania_id = filters.campania_id;
  if (filters.productor_id) where.productor_id = filters.productor_id;
  if (filters.parcela_id) where.parcela_id = filters.parcela_id;

  if (filters.search) {
    where.OR = [
      { codigo: { contains: filters.search } },
      { cultivo: { contains: filters.search } },
      { variedad: { contains: filters.search } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.cultivos.findMany({
      where,
      include: {
        campania: { select: { id: true, nombre: true, codigo: true } },
        productor: { select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true } },
        parcela: { select: { id: true, nombre: true, codigo: true } },
      },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.cultivos.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const cultivo = await prisma.cultivos.findFirst({
    where: { id, activo: true },
    include: {
      campania: { select: { id: true, nombre: true, codigo: true } },
      productor: { select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true, codigo: true } },
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
    codigo = await generateCodigo();
  } else {
    const exists = await prisma.cultivos.findUnique({ where: { codigo } });
    if (exists) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
  }

  await ensureRelationExists('campanias', data.campania_id as string);
  await ensureRelationExists('productores', data.productor_id as string);
  await ensureRelationExists('parcelas_productor', data.parcela_id as string);

  return prisma.cultivos.create({
    data: {
      codigo,
      campania_id: data.campania_id as string,
      productor_id: data.productor_id as string,
      parcela_id: data.parcela_id as string,
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
      fecha_emergencia: data.fecha_emergencia ? new Date(data.fecha_emergencia as string) : null,
      fecha_floracion: data.fecha_floracion ? new Date(data.fecha_floracion as string) : null,
      fecha_cosecha: data.fecha_cosecha ? new Date(data.fecha_cosecha as string) : null,
      estado: (data.estado as any) || 'ACTIVO',
      observaciones: (data.observaciones as string) || null,
      estado_fenologico: (data.estado_fenologico as string) || null,
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
      productor: { select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true } },
      parcela: { select: { id: true, nombre: true, codigo: true } },
    },
  });
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.cultivos.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Cultivo no encontrado', 404);
  }

  const updateData: Record<string, unknown> = {};

  const stringFields = ['codigo', 'cultivo', 'variedad', 'unidad_semilla', 'observaciones', 'estado_fenologico', 'distanciamiento_surcos', 'distanciamiento_plantas', 'densidad_siembra', 'tipo_semilla', 'lote_semilla', 'proveedor_semilla'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = (data[field] as string) || null;
  }

  const uuidFields = ['campania_id', 'productor_id', 'parcela_id'];
  for (const field of uuidFields) {
    if (data[field] !== undefined) {
      await ensureRelationExists(field.replace('_id', '').replace('parcela', 'parcelas_productor').replace('productor', 'productores').replace('campania', 'campanias'), data[field] as string);
      updateData[field] = data[field];
    }
  }

  const enumFields = ['metodo_siembra', 'sistema_productivo', 'tipo_agricultura', 'certificacion', 'procedencia_semilla', 'estado', 'destino_produccion'];
  for (const field of enumFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  const dateFields = ['fecha_siembra', 'fecha_emergencia', 'fecha_floracion', 'fecha_cosecha'];
  for (const field of dateFields) {
    if (data[field] !== undefined) updateData[field] = data[field] ? new Date(data[field] as string) : null;
  }

  const numberFields = ['area_sembrada', 'cantidad_semilla', 'rendimiento_esperado', 'produccion_estimada'];
  for (const field of numberFields) {
    if (data[field] !== undefined) updateData[field] = data[field] !== null ? Number(data[field]) : null;
  }

  if (userId) updateData.updated_by = userId;

  return prisma.cultivos.update({
    where: { id },
    data: updateData,
    include: {
      campania: { select: { id: true, nombre: true, codigo: true } },
      productor: { select: { id: true, nombres: true, apellido_paterno: true, apellido_materno: true } },
      parcela: { select: { id: true, nombre: true, codigo: true } },
    },
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.cultivos.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Cultivo no encontrado', 404);
  }

  await prisma.cultivos.update({
    where: { id },
    data: { activo: false },
  });

  return { message: 'Cultivo eliminado exitosamente' };
};
