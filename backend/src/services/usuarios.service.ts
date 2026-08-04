import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

export const getAll = async () => {
  const usuarios = await prisma.usuarios.findMany({
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      activo: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: { created_at: 'desc' },
  });

  return usuarios;
};

export const getById = async (id: string) => {
  const usuario = await prisma.usuarios.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      activo: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!usuario) {
    throw createError('Usuario no encontrado', 404);
  }

  return usuario;
};

export const update = async (id: string, data: { nombre?: string; email?: string; rol?: string; activo?: boolean }) => {
  const existing = await prisma.usuarios.findUnique({ where: { id } });

  if (!existing) {
    throw createError('Usuario no encontrado', 404);
  }

  if (data.email && data.email !== existing.email) {
    const emailTaken = await prisma.usuarios.findUnique({
      where: { email: data.email },
    });
    if (emailTaken) {
      throw createError('El email ya está en uso', 409);
    }
  }

  const updated = await prisma.usuarios.update({
    where: { id },
    data: {
      ...(data.nombre && { nombre: data.nombre }),
      ...(data.email && { email: data.email }),
      ...(data.rol && { rol: data.rol as 'ADMIN' | 'USER' }),
      ...(data.activo !== undefined && { activo: data.activo }),
    },
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      activo: true,
      created_at: true,
      updated_at: true,
    },
  });

  return updated;
};

export const remove = async (id: string) => {
  const existing = await prisma.usuarios.findUnique({ where: { id } });

  if (!existing) {
    throw createError('Usuario no encontrado', 404);
  }

  await prisma.usuarios.delete({ where: { id } });

  return { message: 'Usuario eliminado exitosamente' };
};
