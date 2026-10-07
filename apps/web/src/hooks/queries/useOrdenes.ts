import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  fetchOrdenes,
  fetchOrden,
  fetchBalance,
  fetchTrazabilidad,
  fetchOrdenStats,
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
  fetchOperaciones,
  fetchOperacionesActivas,
  createOperacion,
  updateOperacionCatalogo,
  deleteOperacionCatalogo,
  fetchRecetas,
  fetchReceta,
  fetchRecetasActivas,
  createReceta,
  updateReceta,
  deleteReceta,
  type OrdenInput,
  type SalidaInput,
  type OperacionEjecutadaInput,
  type EtapaProceso,
  type FormatoSalida,
} from "../../services/ordenes";

// ==================== Operaciones de proceso ====================
export function useOperaciones(params?: { search?: string; activo?: boolean; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["operaciones-proceso", "lista", params],
    queryFn: () => fetchOperaciones(params),
    placeholderData: keepPreviousData,
  });
}

export function useOperacionesActivas() {
  return useQuery({
    queryKey: ["operaciones-proceso", "activas"],
    queryFn: fetchOperacionesActivas,
    staleTime: 5 * 60_000,
  });
}

export function useCreateOperacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOperacion,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["operaciones-proceso"] }),
  });
}

export function useUpdateOperacionCatalogo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateOperacionCatalogo>[1] }) =>
      updateOperacionCatalogo(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["operaciones-proceso"] }),
  });
}

export function useDeleteOperacionCatalogo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteOperacionCatalogo(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["operaciones-proceso"] }),
  });
}

// ==================== Recetas ====================
export function useRecetas(params?: { search?: string; etapa?: string; producto_base?: string; activo?: boolean; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["recetas", "lista", params],
    queryFn: () => fetchRecetas(params),
    placeholderData: keepPreviousData,
  });
}

export function useRecetasActivas(etapa?: EtapaProceso) {
  return useQuery({
    queryKey: ["recetas", "activas", etapa ?? "todas"],
    queryFn: () => fetchRecetasActivas(etapa),
    staleTime: 5 * 60_000,
  });
}

export function useReceta(id: number | null | undefined) {
  return useQuery({
    queryKey: ["recetas", "detalle", id],
    queryFn: () => fetchReceta(id!),
    enabled: id != null,
  });
}

export function useCreateReceta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createReceta,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recetas"] }),
  });
}

export function useUpdateReceta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateReceta>[1] }) =>
      updateReceta(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recetas"] }),
  });
}

export function useDeleteReceta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteReceta(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recetas"] }),
  });
}

// ==================== Órdenes ====================
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
    queryKey: ["ordenes-procesamiento", "lista", params],
    queryFn: () => fetchOrdenes(params),
    placeholderData: keepPreviousData,
  });
}

export function useOrden(id: number | null | undefined) {
  return useQuery({
    queryKey: ["ordenes-procesamiento", "detalle", id],
    queryFn: () => fetchOrden(id!),
    enabled: id != null,
  });
}

export function useBalance(id: number | null | undefined) {
  return useQuery({
    queryKey: ["ordenes-procesamiento", "balance", id],
    queryFn: () => fetchBalance(id!),
    enabled: id != null,
  });
}

export function useTrazabilidad(id: number | null | undefined) {
  return useQuery({
    queryKey: ["ordenes-procesamiento", "trazabilidad", id],
    queryFn: () => fetchTrazabilidad(id!),
    enabled: id != null,
  });
}

export function useOrdenStats() {
  return useQuery({
    queryKey: ["ordenes-procesamiento", "stats"],
    queryFn: fetchOrdenStats,
    staleTime: 30_000,
  });
}

export function useCreateOrden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: OrdenInput) => createOrden(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes-procesamiento"] }),
  });
}

export function useUpdateOrden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<OrdenInput> }) => updateOrden(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes-procesamiento"] }),
  });
}

export function useDeleteOrden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteOrden(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes-procesamiento"] }),
  });
}

export function useAddOperacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, data }: { ordenId: number; data: OperacionEjecutadaInput }) =>
      addOperacion(ordenId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes-procesamiento"] }),
  });
}

export function useUpdateOperacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      ordenId,
      operacionOrdenId,
      data,
    }: {
      ordenId: number;
      operacionOrdenId: number;
      data: Partial<OperacionEjecutadaInput>;
    }) => updateOperacion(ordenId, operacionOrdenId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes-procesamiento"] }),
  });
}

export function useRemoveOperacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, operacionOrdenId }: { ordenId: number; operacionOrdenId: number }) =>
      removeOperacion(ordenId, operacionOrdenId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes-procesamiento"] }),
  });
}

export function useAddSalida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, data }: { ordenId: number; data: SalidaInput }) => addSalida(ordenId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes-procesamiento"] }),
  });
}

export function useUpdateSalida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      ordenId,
      salidaId,
      data,
    }: {
      ordenId: number;
      salidaId: number;
      data: Partial<SalidaInput>;
    }) => updateSalida(ordenId, salidaId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes-procesamiento"] }),
  });
}

export function useRemoveSalida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ordenId, salidaId }: { ordenId: number; salidaId: number }) =>
      removeSalida(ordenId, salidaId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes-procesamiento"] }),
  });
}

export function useFinalizarOrden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => finalizarOrden(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes-procesamiento"] }),
  });
}

export function useEncadenarOrden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: OrdenInput }) => encadenarOrden(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ordenes-procesamiento"] }),
  });
}

export type { OrdenInput, SalidaInput, OperacionEjecutadaInput, FormatoSalida };
