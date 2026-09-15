import api from "./api";

export interface Actividad {
  id: number;
  codigo: string;
  tipoActividad: string;
  estado: string;
  fechaInicio: string;
  fechaFin: string | null;
}

export interface CampaniaActiva {
  id: string;
  nombre: string;
  codigo: string;
  anio_agricola: string;
}

export interface DashboardStats {
  productores: number;
  parcelas: number;
  cultivos: number;
  campanias: number;
  campaniaActiva: CampaniaActiva | null;
  actividadesRecientes: Actividad[];
}

export async function fetchDashboard(): Promise<DashboardStats> {
  const [prodRes, parRes, cultRes, campRes, actRes] = await Promise.allSettled([
    api.get("/productores?limit=1"),
    api.get("/parcelas?limit=1"),
    api.get("/cultivos?limit=1"),
    api.get("/campanias?limit=50"),
    api.get("/actividades?limit=5&sort=created_at:desc"),
  ]);

  const productores = prodRes.status === "fulfilled" ? prodRes.value.data.total ?? 0 : 0;
  const parcelas = parRes.status === "fulfilled" ? parRes.value.data.total ?? 0 : 0;
  const cultivos = cultRes.status === "fulfilled" ? cultRes.value.data.total ?? 0 : 0;

  let campanias = 0;
  let campaniaActiva: CampaniaActiva | null = null;
  if (campRes.status === "fulfilled") {
    const camps = campRes.value.data.data ?? [];
    campanias = campRes.value.data.total ?? camps.length;
    const activa = camps.find((c: Record<string, unknown>) => c.estado === "ACTIVA");
    if (activa) {
      campaniaActiva = {
        id: String(activa.id),
        nombre: String(activa.nombre),
        codigo: String(activa.codigo),
        anio_agricola: String(activa.anio_agricola),
      };
    }
  }

  const actividadesRecientes = actRes.status === "fulfilled"
    ? (actRes.value.data.data ?? []).map((dto: Record<string, unknown>) => ({
        id: Number(dto.id),
        codigo: String(dto.codigo),
        tipoActividad: String(dto.tipo_actividad ?? dto.tipoActividad ?? ""),
        estado: String(dto.estado),
        fechaInicio: String(dto.fecha_inicio ?? dto.fechaInicio ?? ""),
        fechaFin: dto.fecha_fin ? String(dto.fecha_fin) : null,
      }))
    : [];

  return {
    productores,
    parcelas,
    cultivos,
    campanias,
    campaniaActiva,
    actividadesRecientes,
  };
}
