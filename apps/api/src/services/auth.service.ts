import bcrypt from 'bcrypt';
import crypto from 'crypto';
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
  ChangePasswordInput,
  RefreshInput,
} from '../types/auth.types';
import type { UserId, UserEmail } from '@agrodata/types';

const SALT_ROUNDS = 12;
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

// Helpers
const generateAccessToken = (id: string, email: string, rol: string): JwtToken => {
  const payload: JwtPayload = {
    id: id as UserId,
    email: email as UserEmail,
    rol: rol as JwtPayload['rol'],
  };
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    issuer: 'agrodata-api',
  };
  return jwt.sign(payload, env.JWT_SECRET, options) as JwtToken;
};

// Refresh token opaco + jti. El hash se guarda en BD para poder revocarlo.
const generarRefreshToken = async (userId: string): Promise<string> => {
  const jti = crypto.randomUUID();
  const tokenPlano = `${jti}.${crypto.randomBytes(32).toString('base64url')}`;
  const tokenHash = crypto.createHash('sha256').update(tokenPlano).digest('hex');

  await prisma.refresh_tokens.create({
    data: {
      jti,
      user_id: userId,
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + REFRESH_TTL_MS),
    },
  });

  return tokenPlano;
};

const hashToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

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

// Service
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

  const token = generateAccessToken(user.id, user.email, user.rol);
  const refreshToken = await generarRefreshToken(user.id);

  return {
    user: toUserProfile(user),
    token,
    refreshToken,
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

  const token = generateAccessToken(user.id, user.email, user.rol);
  const refreshToken = await generarRefreshToken(user.id);

  return {
    user: toUserProfile(user),
    token,
    refreshToken,
  };
};

// Refresh rotativo: devuelve un par nuevo e invalida el anterior.
export const refresh = async (data: RefreshInput): Promise<AuthResponse> => {
  const tokenHash = hashToken(data.refreshToken);

  const registro = await prisma.refresh_tokens.findFirst({
    where: { token_hash: tokenHash, revoked: false },
  });

  if (!registro) {
    throw createError('Refresh token inválido o revocado', 401);
  }

  if (registro.expires_at < new Date()) {
    await prisma.refresh_tokens.update({
      where: { id: registro.id },
      data: { revoked: true },
    });
    throw createError('Refresh token expirado', 401);
  }

  const user = await prisma.usuarios.findUnique({ where: { id: registro.user_id } });
  if (!user || !user.activo) {
    await prisma.refresh_tokens.update({
      where: { id: registro.id },
      data: { revoked: true },
    });
    throw createError('Cuenta inactiva o inexistente', 401);
  }

  const token = generateAccessToken(user.id, user.email, user.rol);
  const nuevoRefresh = await generarRefreshToken(user.id);

  // Rotación: el token anterior queda revocado y apunta al nuevo.
  await prisma.refresh_tokens.update({
    where: { id: registro.id },
    data: { revoked: true, replaced_by: nuevoRefresh.slice(0, 36) },
  });

  return {
    user: toUserProfile(user),
    token,
    refreshToken: nuevoRefresh,
  };
};

// Logout: revoca el refresh token actual (y todos los del usuario si se pide).
export const logout = async (userId: string, refreshToken?: string): Promise<void> => {
  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await prisma.refresh_tokens.updateMany({
      where: { user_id: userId, token_hash: tokenHash, revoked: false },
      data: { revoked: true },
    });
    return;
  }

  await prisma.refresh_tokens.updateMany({
    where: { user_id: userId, revoked: false },
    data: { revoked: true },
  });
};

// Cambio de contraseña: exige la contraseña actual y revoca todos los refresh tokens.
export const changePassword = async (
  userId: string,
  data: ChangePasswordInput,
): Promise<void> => {
  const user = await prisma.usuarios.findUnique({ where: { id: userId } });
  if (!user) {
    throw createError('Usuario no encontrado', 404);
  }

  const esValida = await bcrypt.compare(data.passwordActual, user.password);
  if (!esValida) {
    throw createError('La contraseña actual no es correcta', 401);
  }

  const hash = await bcrypt.hash(data.passwordNueva, SALT_ROUNDS);

  await prisma.$transaction([
    prisma.usuarios.update({
      where: { id: userId },
      data: { password: hash },
    }),
    // Al cambiar la contraseña se revocan todas las sesiones abiertas.
    prisma.refresh_tokens.updateMany({
      where: { user_id: userId, revoked: false },
      data: { revoked: true },
    }),
  ]);
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
