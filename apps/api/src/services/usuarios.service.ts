import bcrypt from 'bcrypt';
import { Prisma, type Rol, type RolSic } from '@prisma/client';
import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';
import type {
  CreateUsuarioInput,
  UpdateUsuarioInput,
  UsuarioResponse,
  UsuarioListResponse,
  UsuarioBasicResponse,
} from '../types/usuarios.types';

// ─── Select clause (avoids implicit select *) ─────────────
const usuarioSelect = {
  id: true,
  nombre: true,
  email: true,
  rol: true,
  rol_sic: true,
  activo: true,
  created_at: true,
  updated_at: true,
} satisfies Prisma.usuariosSelect;

const usuarioBasicSelect = {
  id: true,
  nombre: true,
  email: true,
  rol_sic: true,
} satisfies Prisma.usuariosSelect;

// ─── Helpers ──────────────────────────────────────────────
const throwNotFound = (): never => {
  throw createError('Usuario no encontrado', 404);
};

// ─── Service ──────────────────────────────────────────────
export const getAll = async (
  search?: string,
  rol?: string,
  rol_sic?: string,
  page = 1,
  limit = 20,
): Promise<UsuarioListResponse> => {
  const where: Prisma.usuariosWhereInput = {};

  if (rol) where.rol = rol as Rol;
  if (rol_sic) where.rol_sic = rol_sic as RolSic;

  if (search) {
    where.OR = [
      { nombre: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [usuarios, total] = await Promise.all([
    prisma.usuarios.findMany({
      where,
      select: usuarioSelect,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.usuarios.count({ where }),
  ]);

  return {
    data: usuarios,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getById = async (id: string): Promise<UsuarioResponse> => {
  const usuario = await prisma.usuarios.findUnique({
    where: { id },
    select: usuarioSelect,
  });

  if (!usuario) throwNotFound();
  return usuario as UsuarioResponse;
};

export const create = async (input: CreateUsuarioInput): Promise<UsuarioResponse> => {
  const existing = await prisma.usuarios.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw createError('El email ya está en uso', 409);
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const usuario = await prisma.usuarios.create({
    data: {
      nombre: input.nombre,
      email: input.email,
      password: hashedPassword,
      rol: input.rol ?? 'USER',
      rol_sic: input.rol_sic ?? null,
    },
    select: usuarioSelect,
  });

  return usuario as UsuarioResponse;
};

export const update = async (
  id: string,
  input: UpdateUsuarioInput,
): Promise<UsuarioResponse> => {
  const existing = await prisma.usuarios.findUnique({ where: { id } });
  if (!existing) {
    throw createError('Usuario no encontrado', 404);
  }

  if (input.email && input.email !== existing.email) {
    const emailTaken = await prisma.usuarios.findUnique({
      where: { email: input.email },
    });
    if (emailTaken) {
      throw createError('El email ya está en uso', 409);
    }
  }

  const updateData: Prisma.usuariosUpdateInput = {};

  if (input.nombre !== undefined) updateData.nombre = input.nombre;
  if (input.email !== undefined) updateData.email = input.email;
  if (input.password !== undefined) {
    updateData.password = await bcrypt.hash(input.password, 10);
  }
  if (input.rol !== undefined) updateData.rol = input.rol;
  if (input.rol_sic !== undefined) updateData.rol_sic = input.rol_sic;
  if (input.activo !== undefined) updateData.activo = input.activo;

  const updated = await prisma.usuarios.update({
    where: { id },
    data: updateData,
    select: usuarioSelect,
  });

  return updated as UsuarioResponse;
};

export const remove = async (
  id: string,
): Promise<{ message: string }> => {
  const existing = await prisma.usuarios.findUnique({ where: { id } });
  if (!existing) throwNotFound();

  await prisma.usuarios.update({
    where: { id },
    data: { activo: false },
  });

  return { message: 'Usuario eliminado exitosamente' };
};

export const getBasic = async (
  rol_sic?: string,
): Promise<UsuarioBasicResponse[]> => {
  const where: Prisma.usuariosWhereInput = { activo: true };
  if (rol_sic) where.rol_sic = rol_sic as RolSic;

  return prisma.usuarios.findMany({
    where,
    select: usuarioBasicSelect,
    orderBy: { nombre: 'asc' },
  }) as Promise<UsuarioBasicResponse[]>;
};
