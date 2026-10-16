import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchInspecciones,
  fetchInspeccion,
  fetchInspeccionStats,
  type Inspeccion,
  type InspeccionStats,
} from "../services/inspecciones";
import { useAcumulado } from "./acumularLista";

interface FetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

function useFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
  opciones?: { habilitado?: boolean },
): FetchResult<T> {
  const habilitado = opciones?.habilitado !== false;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(habilitado);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const fetchData = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcherRef.current(controller.signal);
      if (mountedRef.current && !controller.signal.aborted) setData(result);
    } catch (err: unknown) {
      if (mountedRef.current && !controller.signal.aborted) {
        const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
        setError(axiosErr?.response?.data?.message || axiosErr?.message || "Error al cargar datos");
      }
    } finally {
      if (mountedRef.current && !controller.signal.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (habilitado) {
      fetchData();
    } else {
      abortRef.current?.abort();
      setData(null);
      setIsLoading(false);
    }
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, [fetchData, habilitado, ...deps]);

  return { data, isLoading, error, refetch: fetchData };
}

export function useInspecciones(filters?: {
  search?: string;
  estado?: string;
  cultivo_id?: number;
  page?: number;
  limit?: number;
}): FetchResult<{ data: Inspeccion[]; total: number; totalPages: number }> {
  const pagina = filters?.page ?? 1;
  const clave = JSON.stringify([filters?.search, filters?.estado, filters?.cultivo_id, filters?.limit]);
  const acumular = useAcumulado<Inspeccion>();
  const resultado = useFetch(
    (signal) => fetchInspecciones({ ...filters }, signal),
    [clave, pagina],
  );
  const items = acumular(clave, pagina, resultado.data?.data);
  return { ...resultado, data: resultado.data ? { ...resultado.data, data: items } : null };
}

export function useInspeccion(id: number | null): FetchResult<Inspeccion> {
  return useFetch(
    (signal) => fetchInspeccion(id!, signal),
    [id],
    { habilitado: id !== null },
  );
}

export function useInspeccionStats(filters?: {
  search?: string;
  estado?: string;
  cultivo_id?: number;
}): { data: InspeccionStats | null; isLoading: boolean; error: string | null } {
  const [data, setData] = useState<InspeccionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setError(null);

    fetchInspeccionStats(filters, controller.signal)
      .then((r) => { if (mountedRef.current && !controller.signal.aborted) setData(r); })
      .catch((e) => { if (mountedRef.current && !controller.signal.aborted) setError(e?.response?.data?.message || "Error al cargar estadísticas"); })
      .finally(() => { if (mountedRef.current && !controller.signal.aborted) setIsLoading(false); });

    return () => { mountedRef.current = false; controller.abort(); };
  }, [filters?.search, filters?.estado, filters?.cultivo_id]);

  return { data, isLoading, error };
}
