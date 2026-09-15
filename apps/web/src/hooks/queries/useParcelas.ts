import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  fetchParcelas,
  fetchParcela,
  createParcela,
  updateParcela,
  deleteParcela,
  fetchParcelasStats,
  fetchParcelaHistorial,
  type Parcela,
  type ParcelasQuery,
  type ParcelasStats,
  type ParcelaHistorialItem,
} from "../../services/parcelas";

export function useParcelas(filters?: ParcelasQuery) {
  return useQuery({
    queryKey: ["parcelas", filters],
    queryFn: () => fetchParcelas(filters),
    placeholderData: keepPreviousData,
  });
}

export function useParcelasStats(filters?: Omit<ParcelasQuery, 'page' | 'limit'>) {
  return useQuery<ParcelasStats>({
    queryKey: ["parcelas-stats", filters],
    queryFn: () => fetchParcelasStats(filters),
    placeholderData: keepPreviousData,
  });
}

export function useParcelaHistorial(parcelaId: string | null) {
  return useQuery<ParcelaHistorialItem[]>({
    queryKey: ["parcela-historial", parcelaId],
    queryFn: () => fetchParcelaHistorial(parcelaId!),
    enabled: parcelaId !== null,
  });
}

export function useParcela(id: string | null) {
  return useQuery<Parcela>({
    queryKey: ["parcela", id],
    queryFn: () => fetchParcela(id!),
    enabled: id !== null,
  });
}

export function useCreateParcela() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Parcela>) => createParcela(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["parcelas"] });
      qc.invalidateQueries({ queryKey: ["parcelas-stats"] });
    },
  });
}

export function useUpdateParcela() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Parcela> }) => updateParcela(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["parcelas"] });
      qc.invalidateQueries({ queryKey: ["parcela", variables.id] });
      qc.invalidateQueries({ queryKey: ["parcelas-stats"] });
    },
  });
}

export function useDeleteParcela() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteParcela(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["parcelas"] });
      qc.invalidateQueries({ queryKey: ["parcelas-stats"] });
    },
  });
}
