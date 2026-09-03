import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

// ─── CRUD ──────────────────────────────────────────────────

export const getAll = async (tipo: string, filters: {
  search?: string;
  activo?: boolean;
  page?: number;
  limit?: number;
}) => {
  const where: Record<string, unknown> = { tipo };

  if (filters.activo !== undefined) where.activo = filters.activo;

  if (filters.search) {
    where.OR = [
      { nombre: { contains: filters.search } },
      { descripcion: { contains: filters.search } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 50;

  const [data, total] = await Promise.all([
    prisma.catalogos.findMany({
      where,
      orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.catalogos.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getActivos = async (tipo: string) => {
  return prisma.catalogos.findMany({
    where: { tipo, activo: true },
    orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
    select: { id: true, nombre: true, descripcion: true },
  });
};

export const getById = async (id: number) => {
  const item = await prisma.catalogos.findFirst({
    where: { id },
  });

  if (!item) {
    throw createError('Elemento del catálogo no encontrado', 404);
  }

  return item;
};

export const create = async (tipo: string, data: Record<string, unknown>, userId?: string) => {
  const nombre = (data.nombre as string).trim();

  const exists = await prisma.catalogos.findFirst({
    where: { tipo, nombre },
  });

  if (exists) {
    throw createError(`Ya existe un elemento "${nombre}" en este catálogo`, 409);
  }

  return prisma.catalogos.create({
    data: {
      tipo,
      nombre,
      descripcion: (data.descripcion as string) || null,
      activo: (data.activo as boolean) ?? true,
      orden: (data.orden as number) ?? 0,
      created_by: userId || null,
    },
  });
};

export const update = async (id: number, data: Record<string, unknown>, userId?: string) => {
  const existing = await prisma.catalogos.findFirst({ where: { id } });

  if (!existing) {
    throw createError('Elemento del catálogo no encontrado', 404);
  }

  if (data.nombre !== undefined) {
    const nombre = (data.nombre as string).trim();
    const duplicate = await prisma.catalogos.findFirst({
      where: { tipo: existing.tipo, nombre, id: { not: id } },
    });
    if (duplicate) {
      throw createError(`Ya existe un elemento "${nombre}" en este catálogo`, 409);
    }
  }

  const updateData: Record<string, unknown> = {};
  if (data.nombre !== undefined) updateData.nombre = (data.nombre as string).trim();
  if (data.descripcion !== undefined) updateData.descripcion = (data.descripcion as string) || null;
  if (data.activo !== undefined) updateData.activo = data.activo;
  if (data.orden !== undefined) updateData.orden = data.orden;
  if (userId) updateData.updated_by = userId;

  return prisma.catalogos.update({
    where: { id },
    data: updateData,
  });
};

export const remove = async (id: number) => {
  const existing = await prisma.catalogos.findFirst({ where: { id } });

  if (!existing) {
    throw createError('Elemento del catálogo no encontrado', 404);
  }

  await prisma.catalogos.delete({ where: { id } });

  return { message: 'Elemento eliminado exitosamente' };
};

export const toggleActivo = async (id: number, userId?: string) => {
  const existing = await prisma.catalogos.findFirst({ where: { id } });

  if (!existing) {
    throw createError('Elemento del catálogo no encontrado', 404);
  }

  return prisma.catalogos.update({
    where: { id },
    data: {
      activo: !existing.activo,
    },
  });
};
