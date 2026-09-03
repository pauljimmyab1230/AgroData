import api from "./api";

export interface UbigeoRecord {
  id: number;
  ubigeo: string;
  dpto: string;
  prov: string;
  distrito: string;
}

export async function fetchDepartamentos(): Promise<string[]> {
  const { data } = await api.get("/ubigeo/departamentos");
  return data.data;
}

export async function fetchProvincias(dpto: string): Promise<string[]> {
  const { data } = await api.get(`/ubigeo/departamentos/${encodeURIComponent(dpto)}/provincias`);
  return data.data;
}

export async function fetchDistritos(dpto: string, prov: string): Promise<{ distrito: string; ubigeo: string }[]> {
  const { data } = await api.get(
    `/ubigeo/departamentos/${encodeURIComponent(dpto)}/provincias/${encodeURIComponent(prov)}/distritos`
  );
  return data.data;
}

export async function fetchAllUbigeo(filters?: { dpto?: string; prov?: string }): Promise<UbigeoRecord[]> {
  const params = new URLSearchParams();
  if (filters?.dpto) params.set("dpto", filters.dpto);
  if (filters?.prov) params.set("prov", filters.prov);
  const query = params.toString();
  const { data } = await api.get(`/ubigeo${query ? `?${query}` : ""}`);
  return data.data;
}
