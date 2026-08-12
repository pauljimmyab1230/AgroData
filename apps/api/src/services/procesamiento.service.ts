import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const generateCodigo = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const last = await prisma.procesamientos.findFirst({
    where: { codigo: { startsWith: `OP-${year}-` } },
    orderBy: { created_at: 'desc' },
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
    const exists = await prisma.procesamientos.findUnique({ where: { codigo: current }, select: { id: true } });
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
      { codigo: { contains: filters.search } },
      { producto: { contains: filters.search } },
      { responsable: { contains: filters.search } },
      { planta: { contains: filters.search } },
      { observaciones: { contains: filters.search } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const [data, total] = await Promise.all([
    prisma.procesamientos.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        campania: { select: { id: true, codigo: true, nombre: true } },
        lotes: true,
        operaciones: true,
        evidencias: true,
      },
    }),
    prisma.procesamientos.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const procesamiento = await prisma.procesamientos.findFirst({
    where: { id, activo: true },
    include: {
      campania: { select: { id: true, codigo: true, nombre: true } },
      lotes: { orderBy: { created_at: 'asc' } },
      operaciones: { orderBy: { created_at: 'asc' } },
      evidencias: { orderBy: { created_at: 'asc' } },
      historial: { orderBy: { fecha: 'desc' } },
    },
  });

  if (!procesamiento) {
    throw createError('Procesamiento no encontrado', 404);
  }

  return procesamiento;
};

export const create = async (data: Record<string, unknown>, userId?: string) => {
  let codigo = (data.codigo as string) || '';
  if (!codigo.trim()) {
    codigo = await generateCodigo();
  } else {
    const exists = await prisma.procesamientos.findUnique({ where: { codigo } });
    if (exists) {
      throw createError(`El código ${codigo} ya está en uso`, 409);
    }
  }

  const lotesData = (data.lotes as Array<Record<string, unknown>>) || [];
  const operacionesData = (data.operaciones as Array<Record<string, unknown>>) || [];
  const evidenciasData = (data.evidencias as Array<Record<string, unknown>>) || [];

  return prisma.procesamientos.create({
    data: {
      codigo,
      campania_id: data.campania_id as string,
      fecha: new Date(data.fecha as string),
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
      lotes: {
        create: lotesData.map(l => ({
          lote_productor: l.lote_productor as string,
          productor_nombre: (l.productor_nombre as string) || null,
          parcela_nombre: (l.parcela_nombre as string) || null,
          cultivo_nombre: (l.cultivo_nombre as string) || null,
          peso_recepcionado: l.peso_recepcionado != null ? Number(l.peso_recepcionado) : null,
        })),
      },
      operaciones: {
        create: operacionesData.map(o => ({
          nombre: o.nombre as string,
          responsable: (o.responsable as string) || null,
          estado: (o.estado as 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADA' | 'NO_APLICA') || 'PENDIENTE',
          observaciones: (o.observaciones as string) || null,
        })),
      },
      evidencias: {
        create: evidenciasData.map(e => ({
          nombre: e.nombre as string,
          descripcion: (e.descripcion as string) || null,
          tipo: (e.tipo as string) || null,
          ruta_archivo: (e.ruta_archivo as string) || null,
        })),
      },
    },
    include: {
      lotes: true,
      operaciones: true,
      evidencias: true,
    },
  });
};

export const update = async (id: string, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.procesamientos.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Procesamiento no encontrado', 404);
  }

  const updateData: Record<string, unknown> = {};

  const stringFields = ['producto', 'responsable', 'planta', 'producto_base'];
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  if (data.observaciones !== undefined) updateData.observaciones = (data.observaciones as string) || null;
  if (data.fecha !== undefined) updateData.fecha = new Date(data.fecha as string);
  if (data.campania_id !== undefined) updateData.campania_id = data.campania_id;
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

  return prisma.procesamientos.update({
    where: { id },
    data: updateData,
    include: {
      lotes: true,
      operaciones: true,
      evidencias: true,
    },
  });
};

export const remove = async (id: string) => {
  const existing = await prisma.procesamientos.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Procesamiento no encontrado', 404);
  }

  await prisma.procesamientos.update({
    where: { id },
    data: { activo: false },
  });

  return { message: 'Procesamiento eliminado exitosamente' };
};

// ─── LOTES ──────────────────────────────────────────────────

export const addLote = async (id: string, data: Record<string, unknown>) => {
  const existing = await prisma.procesamientos.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Procesamiento no encontrado', 404);
  }

  return prisma.procesamiento_lotes.create({
    data: {
      procesamiento_id: id,
      lote_productor: data.lote_productor as string,
      productor_nombre: (data.productor_nombre as string) || null,
      parcela_nombre: (data.parcela_nombre as string) || null,
      cultivo_nombre: (data.cultivo_nombre as string) || null,
      peso_recepcionado: data.peso_recepcionado != null ? Number(data.peso_recepcionado) : null,
    },
  });
};

export const removeLote = async (id: string, loteId: string) => {
  const existing = await prisma.procesamientos.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Procesamiento no encontrado', 404);
  }

  const lote = await prisma.procesamiento_lotes.findFirst({
    where: { id: loteId, procesamiento_id: id },
  });

  if (!lote) {
    throw createError('Lote no encontrado', 404);
  }

  await prisma.procesamiento_lotes.delete({ where: { id: loteId } });

  return { message: 'Lote eliminado exitosamente' };
};

// ─── OPERACIONES ──────────────────────────────────────────

export const addOperacion = async (id: string, data: Record<string, unknown>) => {
  const existing = await prisma.procesamientos.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Procesamiento no encontrado', 404);
  }

  return prisma.procesamiento_operaciones.create({
    data: {
      procesamiento_id: id,
      nombre: data.nombre as string,
      responsable: (data.responsable as string) || null,
      estado: (data.estado as 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADA' | 'NO_APLICA') || 'PENDIENTE',
      observaciones: (data.observaciones as string) || null,
    },
  });
};

export const updateOperacion = async (id: string, operacionId: string, data: Record<string, unknown>) => {
  const existing = await prisma.procesamientos.findFirst({ where: { id, activo: true } });

  if (!existing) {
    throw createError('Procesamiento no encontrado', 404);
  }

  const operacion = await prisma.procesamiento_operaciones.findFirst({
    where: { id: operacionId, procesamiento_id: id },
  });

  if (!operacion) {
    throw createError('Operación no encontrada', 404);
  }

  const updateData: Record<string, unknown> = {};

  if (data.nombre !== undefined) updateData.nombre = data.nombre;
  if (data.responsable !== undefined) updateData.responsable = (data.responsable as string) || null;
  if (data.estado !== undefined) updateData.estado = data.estado;
  if (data.observaciones !== undefined) updateData.observaciones = (data.observaciones as string) || null;

  return prisma.procesamiento_operaciones.update({
    where: { id: operacionId },
    data: updateData,
  });
};
