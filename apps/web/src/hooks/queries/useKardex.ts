import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  fetchKardex,
  fetchKardexItem,
  createKardexItem,
  updateKardexItem,
  deleteKardexItem,
  addKardexMovimiento,
  removeKardexMovimiento,
  recomputeStock,
  type KardexItem,
  type KardexItemFormData,
  type KardexQuery,
} from "../../services/kardex";

export function useKardex(filters?: KardexQuery) {
  return useQuery({
    queryKey: ["kardex", "lista", filters],
    queryFn: () => fetchKardex(filters),
    placeholderData: keepPreviousData,
  });
}

export function useKardexItem(id: string | number | null | undefined) {
  return useQuery<KardexItem>({
    queryKey: ["kardex", "detalle", id],
    queryFn: () => fetchKardexItem(String(id)),
    enabled: id != null && id !== "",
  });
}

export function useCreateKardex() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<KardexItemFormData>) => createKardexItem(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kardex"] }),
  });
}

export function useUpdateKardex() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<KardexItemFormData> }) =>
      updateKardexItem(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kardex"] }),
  });
}

export function useDeleteKardex() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteKardexItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kardex"] }),
  });
}

export function useAddMovimiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      kardexId,
      data,
    }: {
      kardexId: string | number;
      data: {
        tipo: string;
        cantidad: number;
        destino?: string;
        referencia?: string;
        responsable?: string;
        observaciones?: string;
        fecha?: string;
      };
    }) => addKardexMovimiento(String(kardexId), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kardex"] }),
  });
}

export function useRemoveMovimiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ kardexId, movimientoId }: { kardexId: string | number; movimientoId: string | number }) =>
      removeKardexMovimiento(kardexId, movimientoId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kardex"] }),
  });
}

export function useRecomputeStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (kardexId: string) => recomputeStock(kardexId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kardex"] }),
  });
}
