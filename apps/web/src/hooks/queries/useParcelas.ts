import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchParcelas,
  fetchParcela,
  deleteParcela,
  type Parcela,
  type ParcelasQuery,
} from "../../services/parcelas";

export function useParcelas(filters?: ParcelasQuery) {
  return useQuery({
    queryKey: ["parcelas", filters],
    queryFn: () => fetchParcelas(filters),
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
