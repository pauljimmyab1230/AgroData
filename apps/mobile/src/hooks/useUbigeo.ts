import { useState, useEffect, useCallback, useRef } from "react";
import { fetchDepartamentos, fetchProvincias, fetchDistritos } from "../services/ubigeo";

interface DistritoItem { distrito: string; ubigeo: string; }

const cache = {
  departamentos: null as string[] | null,
  provincias: new Map<string, string[]>(),
  distritos: new Map<string, DistritoItem[]>(),
};

export function useUbigeo(options?: { dept?: string; prov?: string; dist?: string }) {
  const [departamento, setDepartamento] = useState(options?.dept ?? "");
  const [provincia, setProvincia] = useState(options?.prov ?? "");
  const [distrito, setDistrito] = useState(options?.dist ?? "");

  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);
  const [distritos, setDistritos] = useState<DistritoItem[]>([]);

  const [loadingDeptos, setLoadingDeptos] = useState(false);
  const [loadingProvs, setLoadingProvs] = useState(false);
  const [loadingDists, setLoadingDists] = useState(false);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Cargar departamentos al montar
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cache.departamentos) {
        if (!cancelled) setDepartamentos(cache.departamentos);
      } else {
        setLoadingDeptos(true);
        try {
          const data = await fetchDepartamentos();
          cache.departamentos = data;
          if (!cancelled) setDepartamentos(data);
        } catch (e) { console.error("Error loading departamentos:", e); }
        finally { if (!cancelled) setLoadingDeptos(false); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const obtenerProvincias = useCallback(async (dpto: string): Promise<string[]> => {
    if (!dpto) return [];
    const cached = cache.provincias.get(dpto);
    if (cached) return cached;
    setLoadingProvs(true);
    try {
      const data = await fetchProvincias(dpto);
      cache.provincias.set(dpto, data);
      return data;
    } catch (e) { console.error("Error loading provincias:", e); return []; }
    finally { if (mountedRef.current) setLoadingProvs(false); }
  }, []);

  const obtenerDistritos = useCallback(async (dpto: string, prov: string): Promise<DistritoItem[]> => {
    if (!dpto || !prov) return [];
    const key = `${dpto}|${prov}`;
    const cached = cache.distritos.get(key);
    if (cached) return cached;
    setLoadingDists(true);
    try {
      const data = await fetchDistritos(dpto, prov);
      cache.distritos.set(key, data);
      return data;
    } catch (e) { console.error("Error loading distritos:", e); return []; }
    finally { if (mountedRef.current) setLoadingDists(false); }
  }, []);

  const onDepartamentoChange = useCallback((value: string) => {
    setDepartamento(value);
    setProvincia(""); setDistrito(""); setProvincias([]); setDistritos([]);
    if (value) {
      obtenerProvincias(value).then((data) => { if (mountedRef.current) setProvincias(data); });
    }
  }, [obtenerProvincias]);

  const onProvinciaChange = useCallback((value: string) => {
    setProvincia(value);
    setDistrito(""); setDistritos([]);
    if (departamento && value) {
      obtenerDistritos(departamento, value).then((data) => { if (mountedRef.current) setDistritos(data); });
    }
  }, [departamento, obtenerDistritos]);

  const onDistritoChange = useCallback((value: string) => {
    setDistrito(value);
  }, []);

  // Precarga una selección existente (edición) manteniendo los valores y
  // cargando las listas hijas que correspondan.
  const precargar = useCallback((dpto: string, prov: string, dist: string) => {
    setDepartamento(dpto);
    setProvincia(prov);
    setDistrito(dist);
    if (!dpto) return;
    obtenerProvincias(dpto).then((data) => {
      if (!mountedRef.current) return;
      setProvincias(data);
      if (prov) {
        obtenerDistritos(dpto, prov).then((dists) => {
          if (!mountedRef.current) return;
          setDistritos(dists);
        });
      }
    });
  }, [obtenerProvincias, obtenerDistritos]);

  return {
    departamento, provincia, distrito,
    departamentos, provincias, distritos,
    loadingDeptos, loadingProvs, loadingDists,
    onDepartamentoChange, onProvinciaChange, onDistritoChange,
    precargar,
  };
}
