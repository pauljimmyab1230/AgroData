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
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes"] }),
  });
}

export function useUpdateOrden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<OrdenInput> }) => updateOrden(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes"] }),
  });
}

export function useDeleteOrden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteOrden(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes"] }),
  });
}

export function useAddOperacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, data }: { ordenId: number; data: any }) => addOperacion(ordenId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes"] }),
  });
}

export function useUpdateOperacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, operacionOrdenId, data }: { ordenId: number; operacionOrdenId: number; data: any }) =>
      updateOperacion(ordenId, operacionOrdenId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes"] }),
  });
}

export function useRemoveOperacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, operacionOrdenId }: { ordenId: number; operacionOrdenId: number }) =>
      removeOperacion(ordenId, operacionOrdenId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes"] }),
  });
}

export function useAddSalida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, data }: { ordenId: number; data: any }) => addSalida(ordenId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes"] }),
  });
}

export function useUpdateSalida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, salidaId, data }: { ordenId: number; salidaId: number; data: any }) =>
      updateSalida(ordenId, salidaId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes"] }),
  });
}

export function useRemoveSalida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, salidaId }: { ordenId: number; salidaId: number }) =>
      removeSalida(ordenId, salidaId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes"] }),
  });
}

export function useFinalizarOrden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => finalizarOrden(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes"] }),
  });
}

export function useEncadenarOrden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: OrdenInput }) => encadenarOrden(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes"] }),
  });
}