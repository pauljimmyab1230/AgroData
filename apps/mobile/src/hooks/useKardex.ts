import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchInventario,
  fetchKardexItem,
  fetchKardexStats,
  fetchAlertas,
  createKardexItem,
  updateKardexItem,
  deleteKardexItem,
  addKardexMovimiento,
  removeKardexMovimiento,
  darDeBaja,
  registrarSalidaProducto,
  type InventarioResponse,
  type InventarioItem,
  type KardexItem,
  type StatsKardex,
  type AlertasKardex,
} from "../services/kardex";
import { useAcumulado } from "./acumularLista";

export function useInventario(params?: {
  search?: string;
  origen?: string;
  categoria?: string;
  etapa?: string;
  estado?: string;
  page?: number;
  limit?: number;
}) {
  const pagina = params?.page ?? 1;
  const clave = JSON.stringify([params?.search, params?.origen, params?.categoria, params?.etapa, params?.estado, params?.limit]);
  const acumular = useAcumulado<InventarioItem>();
  const consulta = useQuery<InventarioResponse>({
    queryKey: ["kardex", "inventario", params],
    queryFn: ({ signal }) => fetchInventario({ ...params, signal }),
    placeholderData: (prev) => prev,
  });
  const items = acumular(clave, pagina, consulta.data?.data);
  return {
    ...consulta,
    data: consulta.data ? { ...consulta.data, data: items } : undefined,
  };
}

export function useKardexItem(id: number | null) {
  return useQuery<KardexItem>({
    queryKey: ["kardex", "item", id],
    queryFn: ({ signal }) => fetchKardexItem(id!, signal),
    enabled: id !== null,
  });
}

export function useKardexStats() {
  return useQuery<StatsKardex>({
    queryKey: ["kardex", "stats"],
    queryFn: ({ signal }) => fetchKardexStats(signal),
  });
}

export function useAlertas() {
  return useQuery<AlertasKardex>({
    queryKey: ["kardex", "alertas"],
    queryFn: ({ signal }) => fetchAlertas(signal),
  });
}

export function useCreateKardexItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createKardexItem(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kardex"] }),
  });
}

export function useUpdateKardexItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updateKardexItem(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kardex"] }),
  });
}

export function useDeleteKardexItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteKardexItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kardex"] }),
  });
}

export function useAddKardexMovimiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ kardexId, data }: { kardexId: number; data: Parameters<typeof addKardexMovimiento>[1] }) =>
      addKardexMovimiento(kardexId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kardex"] }),
  });
}

export function useRemoveKardexMovimiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ kardexId, movimientoId }: { kardexId: number; movimientoId: number }) =>
      removeKardexMovimiento(kardexId, movimientoId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kardex"] }),
  });
}

export function useDarDeBaja() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ kardexId, motivo, cantidad, responsable }: { kardexId: number; motivo: string; cantidad?: number; responsable?: string }) =>
      darDeBaja(kardexId, motivo, cantidad, responsable),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kardex"] }),
  });
}

export function useRegistrarSalida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof registrarSalidaProducto>[0]) => registrarSalidaProducto(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kardex"] }),
  });
}

export { type InventarioItem };