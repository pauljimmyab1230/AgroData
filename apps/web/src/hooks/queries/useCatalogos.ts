import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  fetchCatalogoItems,
  fetchCatalogoActivos,
  createCatalogoItem,
  updateCatalogoItem,
  toggleCatalogoItem,
  deleteCatalogoItem,
  type CatalogoItem,
} from "../../services/catalogos";

export function useCatalogoItems(tipo: string, params?: { search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["catalogos", tipo, "lista", params],
    queryFn: () => fetchCatalogoItems(tipo, params),
    enabled: !!tipo,
    placeholderData: keepPreviousData,
  });
}

export function useCatalogoActivos(tipo: string) {
  return useQuery<CatalogoItem[]>({
    queryKey: ["catalogos", tipo, "activos"],
    queryFn: () => fetchCatalogoActivos(tipo),
    enabled: !!tipo,
    staleTime: 5 * 60_000,
  });
}

export function useCreateCatalogoItem(tipo: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { nombre: string; descripcion?: string; orden?: number }) =>
      createCatalogoItem(tipo, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogos", tipo] }),
  });
}

export function useUpdateCatalogoItem(tipo: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { nombre?: string; descripcion?: string | null; activo?: boolean; orden?: number } }) =>
      updateCatalogoItem(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogos", tipo] }),
  });
}

export function useToggleCatalogoItem(tipo: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => toggleCatalogoItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogos", tipo] }),
  });
}

export function useDeleteCatalogoItem(tipo: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCatalogoItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["catalogos", tipo] }),
  });
}
