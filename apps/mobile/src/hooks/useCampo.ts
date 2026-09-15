import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  fetchParcelas, fetchParcela, fetchParcelaStats, fetchParcelaHistorial,
  fetchParcelaDocumentos, fetchParcelaFotos,
  fetchCampanias, fetchCampania, fetchCultivos, fetchCultivo, fetchCultivoStats,
  type Parcela, type ParcelaStats as ParcelaStatsAPI, type ParcelaHistorial,
  type ParcelaDocumento, type ParcelaFoto,
  type Campania, type Cultivo, type CultivoStats,
} from "../services/campo";

export interface ParcelaStats {
  total: number;
  hectareas: number;
  activas: number;
  conPoligono: number;
}

export function useParcelasStatsFromAPI(filters?: {
  search?: string;
  comunidad?: string;
  cultivo?: string;
  estado?: string;
  productor_id?: number;
}): { data: ParcelaStatsAPI | null; isLoading: boolean; error: string | null } {
  const [data, setData] = useState<ParcelaStatsAPI | null>(null);
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

    fetchParcelaStats(filters, controller.signal)
      .then((r) => { if (mountedRef.current && !controller.signal.aborted) setData(r); })
      .catch((e) => { if (mountedRef.current && !controller.signal.aborted) setError(e?.response?.data?.message || "Error al cargar estadísticas"); })
      .finally(() => { if (mountedRef.current && !controller.signal.aborted) setIsLoading(false); });

    return () => { mountedRef.current = false; controller.abort(); };
  }, [filters?.search, filters?.comunidad, filters?.cultivo, filters?.estado, filters?.productor_id]);

  return { data, isLoading, error };
}

export function useParcelasStatsLocal(parcelas: Parcela[] | undefined): ParcelaStats {
  return useMemo(() => {
    if (!parcelas || parcelas.length === 0) return { total: 0, hectareas: 0, activas: 0, conPoligono: 0 };
    return {
      total: parcelas.length,
      hectareas: parcelas.reduce((sum, p) => sum + (Number(p.area) || 0), 0),
      activas: parcelas.filter((p) => p.estado === "ACTIVA").length,
      conPoligono: parcelas.filter((p) => p.poligono && p.poligono.length >= 3).length,
    };
  }, [parcelas]);
}

export interface CampaniaStats {
  total: number;
  activas: number;
  planificadas: number;
  finalizadas: number;
}

export function useCampaniasStats(campanias: Campania[] | undefined): CampaniaStats {
  return useMemo(() => {
    if (!campanias || campanias.length === 0) return { total: 0, activas: 0, planificadas: 0, finalizadas: 0 };
    return {
      total: campanias.length,
      activas: campanias.filter((c) => c.estado === "ACTIVA").length,
      planificadas: campanias.filter((c) => c.estado === "PLANIFICADA").length,
      finalizadas: campanias.filter((c) => c.estado === "FINALIZADA").length,
    };
  }, [campanias]);
}

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
  const dataRef = useRef<T | null>(null);
  const depsRef = useRef(deps);
  depsRef.current = deps;

  const fetchData = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Only show loading if we have no data yet
    if (!dataRef.current) setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher(controller.signal);
      if (mountedRef.current && !controller.signal.aborted) {
        dataRef.current = result;
        setData(result);
      }
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
    fetchData();
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, [fetchData, ...deps]);

  return { data, isLoading, error, refetch: fetchData };
}

export function useParcelas(filters?: { search?: string; page?: number; limit?: number; estado?: string; productor_id?: number }): FetchResult<{ data: Parcela[]; total: number; totalPages: number }> {
  return useFetch(
    (signal) => fetchParcelas({ ...filters }, signal),
    [filters?.search, filters?.page, filters?.limit, filters?.estado, filters?.productor_id],
  );
}

export function useParcela(id: number | null): FetchResult<Parcela> {
  return useFetch(
    (signal) => fetchParcela(id!, signal),
    [id],
  );
}

export function useParcelaHistorial(id: number | null): FetchResult<ParcelaHistorial[]> {
  return useFetch(
    (signal) => id ? fetchParcelaHistorial(id, signal) : Promise.resolve([]),
    [id],
  );
}

export function useParcelaDocumentos(id: number | null): FetchResult<ParcelaDocumento[]> {
  return useFetch(
    (signal) => id ? fetchParcelaDocumentos(id, signal) : Promise.resolve([]),
    [id],
  );
}

export function useParcelaFotos(id: number | null): FetchResult<ParcelaFoto[]> {
  return useFetch(
    (signal) => id ? fetchParcelaFotos(id, signal) : Promise.resolve([]),
    [id],
  );
}

export function useCampanias(filters?: { search?: string; estado?: string; page?: number; limit?: number }): FetchResult<{ data: Campania[]; total: number; totalPages: number }> {
  return useFetch(
    (signal) => fetchCampanias({ ...filters }, signal),
    [filters?.search, filters?.estado, filters?.page, filters?.limit],
  );
}

export function useCampania(id: number | null): FetchResult<Campania> {
  return useFetch(
    (signal) => fetchCampania(id!, signal),
    [id],
  );
}

export function useCultivos(filters?: { search?: string; page?: number; limit?: number; estado?: string; campania_id?: string }): FetchResult<{ data: Cultivo[]; total: number; totalPages: number }> {
  return useFetch(
    (signal) => fetchCultivos({ ...filters }, signal),
    [filters?.search, filters?.page, filters?.limit, filters?.estado, filters?.campania_id],
  );
}

export function useCultivoStats(filters?: { search?: string; estado?: string; campania_id?: string }): { data: CultivoStats | null; isLoading: boolean; error: string | null } {
  const [data, setData] = useState<CultivoStats | null>(null);
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

    fetchCultivoStats(filters, controller.signal)
      .then((r) => { if (mountedRef.current && !controller.signal.aborted) setData(r); })
      .catch((e) => { if (mountedRef.current && !controller.signal.aborted) setError(e?.response?.data?.message || "Error al cargar estadísticas"); })
      .finally(() => { if (mountedRef.current && !controller.signal.aborted) setIsLoading(false); });

    return () => { mountedRef.current = false; controller.abort(); };
  }, [filters?.search, filters?.estado, filters?.campania_id]);

  return { data, isLoading, error };
}

export function useCultivo(id: number | null): FetchResult<Cultivo> {
  return useFetch(
    (signal) => fetchCultivo(id!, signal),
    [id],
  );
}
