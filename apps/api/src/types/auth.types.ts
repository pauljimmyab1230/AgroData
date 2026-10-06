import type { Rol, RolSic } from '@prisma/client';
import type { Brand } from '@agrodata/types';

// ─── JWT Types ──────────────────────────────────────────────
export type JwtToken = Brand<string, 'JwtToken'>;

export type UserRole = Rol;

export interface JwtPayload {
  id: string;
  email: string;
  rol: Rol;
  rol_sic?: RolSic | null;
}

// ─── Input Types ────────────────────────────────────────────
export interface RegisterInput {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// ─── Response Types ─────────────────────────────────────────
export interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  rol_sic: RolSic | null;
  activo: boolean;
}

export interface AuthResponse {
  user: UserProfile;
  token: JwtToken;
  refreshToken: string;
}

export interface ChangePasswordInput {
  passwordActual: string;
  passwordNueva: string;
}

export interface RefreshInput {
  refreshToken: string;
}
