import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  fetchCultivos,
  fetchCultivo,
  createCultivo,
  updateCultivo,
  deleteCultivo,
  fetchCultivoGlobalStats,
  type Cultivo,
  type CultivosQuery,
  type CultivoGlobalStats,
} from "../../services/cultivos";

export function useCultivos(filters?: CultivosQuery) {
  return useQuery({
    queryKey: ["cultivos", filters],
    queryFn: () => fetchCultivos(filters),
    placeholderData: keepPreviousData,
  });
}

export function useCultivo(id: string | null) {
  return useQuery<Cultivo>({
    queryKey: ["cultivo", id],
    queryFn: () => fetchCultivo(id!),
    enabled: id !== null,
  });
}

export function useCultivoGlobalStats(filters?: Record<string, unknown>) {
  return useQuery<CultivoGlobalStats>({
    queryKey: ["cultivoGlobalStats", filters],
    queryFn: () => fetchCultivoGlobalStats(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useCreateCultivo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Cultivo>) => createCultivo(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cultivos"] });
      qc.invalidateQueries({ queryKey: ["cultivoGlobalStats"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateCultivo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Cultivo> }) =>
      updateCultivo(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cultivos"] });
      qc.invalidateQueries({ queryKey: ["cultivoGlobalStats"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteCultivo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCultivo(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cultivos"] });
      qc.invalidateQueries({ queryKey: ["cultivoGlobalStats"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
