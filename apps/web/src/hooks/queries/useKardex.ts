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

// ==================== Hooks nuevos (inventario, alertas, movimientos, stats, baja) ====================
import {
  fetchInventario,
  fetchAlertas,
  fetchMovimientosGlobales,
  fetchKardexStats,
  darDeBaja,
  registrarSalidaProducto,
  type StatsKardex,
} from "../../services/kardex";

export function useInventario(params?: {
  search?: string;
  origen?: string;
  categoria?: string;
  etapa?: string;
  estado?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["kardex", "inventario", params],
    queryFn: () => fetchInventario(params),
    placeholderData: keepPreviousData,
  });
}

export function useAlertas() {
  return useQuery({
    queryKey: ["kardex", "alertas"],
    queryFn: fetchAlertas,
    staleTime: 60_000,
  });
}

export function useMovimientosGlobales(params?: {
  kardex_id?: number;
  tipo?: string;
  origen?: string;
  referencia_tipo?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["kardex", "movimientos", params],
    queryFn: () => fetchMovimientosGlobales(params),
    placeholderData: keepPreviousData,
  });
}

export function useKardexStats() {
  return useQuery<StatsKardex>({
    queryKey: ["kardex", "stats"],
    queryFn: fetchKardexStats,
    staleTime: 30_000,
  });
}

export function useDarDeBaja() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      kardexId,
      motivo,
      cantidad,
      responsable,
    }: {
      kardexId: number;
      motivo: string;
      cantidad?: number;
      responsable?: string;
    }) => darDeBaja(kardexId, motivo, cantidad, responsable),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kardex"] }),
  });
}

export function useRegistrarSalida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      kardex_id: number;
      cantidad: number;
      destino?: string | null;
      cliente?: string | null;
      referencia?: string | null;
      responsable?: string | null;
      observaciones?: string | null;
      fecha?: string;
    }) => registrarSalidaProducto(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kardex"] }),
  });
}
