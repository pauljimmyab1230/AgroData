import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { env } from '../config/env';
import { createError } from '../middleware/error.middleware';

interface RegisterInput {
  nombre: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const generateToken = (id: string, email: string, rol: string): string => {
  return jwt.sign({ id, email, rol }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as string,
  } as jwt.SignOptions);
};

export const register = async (data: RegisterInput) => {
  const existingUser = await prisma.usuarios.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw createError('El email ya está registrado', 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.usuarios.create({
    data: {
      nombre: data.nombre,
      email: data.email,
      password: hashedPassword,
    },
  });

  const token = generateToken(user.id, user.email, user.rol);

  return {
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      activo: user.activo,
    },
    token,
  };
};

export const login = async (data: LoginInput) => {
  const user = await prisma.usuarios.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw createError('Credenciales inválidas', 401);
  }

  if (!user.activo) {
    throw createError('La cuenta está desactivada', 403);
  }

  const validPassword = await bcrypt.compare(data.password, user.password);

  if (!validPassword) {
    throw createError('Credenciales inválidas', 401);
  }

  const token = generateToken(user.id, user.email, user.rol);

  return {
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      activo: user.activo,
    },
    token,
  };
};

export const getProfile = async (userId: string) => {
  const user = await prisma.usuarios.findUnique({
    where: { id: userId },
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

  if (!user) {
    throw createError('Usuario no encontrado', 404);
  }

  return user;
};
