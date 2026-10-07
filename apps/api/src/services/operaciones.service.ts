import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

export interface OperacionInput {
  codigo: string;
  nombre: string;
  descripcion?: string;
  orden?: number;
  activo?: boolean;
}

const operacionSelect = {
  id: true,
  codigo: true,
  nombre: true,
  descripcion: true,
  orden: true,
  activo: true,
  created_at: true,
  updated_at: true,
} as const;

export const getAll = async (filters: {
  search?: string;
  activo?: boolean;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = {};
  if (filters.activo !== undefined) where.activo = filters.activo;
  if (filters.search) {
    where.OR = [
      { nombre: { contains: filters.search } },
      { codigo: { contains: filters.search } },
    ];
  }

  const page = filters.page || 1;
  const limit = Math.min(filters.limit || 100, 500);

  const [data, total] = await Promise.all([
    prisma.operacion_proceso.findMany({
      where,
      orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
      select: operacionSelect,
    }),
    prisma.operacion_proceso.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getActivas = async () => {
  return prisma.operacion_proceso.findMany({
    where: { activo: true },
    orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
    select: operacionSelect,
  });
};

export const getById = async (id: number) => {
  const op = await prisma.operacion_proceso.findUnique({
    where: { id },
    select: operacionSelect,
  });
  if (!op) throw createError('Operación no encontrada', 404);
  return op;
};

export const create = async (input: OperacionInput) => {
  const existe = await prisma.operacion_proceso.findUnique({
    where: { codigo: input.codigo },
  });
  if (existe) throw createError('Ya existe una operación con ese código', 409);

  return prisma.operacion_proceso.create({
    data: {
      codigo: input.codigo,
      nombre: input.nombre,
      descripcion: input.descripcion ?? null,
      orden: input.orden ?? 0,
      activo: input.activo ?? true,
    },
    select: operacionSelect,
  });
};

export const update = async (id: number, input: Partial<OperacionInput>) => {
  const existing = await prisma.operacion_proceso.findUnique({ where: { id } });
  if (!existing) throw createError('Operación no encontrada', 404);

  if (input.codigo && input.codigo !== existing.codigo) {
    const duplicado = await prisma.operacion_proceso.findUnique({
      where: { codigo: input.codigo },
    });
    if (duplicado) throw createError('Ya existe una operación con ese código', 409);
  }

  return prisma.operacion_proceso.update({
    where: { id },
    data: {
      ...(input.codigo !== undefined && { codigo: input.codigo }),
      ...(input.nombre !== undefined && { nombre: input.nombre }),
      ...(input.descripcion !== undefined && { descripcion: input.descripcion }),
      ...(input.orden !== undefined && { orden: input.orden }),
      ...(input.activo !== undefined && { activo: input.activo }),
    },
    select: operacionSelect,
  });
};

export const remove = async (id: number) => {
  const existing = await prisma.operacion_proceso.findUnique({ where: { id } });
  if (!existing) throw createError('Operación no encontrada', 404);

  // Verificar que no esté en uso en recetas u órdenes.
  const [enRecetas, enOrdenes] = await Promise.all([
    prisma.receta_operacion.count({ where: { operacion_id: id } }),
    prisma.orden_operacion.count({ where: { operacion_id: id } }),
  ]);
  if (enRecetas > 0 || enOrdenes > 0) {
    throw createError(
      'No se puede eliminar: la operación está en uso en recetas u órdenes. Desactívala en su lugar.',
      409,
    );
  }

  await prisma.operacion_proceso.delete({ where: { id } });
  return { message: 'Operación eliminada exitosamente' };
};
