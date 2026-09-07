import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  fetchProductores,
  fetchProductor,
  createProductor,
  updateProductor,
  deleteProductor,
  fetchFamiliares,
  createFamiliar,
  updateFamiliar,
  deleteFamiliar,
  fetchParcelas,
  createParcela,
  fetchDocumentos,
  createDocumento,
  deleteDocumento,
  fetchComunidades,
  fetchProductorStats,
  type Productor,
  type Familiar,
  type Parcela,
  type Documento,
  type ProductorStats,
} from "../../services/productores";

export function useProductores(filters?: {
  search?: string;
  estado?: string;
  cargo?: string;
  sexo?: string;
  comunidad?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["productores", filters],
    queryFn: () => fetchProductores(filters),
    placeholderData: keepPreviousData,
  });
}

export function useProductor(id: number | null) {
  return useQuery<Productor>({
    queryKey: ["productor", id],
    queryFn: () => fetchProductor(id!),
    enabled: id !== null,
  });
}

export function useCreateProductor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Productor>) => createProductor(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["productores"] });
    },
  });
}

export function useUpdateProductor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Productor> }) =>
      updateProductor(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["productores"] });
      qc.invalidateQueries({ queryKey: ["productor", variables.id] });
    },
  });
}

export function useDeleteProductor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProductor(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["productores"] });
    },
  });
}

export function useFamiliares(productorId: number | null) {
  return useQuery<Familiar[]>({
    queryKey: ["familiares", productorId],
    queryFn: () => fetchFamiliares(productorId!),
    enabled: productorId !== null,
  });
}

export function useCreateFamiliar(productorId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Familiar>) => {
      if (!productorId || productorId <= 0) {
        return Promise.reject(new Error("ID de productor inválido"));
      }
      return createFamiliar(productorId, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["familiares", productorId] });
    },
  });
}

export function useUpdateFamiliar(productorId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ familiarId, data }: { familiarId: number; data: Partial<Familiar> }) =>
      updateFamiliar(productorId, familiarId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["familiares", productorId] });
    },
  });
}

export function useDeleteFamiliar(productorId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (familiarId: number) => deleteFamiliar(productorId, familiarId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["familiares", productorId] });
    },
  });
}

export function useComunidades() {
  return useQuery<string[]>({
    queryKey: ["comunidades"],
    queryFn: fetchComunidades,
    staleTime: 1000 * 60 * 10,
  });
}

export function useProductorStats() {
  return useQuery<ProductorStats>({
    queryKey: ["productorStats"],
    queryFn: fetchProductorStats,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── Parcelas by Productor ───────────────────────────────

export function useParcelasByProductor(productorId: number | null) {
  return useQuery<Parcela[]>({
    queryKey: ["parcelasProductor", productorId],
    queryFn: () => fetchParcelas(productorId!),
    enabled: productorId !== null,
  });
}

// ─── Documentos by Productor ─────────────────────────────

export function useDocumentos(productorId: number | null) {
  return useQuery<Documento[]>({
    queryKey: ["documentos", productorId],
    queryFn: () => fetchDocumentos(productorId!),
    enabled: productorId !== null,
  });
}

export function useCreateDocumento(productorId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { tipo: string; categoria: string; nombre_archivo: string; ruta_archivo: string; tamano_bytes: number; mime_type: string }) =>
      createDocumento(productorId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documentos", productorId] });
    },
  });
}

export function useDeleteDocumento(productorId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (documentoId: number) => deleteDocumento(productorId, documentoId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documentos", productorId] });
    },
  });
}
