import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

export interface RecetaInput {
  codigo: string;
  nombre: string;
  producto_base: string;
  etapa: 'PRIMARIA' | 'SECUNDARIA' | 'EMPAQUE';
  formato_salida?: 'GRANO' | 'HARINA' | 'HOJUELA' | 'POP' | 'GRANEL' | 'OTRO' | null;
  descripcion?: string;
  activo?: boolean;
  operaciones?: { operacion_id: number; orden?: number; requerida?: boolean }[];
}

const recetaSelect = {
  id: true,
  codigo: true,
  nombre: true,
  producto_base: true,
  etapa: true,
  formato_salida: true,
  descripcion: true,
  activo: true,
  created_at: true,
  updated_at: true,
} as const;

const recetaCompletaSelect = {
  ...recetaSelect,
  operaciones: {
    orderBy: { orden: 'asc' as const },
    select: {
      id: true,
      orden: true,
      requerida: true,
      parametros_default: true,
      operacion: {
        select: { id: true, codigo: true, nombre: true, descripcion: true },
      },
    },
  },
} as const;

export const getAll = async (filters: {
  search?: string;
  etapa?: string;
  producto_base?: string;
  activo?: boolean;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = {};
  if (filters.etapa) where.etapa = filters.etapa;
  if (filters.producto_base) where.producto_base = filters.producto_base;
  if (filters.activo !== undefined) where.activo = filters.activo;
  if (filters.search) {
    where.OR = [
      { nombre: { contains: filters.search } },
      { codigo: { contains: filters.search } },
      { producto_base: { contains: filters.search } },
    ];
  }

  const page = filters.page || 1;
  const limit = Math.min(filters.limit || 50, 200);

  const [data, total] = await Promise.all([
    prisma.receta.findMany({
      where,
      orderBy: [{ etapa: 'asc' }, { nombre: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
      select: recetaSelect,
    }),
    prisma.receta.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getActivas = async (etapa?: string) => {
  const where: Record<string, unknown> = { activo: true };
  if (etapa) where.etapa = etapa;
  return prisma.receta.findMany({
    where,
    orderBy: [{ etapa: 'asc' }, { nombre: 'asc' }],
    select: recetaSelect,
  });
};

export const getById = async (id: number) => {
  const receta = await prisma.receta.findUnique({
    where: { id },
    select: recetaCompletaSelect,
  });
  if (!receta) throw createError('Receta no encontrada', 404);
  return receta;
};

export const create = async (input: RecetaInput) => {
  const existe = await prisma.receta.findUnique({ where: { codigo: input.codigo } });
  if (existe) throw createError('Ya existe una receta con ese código', 409);

  return prisma.$transaction(async (tx) => {
    const receta = await tx.receta.create({
      data: {
        codigo: input.codigo,
        nombre: input.nombre,
        producto_base: input.producto_base,
        etapa: input.etapa,
        formato_salida: input.formato_salida ?? null,
        descripcion: input.descripcion ?? null,
        activo: input.activo ?? true,
      },
    });

    if (input.operaciones && input.operaciones.length > 0) {
      await tx.receta_operacion.createMany({
        data: input.operaciones.map((op, i) => ({
          receta_id: receta.id,
          operacion_id: op.operacion_id,
          orden: op.orden ?? i + 1,
          requerida: op.requerida ?? true,
        })),
      });
    }

    return tx.receta.findUnique({
      where: { id: receta.id },
      select: recetaCompletaSelect,
    });
  });
};

export const update = async (id: number, input: Partial<RecetaInput>) => {
  const existing = await prisma.receta.findUnique({ where: { id } });
  if (!existing) throw createError('Receta no encontrada', 404);

  if (input.codigo && input.codigo !== existing.codigo) {
    const duplicado = await prisma.receta.findUnique({ where: { codigo: input.codigo } });
    if (duplicado) throw createError('Ya existe una receta con ese código', 409);
  }

  return prisma.$transaction(async (tx) => {
    await tx.receta.update({
      where: { id },
      data: {
        ...(input.codigo !== undefined && { codigo: input.codigo }),
        ...(input.nombre !== undefined && { nombre: input.nombre }),
        ...(input.producto_base !== undefined && { producto_base: input.producto_base }),
        ...(input.etapa !== undefined && { etapa: input.etapa }),
        ...(input.formato_salida !== undefined && { formato_salida: input.formato_salida }),
        ...(input.descripcion !== undefined && { descripcion: input.descripcion }),
        ...(input.activo !== undefined && { activo: input.activo }),
      },
    });

    if (input.operaciones) {
      await tx.receta_operacion.deleteMany({ where: { receta_id: id } });
      if (input.operaciones.length > 0) {
        await tx.receta_operacion.createMany({
          data: input.operaciones.map((op, i) => ({
            receta_id: id,
            operacion_id: op.operacion_id,
            orden: op.orden ?? i + 1,
            requerida: op.requerida ?? true,
          })),
        });
      }
    }

    return tx.receta.findUnique({
      where: { id },
      select: recetaCompletaSelect,
    });
  });
};

export const remove = async (id: number) => {
  const existing = await prisma.receta.findUnique({ where: { id } });
  if (!existing) throw createError('Receta no encontrada', 404);

  const enOrdenes = await prisma.orden_procesamiento.count({ where: { receta_id: id } });
  if (enOrdenes > 0) {
    throw createError(
      'No se puede eliminar: la receta está en uso en órdenes de procesamiento. Desactívala en su lugar.',
      409,
    );
  }

  await prisma.$transaction([
    prisma.receta_operacion.deleteMany({ where: { receta_id: id } }),
    prisma.receta.delete({ where: { id } }),
  ]);

  return { message: 'Receta eliminada exitosamente' };
};
