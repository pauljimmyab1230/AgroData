import bcrypt from 'bcrypt';
import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

export const getAll = async (search?: string, rol?: string, rol_sic?: string, page = 1, limit = 20) => {
  const where: Record<string, unknown> = {};

  if (rol) where.rol = rol;
  if (rol_sic) where.rol_sic = rol_sic;

  if (search) {
    where.OR = [
      { nombre: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [usuarios, total] = await Promise.all([
    prisma.usuarios.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        rol_sic: true,
        activo: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.usuarios.count({ where }),
  ]);

  return { data: usuarios, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id: string) => {
  const usuario = await prisma.usuarios.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      rol_sic: true,
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

export const create = async (data: { nombre: string; email: string; password: string; rol?: string; rol_sic?: string | null }) => {
  const existing = await prisma.usuarios.findUnique({ where: { email: data.email } });
  if (existing) {
    throw createError('El email ya está en uso', 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const usuario = await prisma.usuarios.create({
    data: {
      nombre: data.nombre,
      email: data.email,
      password: hashedPassword,
      rol: (data.rol as 'ADMIN' | 'USER') || 'USER',
      rol_sic: (data.rol_sic as 'RESPONSABLE_SIC' | 'INSPECTOR' | 'COMITE_DECISION' | 'TECNICO_CAMPO' | 'ACOPIADOR' | 'CAPACITADOR') || null,
    },
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      rol_sic: true,
      activo: true,
      created_at: true,
      updated_at: true,
    },
  });

  return usuario;
};

export const update = async (id: string, data: { nombre?: string; email?: string; password?: string; rol?: string; rol_sic?: string | null; activo?: boolean }) => {
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

  const updateData: Record<string, unknown> = {};
  if (data.nombre) updateData.nombre = data.nombre;
  if (data.email) updateData.email = data.email;
  if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
  if (data.rol) updateData.rol = data.rol;
  if (data.rol_sic !== undefined) updateData.rol_sic = data.rol_sic || null;
  if (data.activo !== undefined) updateData.activo = data.activo;

  const updated = await prisma.usuarios.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      rol_sic: true,
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
