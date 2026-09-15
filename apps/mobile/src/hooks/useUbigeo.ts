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

  const loadProvincias = useCallback(async (dpto: string) => {
    if (!dpto) {
      setProvincias([]); setProvincia(""); setDistritos([]); setDistrito(""); return;
    }
    const cached = cache.provincias.get(dpto);
    if (cached) { setProvincias(cached); setProvincia(""); setDistritos([]); setDistrito(""); return; }
    setLoadingProvs(true);
    try {
      const data = await fetchProvincias(dpto);
      cache.provincias.set(dpto, data);
      if (mountedRef.current) { setProvincias(data); setProvincia(""); setDistritos([]); setDistrito(""); }
    } catch (e) { console.error("Error loading provincias:", e); }
    finally { if (mountedRef.current) setLoadingProvs(false); }
  }, []);

  const loadDistritos = useCallback(async (dpto: string, prov: string) => {
    if (!dpto || !prov) { setDistritos([]); setDistrito(""); return; }
    const key = `${dpto}|${prov}`;
    const cached = cache.distritos.get(key);
    if (cached) { setDistritos(cached); setDistrito(""); return; }
    setLoadingDists(true);
    try {
      const data = await fetchDistritos(dpto, prov);
      cache.distritos.set(key, data);
      if (mountedRef.current) { setDistritos(data); setDistrito(""); }
    } catch (e) { console.error("Error loading distritos:", e); }
    finally { if (mountedRef.current) setLoadingDists(false); }
  }, []);

  const onDepartamentoChange = useCallback((value: string) => {
    setDepartamento(value);
    loadProvincias(value);
  }, [loadProvincias]);

  const onProvinciaChange = useCallback((value: string) => {
    setProvincia(value);
    if (departamento) loadDistritos(departamento, value);
  }, [departamento, loadDistritos]);

  const onDistritoChange = useCallback((value: string) => {
    setDistrito(value);
  }, []);

  return {
    departamento, provincia, distrito,
    departamentos, provincias, distritos,
    loadingDeptos, loadingProvs, loadingDists,
    onDepartamentoChange, onProvinciaChange, onDistritoChange,
    setDepartamento, setProvincia, setDistrito,
  };
}
