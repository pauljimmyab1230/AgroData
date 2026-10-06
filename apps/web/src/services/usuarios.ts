import { useState, useEffect } from "react";
import api from "./api";

// ─── Types ────────────────────────────────────────────────
export type Rol = "ADMIN" | "USER";
export type RolSic =
  | "RESPONSABLE_SIC"
  | "INSPECTOR"
  | "COMITE_DECISION"
  | "TECNICO_CAMPO"
  | "ACOPIADOR"
  | "CAPACITADOR";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  rolSic: RolSic | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UsuarioDTO {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  rol_sic: RolSic | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  data: UsuarioDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Mappers ──────────────────────────────────────────────
function toFrontend(dto: UsuarioDTO): Usuario {
  return {
    id: dto.id,
    nombre: dto.nombre,
    email: dto.email,
    rol: dto.rol,
    rolSic: dto.rol_sic,
    activo: dto.activo,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toBackend(data: Partial<Usuario>): Partial<UsuarioDTO> {
  const out: Record<string, unknown> = {};
  if (data.nombre !== undefined) out.nombre = data.nombre;
  if (data.email !== undefined) out.email = data.email;
  if (data.rol !== undefined) out.rol = data.rol;
  if (data.rolSic !== undefined) out.rol_sic = data.rolSic;
  if (data.activo !== undefined) out.activo = data.activo;
  return out as Partial<UsuarioDTO>;
}

// ─── API calls ────────────────────────────────────────────
export async function fetchUsuarios(params?: {
  search?: string;
  rol?: string;
  rol_sic?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Usuario[]; total: number; page: number; limit: number; totalPages: number }> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.rol) query.set("rol", params.rol);
  if (params?.rol_sic) query.set("rol_sic", params.rol_sic);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const qs = query.toString();
  const res = await api.get<PaginatedResponse>(`/usuarios${qs ? `?${qs}` : ""}`);
  return {
    data: res.data.data.map(toFrontend),
    total: res.data.total,
    page: res.data.page,
    limit: res.data.limit,
    totalPages: res.data.totalPages,
  };
}

export async function fetchUsuario(id: string): Promise<Usuario> {
  const res = await api.get<{ data: UsuarioDTO }>(`/usuarios/${id}`);
  return toFrontend(res.data.data);
}

export async function createUsuario(data: {
  nombre: string;
  email: string;
  password: string;
  rol?: Rol;
  rolSic?: RolSic | null;
}): Promise<Usuario> {
  const res = await api.post<{ data: UsuarioDTO }>("/usuarios", {
    nombre: data.nombre,
    email: data.email,
    password: data.password,
    rol: data.rol ?? "USER",
    rol_sic: data.rolSic ?? null,
  });
  return toFrontend(res.data.data);
}

export async function updateUsuario(
  id: string,
  data: Partial<Usuario> & { password?: string },
): Promise<Usuario> {
  const payload = toBackend(data);
  if (data.password !== undefined) {
    (payload as Record<string, unknown>).password = data.password;
  }
  const res = await api.put<{ data: UsuarioDTO }>(`/usuarios/${id}`, payload);
  return toFrontend(res.data.data);
}

export async function deleteUsuario(id: string): Promise<void> {
  await api.delete(`/usuarios/${id}`);
}

// Cambio de contraseña del usuario autenticado: exige la contraseña actual.
export async function changePassword(
  passwordActual: string,
  passwordNueva: string,
): Promise<void> {
  await api.patch("/auth/change-password", { passwordActual, passwordNueva });
}

// Autoupdate del usuario autenticado (solo perfil, sin rol/activo).
export async function updateMe(data: {
  nombre?: string;
  email?: string;
  password?: string;
}): Promise<Usuario> {
  const res = await api.patch("/usuarios/me", data);
  return toFrontend(res.data.data);
}

// ─── Basic (para dropdowns) ─────────────────────────────────

export interface UsuarioBasico {
  id: string;
  nombre: string;
  email: string;
  rol_sic: RolSic | null;
}

export async function fetchUsuariosBasic(rol_sic?: string): Promise<UsuarioBasico[]> {
  const params: Record<string, string> = {};
  if (rol_sic) params.rol_sic = rol_sic;
  const res = await api.get<{ data: UsuarioBasico[] }>("/usuarios/basic", { params });
  return res.data.data ?? [];
}

export function useUsuariosBasic(rol_sic?: string) {
  const [usuarios, setUsuarios] = useState<UsuarioBasico[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchUsuariosBasic(rol_sic)
      .then((data) => {
        if (!cancelled) setUsuarios(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [rol_sic]);

  return { usuarios, loading };
}
