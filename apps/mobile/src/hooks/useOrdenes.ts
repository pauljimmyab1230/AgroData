import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrdenes,
  fetchOrden,
  fetchBalance,
  fetchTrazabilidad,
  fetchOrdenStats,
  fetchOperacionesActivas,
  fetchRecetasActivas,
  fetchReceta,
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
  type OperacionEjecutadaInput,
  type SalidaInput,
} from "../services/ordenes";
import { useAcumulado } from "./acumularLista";

// Todas las queries del módulo cuelgan del prefijo ["ordenes"] para que
// invalidarOrdenes refresque listas, detalles, balances y trazabilidad.
function invalidarOrdenes(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["ordenes"] });
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
  const pagina = params?.page ?? 1;
  const clave = JSON.stringify([params?.search, params?.estado, params?.etapa, params?.formato_salida, params?.receta_id, params?.limit]);
  const acumular = useAcumulado<OrdenProcesamiento>();
  const consulta = useQuery({
    queryKey: ["ordenes", "lista", { ...params }],
    queryFn: ({ signal }) => fetchOrdenes(params, signal),
    placeholderData: (prev) => prev,
  });
  const items = acumular(clave, pagina, consulta.data?.data);
  return {
    ...consulta,
    data: consulta.data ? { ...consulta.data, data: items } : undefined,
  };
}

export function useOrden(id: number | null) {
  return useQuery<OrdenProcesamiento>({
    queryKey: ["ordenes", "detalle", id],
    queryFn: ({ signal }) => fetchOrden(id!, signal),
    enabled: id !== null,
  });
}

export function useBalance(id: number | null) {
  return useQuery({
    queryKey: ["ordenes", "balance", id],
    queryFn: ({ signal }) => fetchBalance(id!, signal),
    enabled: id !== null,
  });
}

export function useTrazabilidad(id: number | null) {
  return useQuery({
    queryKey: ["ordenes", "trazabilidad", id],
    queryFn: ({ signal }) => fetchTrazabilidad(id!, signal),
    enabled: id !== null,
  });
}

export function useOrdenStats() {
  return useQuery({
    queryKey: ["ordenes", "stats"],
    queryFn: ({ signal }) => fetchOrdenStats(signal),
  });
}

export function useOperacionesActivas() {
  return useQuery({
    queryKey: ["ordenes", "operaciones-activas"],
    queryFn: ({ signal }) => fetchOperacionesActivas(signal),
  });
}

export function useRecetasActivas(etapa?: string) {
  return useQuery({
    queryKey: ["ordenes", "recetas-activas", etapa],
    queryFn: ({ signal }) => fetchRecetasActivas(etapa, signal),
  });
}

export function useReceta(id: number | null) {
  return useQuery({
    queryKey: ["ordenes", "receta", id],
    queryFn: ({ signal }) => fetchReceta(id!, signal),
    enabled: id !== null,
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
    mutationFn: ({ ordenId, data }: { ordenId: number; data: OperacionEjecutadaInput }) => addOperacion(ordenId, data),
    onSuccess: () => invalidarOrdenes(qc),
  });
}

export function useUpdateOperacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, operacionOrdenId, data }: { ordenId: number; operacionOrdenId: number; data: Partial<OperacionEjecutadaInput> }) =>
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
    mutationFn: ({ ordenId, data }: { ordenId: number; data: SalidaInput }) => addSalida(ordenId, data),
    onSuccess: () => invalidarOrdenes(qc),
  });
}

export function useUpdateSalida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, salidaId, data }: { ordenId: number; salidaId: number; data: Partial<SalidaInput> }) =>
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
