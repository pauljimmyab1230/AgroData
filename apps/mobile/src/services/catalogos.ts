import api from "./api";

export async function fetchCatalogo(tipo: string): Promise<string[]> {
  try {
    const { data } = await api.get(`/catalogos/${tipo}/activos`);
    return (data.data ?? []).map((item: any) => item.nombre || item.valor || item);
  } catch {
    return [];
  }
}

export async function fetchProductoresOpciones(): Promise<{ id: number; label: string }[]> {
  try {
    const { data } = await api.get("/productores");
    const items = data.data ?? [];
    if (!Array.isArray(items)) return [];
    return items.map((p: any) => ({
      id: p.id,
      label: `${p.codigo || ""} - ${p.nombres || ""} ${p.apellido_paterno || p.apellidoPaterno || ""}`.trim(),
    }));
  } catch (e) {
    console.log("Error fetching productores options:", e);
    return [];
  }
}

export async function fetchParcelasOpciones(): Promise<{ id: number; label: string }[]> {
  try {
    const { data } = await api.get("/parcelas?limit=500");
    const items = data.data ?? [];
    if (!Array.isArray(items)) return [];
    return items.map((p: any) => ({
      id: p.id,
      label: `${p.codigo || ""} - ${p.nombre || ""}`.trim(),
    }));
  } catch (e) {
    console.log("Error fetching parcelas options:", e);
    return [];
  }
}

export async function fetchCampaniasOpciones(): Promise<{ id: number; label: string }[]> {
  try {
    const { data } = await api.get("/campanias?limit=500");
    const items = data.data ?? [];
    if (!Array.isArray(items)) return [];
    return items.map((c: any) => ({
      id: c.id,
      label: `${c.codigo || ""} - ${c.nombre || ""}`.trim(),
    }));
  } catch (e) {
    console.log("Error fetching campanias options:", e);
    return [];
  }
}

export async function fetchCultivosOpciones(): Promise<{ id: number; label: string }[]> {
  try {
    const { data } = await api.get("/cultivos?limit=500");
    const items = data.data ?? [];
    if (!Array.isArray(items)) return [];
    return items.map((c: any) => ({
      id: c.id,
      label: `${c.codigo || ""} - ${c.cultivo || ""}`.trim(),
    }));
  } catch (e) {
    console.log("Error fetching cultivos options:", e);
    return [];
  }
}
