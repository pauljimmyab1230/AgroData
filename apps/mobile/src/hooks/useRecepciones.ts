import { useQuery } from "@tanstack/react-query";
import { fetchRecepciones, fetchRecepcion, type Recepcion, type RecepcionesResponse } from "../services/recepciones";
import { useAcumulado } from "./acumularLista";

export function useRecepciones(params?: {
  search?: string;
  estado?: string;
  page?: number;
  limit?: number;
}) {
  const pagina = params?.page ?? 1;
  const clave = JSON.stringify([params?.search, params?.estado, params?.limit]);
  const acumular = useAcumulado<Recepcion>();
  const consulta = useQuery<RecepcionesResponse>({
    queryKey: ["recepciones", "lista", params],
    queryFn: ({ signal }) => fetchRecepciones({ ...params, signal }),
    placeholderData: (prev) => prev,
  });
  const items = acumular(clave, pagina, consulta.data?.data);
  return {
    ...consulta,
    data: consulta.data ? { ...consulta.data, data: items } : undefined,
  };
}

export function useRecepcion(id: number | null) {
  return useQuery<Recepcion>({
    queryKey: ["recepciones", "detalle", id],
    queryFn: ({ signal }) => fetchRecepcion(id!, signal),
    enabled: id !== null,
  });
}
