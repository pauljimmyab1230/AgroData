import { useQuery } from "@tanstack/react-query";
import { fetchActividades, fetchActividad, fetchActividadStats, type Actividad, type ActividadesResponse, type ActividadStats } from "../services/actividades";
import { useAcumulado } from "./acumularLista";

export function useActividades(params?: {
  search?: string;
  estado?: string;
  tipo_actividad?: string;
  cultivo_id?: string;
  page?: number;
  limit?: number;
}) {
  const pagina = params?.page ?? 1;
  const clave = JSON.stringify([params?.search, params?.estado, params?.tipo_actividad, params?.cultivo_id, params?.limit]);
  const acumular = useAcumulado<Actividad>();
  const consulta = useQuery<ActividadesResponse>({
    queryKey: ["actividades", "lista", params],
    queryFn: ({ signal }) => fetchActividades({ ...params, signal }),
    placeholderData: (prev) => prev,
  });
  const items = acumular(clave, pagina, consulta.data?.data);
  return {
    ...consulta,
    data: consulta.data ? { ...consulta.data, data: items } : undefined,
  };
}

export function useActividad(id: number | null) {
  return useQuery<Actividad>({
    queryKey: ["actividades", "detalle", id],
    queryFn: ({ signal }) => fetchActividad(id!, signal),
    enabled: id !== null,
  });
}

export function useActividadStats() {
  return useQuery<ActividadStats>({
    queryKey: ["actividades", "stats"],
    queryFn: ({ signal }) => fetchActividadStats(signal),
  });
}
