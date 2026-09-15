import { useQuery } from "@tanstack/react-query";
import { fetchRecepciones, fetchRecepcion, type Recepcion, type RecepcionesResponse } from "../services/recepciones";

export function useRecepciones(params?: {
  search?: string;
  estado?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<RecepcionesResponse>({
    queryKey: ["recepciones", params],
    queryFn: ({ signal }) => fetchRecepciones({ ...params, signal }),
    placeholderData: (prev) => prev,
  });
}

export function useRecepcion(id: number | null) {
  return useQuery<Recepcion>({
    queryKey: ["recepcion", id],
    queryFn: ({ signal }) => fetchRecepcion(id!, signal),
    enabled: id !== null,
  });
}
