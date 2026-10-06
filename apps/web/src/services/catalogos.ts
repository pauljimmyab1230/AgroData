import api from "./api";

export interface CatalogoItem {
  id: number;
  tipo: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  orden: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CatalogoConfig {
  titulo: string;
  descripcion: string;
}

export const catalogoConfigs: Record<string, CatalogoConfig> = {
  departamentos: { titulo: "Departamentos", descripcion: "Catálogo de departamentos del Perú" },
  "tipos-cultivo": { titulo: "Tipos de Cultivo", descripcion: "Catálogo de especies y tipos de cultivo" },
  "tipos-suelo": { titulo: "Tipos de Suelo", descripcion: "Clasificación de suelos para agricultura" },
  "fuentes-agua": { titulo: "Fuentes de Agua", descripcion: "Fuentes disponibles para riego" },
  "sistemas-riego": { titulo: "Sistemas de Riego", descripcion: "Métodos de riego utilizados" },
  "zonas-agroecologicas": { titulo: "Zonas Agroecológicas", descripcion: "Zonas de producción según altitud" },
  "tipos-actividad": { titulo: "Tipos de Actividad", descripcion: "Clasificación de actividades agrícolas" },
  "tipos-documento": { titulo: "Tipos de Documento", descripcion: "Tipos de documentos que pueden registrarse" },
  parentescos:           { titulo: "Parentescos",        descripcion: "Tipos de relación familiar" },
  "criterios-checklist": { titulo: "Criterios de Inspección", descripcion: "Criterios evaluados en listas de verificación de campo" },
};

export async function fetchCatalogoItems(
  tipo: string,
  params?: { search?: string; activo?: boolean; page?: number; limit?: number }
): Promise<{ data: CatalogoItem[]; total: number; page: number; limit: number; totalPages: number }> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.activo !== undefined) query.activo = String(params.activo);
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const res = await api.get(`/catalogos/${tipo}`, { params: query });
  return {
    data: res.data.data ?? [],
    total: res.data.total ?? 0,
    page: res.data.page ?? 1,
    limit: res.data.limit ?? 50,
    totalPages: res.data.totalPages ?? 1,
  };
}

export async function fetchCatalogoActivos(tipo: string): Promise<CatalogoItem[]> {
  const res = await api.get(`/catalogos/${tipo}/activos`);
  return res.data.data ?? [];
}

export async function createCatalogoItem(tipo: string, data: { nombre: string; descripcion?: string; orden?: number }): Promise<CatalogoItem> {
  const res = await api.post(`/catalogos/${tipo}`, data);
  return res.data.data;
}

export async function updateCatalogoItem(id: number, data: { nombre?: string; descripcion?: string | null; activo?: boolean; orden?: number }): Promise<CatalogoItem> {
  const res = await api.put(`/catalogos/item/${id}`, data);
  return res.data.data;
}

export async function toggleCatalogoItem(id: number): Promise<CatalogoItem> {
  const res = await api.patch(`/catalogos/item/${id}/toggle`);
  return res.data.data;
}

export async function deleteCatalogoItem(id: number): Promise<void> {
  await api.delete(`/catalogos/item/${id}`);
}
