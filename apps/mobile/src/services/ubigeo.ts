import api from "./api";

export async function fetchDepartamentos(): Promise<string[]> {
  const { data } = await api.get("/ubigeo/departamentos");
  return data.data;
}

export async function fetchProvincias(dpto: string): Promise<string[]> {
  const { data } = await api.get(`/ubigeo/departamentos/${encodeURIComponent(dpto)}/provincias`);
  return data.data;
}

export async function fetchDistritos(dpto: string, prov: string): Promise<{ distrito: string; ubigeo: string }[]> {
  const { data } = await api.get(`/ubigeo/departamentos/${encodeURIComponent(dpto)}/provincias/${encodeURIComponent(prov)}/distritos`);
  return data.data;
}
