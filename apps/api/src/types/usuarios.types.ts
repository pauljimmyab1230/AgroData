import type { Rol, RolSic } from '@prisma/client';

// ─── Enums as const ───────────────────────────────────────
export const ROL_VALUES = ['ADMIN', 'USER'] as const;
export const ROL_SIC_VALUES = [
  'RESPONSABLE_SIC',
  'INSPECTOR',
  'COMITE_DECISION',
  'TECNICO_CAMPO',
  'ACOPIADOR',
  'CAPACITADOR',
] as const;

// ─── API Response ─────────────────────────────────────────
export interface UsuarioResponse {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  rol_sic: RolSic | null;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UsuarioListResponse {
  data: UsuarioResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsuarioBasicResponse {
  id: string;
  nombre: string;
  email: string;
  rol_sic: RolSic | null;
}

// ─── Service Input ────────────────────────────────────────
export interface CreateUsuarioInput {
  nombre: string;
  email: string;
  password: string;
  rol?: Rol;
  rol_sic?: RolSic | null;
}

export interface UpdateUsuarioInput {
  nombre?: string;
  email?: string;
  password?: string;
  rol?: Rol;
  rol_sic?: RolSic | null;
  activo?: boolean;
}

// ─── Query Params ─────────────────────────────────────────
export interface ListUsuariosQuery {
  search?: string;
  rol?: string;
  rol_sic?: string;
  page?: number;
  limit?: number;
}
