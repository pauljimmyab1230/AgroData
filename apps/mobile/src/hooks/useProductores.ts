import { useState, useEffect, useCallback, useRef } from "react";
import { fetchProductores, fetchProductor, fetchProductorStats, type Productor, type ProductorStats } from "../services/productores";

export function useProductores(filters?: { search?: string; estado?: string; page?: number; limit?: number }) {
  const [data, setData] = useState<{ data: Productor[]; total: number; totalPages: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async (isSearch = false) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      if (isSearch) {
        setIsSearching(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      const result = await fetchProductores(filters);
      if (!controller.signal.aborted) {
        setData(result);
      }
    } catch (err: any) {
      if (!controller.signal.aborted) {
        setError(err?.response?.data?.message || "Error al cargar productores");
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
        setIsSearching(false);
      }
    }
  }, [filters?.search, filters?.estado, filters?.page, filters?.limit]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const isSearchChange = filters?.search !== undefined;
    const delay = isSearchChange ? 400 : 0;

    debounceRef.current = setTimeout(() => {
      fetchData(isSearchChange);
    }, delay);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      abortRef.current?.abort();
    };
  }, [fetchData]);

  return { data, isLoading, isSearching, error, refetch: fetchData };
}

export function useProductor(id: number | null) {
  const [data, setData] = useState<Productor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setIsLoading(false); return; }
    const controller = new AbortController();
    (async () => {
      try {
        setIsLoading(true);
        const result = await fetchProductor(id);
        if (!controller.signal.aborted) setData(result);
      } catch (err: any) {
        if (!controller.signal.aborted) setError(err?.response?.data?.message || "Error");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    })();
    return () => controller.abort();
  }, [id]);

  return { data, isLoading, error };
}

export function useProductorStats() {
  const [data, setData] = useState<ProductorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const result = await fetchProductorStats();
        if (!controller.signal.aborted) setData(result);
      } catch (err: any) {
        if (!controller.signal.aborted) setError(err?.message || "Error");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  return { data, isLoading, error };
}
