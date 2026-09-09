import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';
import {
  type ProcesamientoId,
  type CreateProcesamientoInput,
  type UpdateProcesamientoInput,
  type ProcesamientoFilters,
  calcularRendimiento,
  calcularMerma,
  esTransicionValida,
} from '../types/procesamiento.types';

// ─── Code Generation ───────────────────────────────────────
const generateCodigo = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const last = await prisma.procesamiento.findFirst({
    where: { codigo: { startsWith: `OP-${year}-` } },
    orderBy: { codigo: 'desc' },
    select: { codigo: true },
  });

  if (!last) return `OP-${year}-001`;

  const num = parseInt(last.codigo.split('-').pop() || '0', 10) + 1;
  return `OP-${year}-${String(num).padStart(3, '0')}`;
};

const ensureUniqueCodigo = async (codigo: string): Promise<string> => {
  let current = codigo;
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.procesamiento.findUnique({ where: { codigo: current }, select: { id: true } });
    if (!exists) return current;
    const parts = current.split('-');
    const num = parseInt(parts.pop() || '0', 10) + 1;
    current = `${parts.join('-')}-${String(num).padStart(3, '0')}`;
    attempts++;
  }
  throw createError('No se pudo generar un código único', 500);
};

// ─── Helpers ───────────────────────────────────────────────
function parseId(id: string): ProcesamientoId {
  const num = Number(id);
  if (!Number.isInteger(num) || num <= 0) {
    throw createError('ID de procesamiento inválido', 400);
  }
  return num as ProcesamientoId;
}

// ─── CRUD ──────────────────────────────────────────────────

export const getAll = async (filters: ProcesamientoFilters) => {
  const where: Record<string, unknown> = { activo: true };

  if (filters.estado) where.estado = filters.estado;
  if (filters.tipo_proceso) where.tipo_proceso = filters.tipo_proceso;
  if (filters.linea_procesamiento) where.linea_procesamiento = filters.linea_procesamiento;
  if (filters.recepcion_id) where.recepcion_id = filters.recepcion_id;

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
      include: {
        recepcion: {
          select: {
            id: true,
            codigo: true,
            peso_neto: true,
            categoria: true,
          },
        },
      },
    }),
    prisma.procesamiento.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const procesamientoId = parseId(id);

  const procesamiento = await prisma.procesamiento.findFirst({
    where: { id: procesamientoId, activo: true },
    include: {
      recepcion: {
        select: {
          id: true,
          codigo: true,
          peso_neto: true,
          categoria: true,
          estado: true,
          resultado: true,
        },
      },
    },
  });

  if (!procesamiento) {
    throw createError('Procesamiento no encontrado', 404);
  }

  return procesamiento;
};

export const create = async (data: CreateProcesamientoInput, userId?: string) => {
  // Generate unique code
  let codigo = await ensureUniqueCodigo(await generateCodigo());

  // Calculate rendimiento and merma if pesos are provided
  const rendimiento = data.rendimiento ?? calcularRendimiento(data.peso_entrada, data.peso_salida);
  const merma = data.merma ?? calcularMerma(data.peso_entrada, data.peso_salida);

  // Validate recepcion exists if provided
  if (data.recepcion_id) {
    const recepcion = await prisma.recepcion.findFirst({
      where: { id: data.recepcion_id, activo: true },
    });
    if (!recepcion) {
      throw createError('Recepción no encontrada', 404);
    }
  }

  return prisma.procesamiento.create({
    data: {
      codigo,
      fecha_inicio: new Date(data.fecha_inicio),
      fecha_fin: data.fecha_fin ? new Date(data.fecha_fin) : new Date(data.fecha_inicio),
      producto: data.producto,
      responsable: data.responsable,
      planta: data.planta,
      linea_procesamiento: data.linea_procesamiento,
      tipo_proceso: data.tipo_proceso,
      estado: data.estado || 'REGISTRADA',
      observaciones: data.observaciones || null,
      peso_entrada: data.peso_entrada != null ? Number(data.peso_entrada) : null,
      peso_salida: data.peso_salida != null ? Number(data.peso_salida) : null,
      merma: merma != null ? Number(merma) : null,
      rendimiento: rendimiento != null ? Number(rendimiento) : null,
      producto_base: data.producto_base || null,
      calidad_producto: data.calidad_producto || null,
      peso_final: data.peso_final != null ? Number(data.peso_final) : null,
      humedad_final: data.humedad_final != null ? Number(data.humedad_final) : null,
      recepcion_id: data.recepcion_id || null,
      created_by: userId || null,
    },
    include: {
      recepcion: {
        select: {
          id: true,
          codigo: true,
          peso_neto: true,
          categoria: true,
        },
      },
    },
  });
};

export const update = async (id: string, data: UpdateProcesamientoInput, userId?: string) => {
  const procesamientoId = parseId(id);

  const existing = await prisma.procesamiento.findFirst({
    where: { id: procesamientoId, activo: true },
  });

  if (!existing) {
    throw createError('Procesamiento no encontrado', 404);
  }

  // Validate state transition if estado is being changed
  if (data.estado && data.estado !== existing.estado) {
    if (!esTransicionValida(existing.estado, data.estado)) {
      throw createError(
        `No se puede cambiar el estado de ${existing.estado} a ${data.estado}`,
        400
      );
    }
  }

  const updateData: Record<string, unknown> = {};

  // String fields
  const stringFields = ['producto', 'responsable', 'planta', 'producto_base'] as const;
  for (const field of stringFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  // Nullable fields
  if (data.observaciones !== undefined) updateData.observaciones = data.observaciones || null;

  // Date fields
  if (data.fecha_inicio !== undefined) updateData.fecha_inicio = new Date(data.fecha_inicio);
  if (data.fecha_fin !== undefined) updateData.fecha_fin = data.fecha_fin ? new Date(data.fecha_fin) : null;

  // Enum fields
  if (data.linea_procesamiento !== undefined) updateData.linea_procesamiento = data.linea_procesamiento;
  if (data.tipo_proceso !== undefined) updateData.tipo_proceso = data.tipo_proceso;
  if (data.estado !== undefined) updateData.estado = data.estado;
  if (data.calidad_producto !== undefined) updateData.calidad_producto = data.calidad_producto || null;

  // Numeric fields
  if (data.peso_entrada !== undefined) updateData.peso_entrada = data.peso_entrada != null ? Number(data.peso_entrada) : null;
  if (data.peso_salida !== undefined) updateData.peso_salida = data.peso_salida != null ? Number(data.peso_salida) : null;
  if (data.merma !== undefined) updateData.merma = data.merma != null ? Number(data.merma) : null;
  if (data.rendimiento !== undefined) updateData.rendimiento = data.rendimiento != null ? Number(data.rendimiento) : null;
  if (data.peso_final !== undefined) updateData.peso_final = data.peso_final != null ? Number(data.peso_final) : null;
  if (data.humedad_final !== undefined) updateData.humedad_final = data.humedad_final != null ? Number(data.humedad_final) : null;

  // Recepcion relation
  if (data.recepcion_id !== undefined) {
    if (data.recepcion_id) {
      const recepcion = await prisma.recepcion.findFirst({
        where: { id: data.recepcion_id, activo: true },
      });
      if (!recepcion) {
        throw createError('Recepción no encontrada', 404);
      }
    }
    updateData.recepcion_id = data.recepcion_id || null;
  }

  // Auto-calculate rendimiento and merma if pesos change
  const pesoEntrada = data.peso_entrada !== undefined ? data.peso_entrada : existing.peso_entrada;
  const pesoSalida = data.peso_salida !== undefined ? data.peso_salida : existing.peso_salida;

  if (data.peso_entrada !== undefined || data.peso_salida !== undefined) {
    if (data.rendimiento === undefined) {
      updateData.rendimiento = calcularRendimiento(
        pesoEntrada != null ? Number(pesoEntrada) : null,
        pesoSalida != null ? Number(pesoSalida) : null
      );
    }
    if (data.merma === undefined) {
      updateData.merma = calcularMerma(
        pesoEntrada != null ? Number(pesoEntrada) : null,
        pesoSalida != null ? Number(pesoSalida) : null
      );
    }
  }

  if (userId) updateData.updated_by = userId;

  return prisma.procesamiento.update({
    where: { id: procesamientoId },
    data: updateData,
    include: {
      recepcion: {
        select: {
          id: true,
          codigo: true,
          peso_neto: true,
          categoria: true,
        },
      },
    },
  });
};

export const remove = async (id: string) => {
  const procesamientoId = parseId(id);

  const existing = await prisma.procesamiento.findFirst({
    where: { id: procesamientoId, activo: true },
  });

  if (!existing) {
    throw createError('Procesamiento no encontrado', 404);
  }

  await prisma.procesamiento.update({
    where: { id: procesamientoId },
    data: { activo: false },
  });

  return { message: 'Procesamiento eliminado exitosamente' };
};
