import { useQuery } from "@tanstack/react-query";
import { fetchActividades, fetchActividad, fetchActividadStats, type Actividad, type ActividadesResponse, type ActividadStats } from "../services/actividades";

export function useActividades(params?: {
  search?: string;
  estado?: string;
  tipo_actividad?: string;
  cultivo_id?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<ActividadesResponse>({
    queryKey: ["actividades", params],
    queryFn: ({ signal }) => fetchActividades({ ...params, signal }),
    placeholderData: (prev) => prev,
  });
}

export function useActividad(id: number | null) {
  return useQuery<Actividad>({
    queryKey: ["actividad", id],
    queryFn: ({ signal }) => fetchActividad(id!, signal),
    enabled: id !== null,
  });
}

export function useActividadStats() {
  return useQuery<ActividadStats>({
    queryKey: ["actividadesStats"],
    queryFn: ({ signal }) => fetchActividadStats(signal),
  });
}
