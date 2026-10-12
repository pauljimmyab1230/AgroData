import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrdenes,
  fetchOrden,
  fetchBalance,
  fetchTrazabilidad,
  fetchOrdenStats,
  fetchOperacionesActivas,
  fetchRecetasActivas,
  createOrden,
  updateOrden,
  deleteOrden,
  addOperacion,
  updateOperacion,
  removeOperacion,
  addSalida,
  updateSalida,
  removeSalida,
  finalizarOrden,
  encadenarOrden,
  type OrdenProcesamiento,
  type OrdenInput,
} from "../services/ordenes";

function invalidarOrdenes(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["ordenes"] });
  qc.invalidateQueries({ queryKey: ["ordenes-stats"] });
  qc.invalidateQueries({ queryKey: ["orden"] });
  qc.invalidateQueries({ queryKey: ["orden-balance"] });
  qc.invalidateQueries({ queryKey: ["orden-trazabilidad"] });
}

export function useOrdenes(params?: {
  search?: string;
  estado?: string;
  etapa?: string;
  formato_salida?: string;
  receta_id?: number;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["ordenes", params],
    queryFn: () => fetchOrdenes(params),
    placeholderData: (prev) => prev,
  });
}

export function useOrden(id: number | null) {
  return useQuery<OrdenProcesamiento>({
    queryKey: ["orden", id],
    queryFn: () => fetchOrden(id!),
    enabled: id !== null,
  });
}

export function useBalance(id: number | null) {
  return useQuery({
    queryKey: ["orden-balance", id],
    queryFn: () => fetchBalance(id!),
    enabled: id !== null,
  });
}

export function useTrazabilidad(id: number | null) {
  return useQuery({
    queryKey: ["orden-trazabilidad", id],
    queryFn: () => fetchTrazabilidad(id!),
    enabled: id !== null,
  });
}

export function useOrdenStats() {
  return useQuery({
    queryKey: ["ordenes-stats"],
    queryFn: fetchOrdenStats,
  });
}

export function useOperacionesActivas() {
  return useQuery({
    queryKey: ["operaciones-activas"],
    queryFn: fetchOperacionesActivas,
  });
}

export function useRecetasActivas(etapa?: string) {
  return useQuery({
    queryKey: ["recetas-activas", etapa],
    queryFn: () => fetchRecetasActivas(etapa),
  });
}

export function useCreateOrden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: OrdenInput) => createOrden(data),
    onSuccess: () => invalidarOrdenes(qc),
  });
}

export function useUpdateOrden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<OrdenInput> }) => updateOrden(id, data),
    onSuccess: () => invalidarOrdenes(qc),
  });
}

export function useDeleteOrden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteOrden(id),
    onSuccess: () => invalidarOrdenes(qc),
  });
}

export function useAddOperacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, data }: { ordenId: number; data: any }) => addOperacion(ordenId, data),
    onSuccess: () => invalidarOrdenes(qc),
  });
}

export function useUpdateOperacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, operacionOrdenId, data }: { ordenId: number; operacionOrdenId: number; data: any }) =>
      updateOperacion(ordenId, operacionOrdenId, data),
    onSuccess: () => invalidarOrdenes(qc),
  });
}

export function useRemoveOperacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, operacionOrdenId }: { ordenId: number; operacionOrdenId: number }) =>
      removeOperacion(ordenId, operacionOrdenId),
    onSuccess: () => invalidarOrdenes(qc),
  });
}

export function useAddSalida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, data }: { ordenId: number; data: any }) => addSalida(ordenId, data),
    onSuccess: () => invalidarOrdenes(qc),
  });
}

export function useUpdateSalida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, salidaId, data }: { ordenId: number; salidaId: number; data: any }) =>
      updateSalida(ordenId, salidaId, data),
    onSuccess: () => invalidarOrdenes(qc),
  });
}

export function useRemoveSalida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, salidaId }: { ordenId: number; salidaId: number }) =>
      removeSalida(ordenId, salidaId),
    onSuccess: () => invalidarOrdenes(qc),
  });
}

export function useFinalizarOrden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => finalizarOrden(id),
    onSuccess: () => invalidarOrdenes(qc),
  });
}

export function useEncadenarOrden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: OrdenInput }) => encadenarOrden(id, data),
    onSuccess: () => invalidarOrdenes(qc),
  });
}