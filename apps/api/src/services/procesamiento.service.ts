import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const last = await prisma.procesamiento.findFirst({
    where: { codigo: { startsWith: `OP-${year}-` } },
    orderBy: { codigo: 'desc' },
    select: { codigo: true },
  });

  if (!last) return `OP-${year}-01`;

  const num = parseInt(last.codigo.split('-').pop() || '0', 10) + 1;
  return `OP-${year}-${String(num).padStart(2, '0')}`;
};

const ensureUniqueCodigo = async (codigo: string): Promise<string> => {
  let current = codigo;
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.procesamiento.findUnique({ where: { codigo: current }, select: { id: true } });
    if (!exists) return current;
    const parts = current.split('-');
    const num = parseInt(parts.pop() || '0', 10) + 1;
    current = `${parts.join('-')}-${String(num).padStart(2, '0')}`;
    attempts++;
  }
  throw createError('No se pudo generar un código único', 500);
};

// ─── CRUD ──────────────────────────────────────────────────

export const getAll = async (filters: {
  search?: string;
  estado?: string;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;

  if (filters.search) {
    where.OR = [
      { codigo: { contains: filters.search, mode: 'insensitive' } },
      { producto: { contains: filters.search, mode: 'insensitive' } },
      { responsable: { contains: filters.search, mode: 'insensitive' } },
      { planta: { contains: filters.search, mode: 'insensitive' } },
      { observaciones: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.procesamiento.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.procesamiento.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const procesamiento = await prisma.procesamiento.findFirst({
    where: { id: Number(id), activo: true },
  });

  if (!procesamiento) {
    throw createError('Procesamiento no encontrado', 404);
  }

  return procesamiento;
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await ensureUniqueCodigo(await generateCodigo());
  } else {
    const exists = await prisma.procesamiento.findUnique({ where: { codigo } });
    if (exists) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
  }

  return prisma.procesamiento.create({
    data: {
      codigo,
      fecha_inicio: new Date(data.fecha_inicio as string),
      fecha_fin: data.fecha_fin ? new Date(data.fecha_fin as string) : new Date(data.fecha_inicio as string),
      producto: data.producto as string,
      responsable: data.responsable as string,
      planta: data.planta as string,
      linea_procesamiento: data.linea_procesamiento as 'GRANOS' | 'TUBERCULOS' | 'LEGUMBRES' | 'SEMILLAS',
      estado: (data.estado as 'REGISTRADA' | 'EN_PROCESO' | 'COMPLETADA' | 'PAUSADA' | 'CANCELADA') || 'REGISTRADA',
      observaciones: (data.observaciones as string) || null,
      peso_entrada: data.peso_entrada != null ? Number(data.peso_entrada) : null,
      peso_salida: data.peso_salida != null ? Number(data.peso_salida) : null,
      merma: data.merma != null ? Number(data.merma) : null,
      rendimiento: data.rendimiento != null ? Number(data.rendimiento) : null,
      producto_base: (data.producto_base as string) || null,
      calidad_producto: (data.calidad_producto as 'PRIMERA' | 'SEGUNDA' | 'TERCERA' | 'DESCARTE') || null,
      peso_final: data.peso_final != null ? Number(data.peso_final) : null,
      humedad_final: data.humedad_final != null ? Number(data.humedad_final) : null,
      created_by: userId || null,
    },
  });
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.procesamiento.findFirst({ where: { id: Number(id), activo: true } });

  if (!existing) {
    throw createError('Procesamiento no encontrado', 404);
  }

  const updateData: Record<string, unknown> = {};

  const stringFields = ['producto', 'responsable', 'planta', 'producto_base'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  if (data.observaciones !== undefined) updateData.observaciones = (data.observaciones as string) || null;
  if (data.fecha_inicio !== undefined) updateData.fecha_inicio = new Date(data.fecha_inicio as string);
  if (data.fecha_fin !== undefined) updateData.fecha_fin = new Date(data.fecha_fin as string);
  if (data.linea_procesamiento !== undefined) updateData.linea_procesamiento = data.linea_procesamiento;
  if (data.estado !== undefined) updateData.estado = data.estado;
  if (data.calidad_producto !== undefined) updateData.calidad_producto = (data.calidad_producto as string) || null;
  if (data.peso_entrada !== undefined) updateData.peso_entrada = data.peso_entrada != null ? Number(data.peso_entrada) : null;
  if (data.peso_salida !== undefined) updateData.peso_salida = data.peso_salida != null ? Number(data.peso_salida) : null;
  if (data.merma !== undefined) updateData.merma = data.merma != null ? Number(data.merma) : null;
  if (data.rendimiento !== undefined) updateData.rendimiento = data.rendimiento != null ? Number(data.rendimiento) : null;
  if (data.peso_final !== undefined) updateData.peso_final = data.peso_final != null ? Number(data.peso_final) : null;
  if (data.humedad_final !== undefined) updateData.humedad_final = data.humedad_final != null ? Number(data.humedad_final) : null;

  if (userId) updateData.updated_by = userId;

  return prisma.procesamiento.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.procesamiento.findFirst({ where: { id: Number(id), activo: true } });

  if (!existing) {
    throw createError('Procesamiento no encontrado', 404);
  }

  await prisma.procesamiento.update({
    where: { id: Number(id) },
    data: { activo: false },
  });

  return { message: 'Procesamiento eliminado exitosamente' };
};
