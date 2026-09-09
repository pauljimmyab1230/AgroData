import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import prisma from '../config/database';
import { env } from '../config/env';
import { createError } from '../middleware/error.middleware';
import type {
  RegisterInput,
  LoginInput,
  AuthResponse,
  UserProfile,
  JwtPayload,
  JwtToken,
} from '../types/auth.types';
import type { UserId, UserEmail } from '@agrodata/types';

const SALT_ROUNDS = 10;

// ─── Helpers ────────────────────────────────────────────────
const generateToken = (id: string, email: string, rol: string): JwtToken => {
  const payload: JwtPayload = {
    id: id as UserId,
    email: email as UserEmail,
    rol: rol as JwtPayload['rol'],
  };
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_SECRET, options) as JwtToken;
};

const toUserProfile = (user: {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  rol_sic?: string | null;
  activo: boolean;
}): UserProfile => ({
  id: user.id as UserId,
  nombre: user.nombre,
  email: user.email as UserEmail,
  rol: user.rol as UserProfile['rol'],
  rol_sic: (user.rol_sic as UserProfile['rol_sic']) ?? null,
  activo: user.activo,
});

// ─── Service ────────────────────────────────────────────────
export const register = async (data: RegisterInput): Promise<AuthResponse> => {
  const existingUser = await prisma.usuarios.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw createError('El email ya está registrado', 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.usuarios.create({
    data: {
      nombre: data.nombre,
      email: data.email,
      password: hashedPassword,
    },
  });

  const token = generateToken(user.id, user.email, user.rol);

  return {
    user: toUserProfile(user),
    token,
  };
};

export const login = async (data: LoginInput): Promise<AuthResponse> => {
  const user = await prisma.usuarios.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw createError('Credenciales inválidas', 401);
  }

  if (!user.activo) {
    throw createError('La cuenta está desactivada. Contacte al administrador', 403);
  }

  const validPassword = await bcrypt.compare(data.password, user.password);

  if (!validPassword) {
    throw createError('Credenciales inválidas', 401);
  }

  const token = generateToken(user.id, user.email, user.rol);

  return {
    user: toUserProfile(user),
    token,
  };
};

export const getProfile = async (userId: string): Promise<UserProfile> => {
  const user = await prisma.usuarios.findUnique({
    where: { id: userId },
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

  if (!user) {
    throw createError('Usuario no encontrado', 404);
  }

  return toUserProfile(user);
};
