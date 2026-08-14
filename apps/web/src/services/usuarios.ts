import api from "./api";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  rolSic: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UsuarioDTO {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  rol_sic: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

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

function toBackend(data: Partial<Usuario>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.nombre !== undefined) out.nombre = data.nombre;
  if (data.email !== undefined) out.email = data.email;
  if (data.rol !== undefined) out.rol = data.rol;
  if (data.rolSic !== undefined) out.rol_sic = data.rolSic || null;
  if (data.activo !== undefined) out.activo = data.activo;
  return out;
}

export async function fetchUsuarios(params?: {
  search?: string;
  rol?: string;
  rol_sic?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Usuario[]; total: number; page: number; limit: number; totalPages: number }> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.rol) query.set('rol', params.rol);
  if (params?.rol_sic) query.set('rol_sic', params.rol_sic);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  const res = await api.get(`/usuarios${qs ? `?${qs}` : ''}`);
  return {
    data: res.data.data.map(toFrontend),
    total: res.data.total,
    page: res.data.page,
    limit: res.data.limit,
    totalPages: res.data.totalPages,
  };
}

export async function fetchUsuario(id: string): Promise<Usuario> {
  const res = await api.get(`/usuarios/${id}`);
  return toFrontend(res.data.data);
}

export async function createUsuario(data: {
  nombre: string;
  email: string;
  password: string;
  rol?: string;
  rolSic?: string | null;
}): Promise<Usuario> {
  const res = await api.post("/usuarios", {
    nombre: data.nombre,
    email: data.email,
    password: data.password,
    rol: data.rol || 'USER',
    rol_sic: data.rolSic || null,
  });
  return toFrontend(res.data.data);
}

export async function updateUsuario(id: string, data: Partial<Usuario> & { password?: string }): Promise<Usuario> {
  const payload = toBackend(data);
  if ((data as Record<string, unknown>).password !== undefined) {
    payload.password = (data as Record<string, unknown>).password;
  }
  const res = await api.put(`/usuarios/${id}`, payload);
  return toFrontend(res.data.data);
}

export async function deleteUsuario(id: string): Promise<void> {
  await api.delete(`/usuarios/${id}`);
}
