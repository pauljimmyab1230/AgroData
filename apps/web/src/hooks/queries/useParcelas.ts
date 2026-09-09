import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchParcelas,
  fetchParcela,
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
  });
}

export function useParcelasStats(filters?: Omit<ParcelasQuery, 'page' | 'limit'>) {
  return useQuery<ParcelasStats>({
    queryKey: ["parcelas-stats", filters],
    queryFn: () => fetchParcelasStats(filters),
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

export function useDeleteParcela() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteParcela(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["parcelas"] });
    },
  });
}
