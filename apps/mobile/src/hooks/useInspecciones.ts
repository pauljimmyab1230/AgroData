import { useState, useEffect, useRef } from "react";
import {
  fetchInspecciones,
  fetchInspeccion,
  fetchInspeccionStats,
  type Inspeccion,
  type InspeccionStats,
} from "../services/inspecciones";

interface FetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

function useFetch<T>(fetcher: (signal: AbortSignal) => Promise<T>, deps: unknown[]): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const depsRef = useRef(deps);
  depsRef.current = deps;

  const fetchData = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher(controller.signal);
      if (mountedRef.current && !controller.signal.aborted) setData(result);
    } catch (err: unknown) {
      if (mountedRef.current && !controller.signal.aborted) {
        const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
        setError(axiosErr?.response?.data?.message || axiosErr?.message || "Error al cargar datos");
      }
    } finally {
      if (mountedRef.current && !controller.signal.aborted) setIsLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, deps);

  return { data, isLoading, error, refetch: fetchData };
}

export function useInspecciones(filters?: {
  search?: string;
  estado?: string;
  cultivo_id?: number;
  page?: number;
  limit?: number;
}): FetchResult<{ data: Inspeccion[]; total: number; totalPages: number }> {
  return useFetch(
    (signal) => fetchInspecciones({ ...filters }, signal),
    [filters?.search, filters?.estado, filters?.cultivo_id, filters?.page, filters?.limit],
  );
}

export function useInspeccion(id: number | null): FetchResult<Inspeccion> {
  return useFetch(
    (signal) => fetchInspeccion(id!, signal),
    [id],
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
