import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchDepartamentos,
  fetchProvincias,
  fetchDistritos,
} from "../services/ubigeo";

interface DistritoItem {
  distrito: string;
  ubigeo: string;
}

const cache = {
  departamentos: null as string[] | null,
  provincias: new Map<string, string[]>(),
  distritos: new Map<string, DistritoItem[]>(),
};

export interface UseUbigeoOptions {
  initialDepartamento?: string;
  initialProvincia?: string;
  initialDistrito?: string;
  initialUbigeo?: string;
}

export function useUbigeo(options?: UseUbigeoOptions) {
  const [departamento, setDepartamento] = useState(options?.initialDepartamento ?? "");
  const [provincia, setProvincia] = useState(options?.initialProvincia ?? "");
  const [distrito, setDistrito] = useState(options?.initialDistrito ?? "");
  const [ubigeoSeleccionado, setUbigeoSeleccionado] = useState(options?.initialUbigeo ?? "");

  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);
  const [distritos, setDistritos] = useState<DistritoItem[]>([]);

  const [loadingDeptos, setLoadingDeptos] = useState(false);
  const [loadingProvs, setLoadingProvs] = useState(false);
  const [loadingDists, setLoadingDists] = useState(false);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (cache.departamentos) {
        if (!cancelled) setDepartamentos(cache.departamentos);
      } else {
        setLoadingDeptos(true);
        try {
          const data = await fetchDepartamentos();
          cache.departamentos = data;
          if (!cancelled) setDepartamentos(data);
        } catch (e) {
          console.error("Error fetching departamentos:", e);
        } finally {
          if (!cancelled) setLoadingDeptos(false);
        }
      }

      const dpto = options?.initialDepartamento;
      const prov = options?.initialProvincia;

      if (dpto) {
        setLoadingProvs(true);
        try {
          let provData = cache.provincias.get(dpto);
          if (!provData) {
            provData = await fetchProvincias(dpto);
            cache.provincias.set(dpto, provData);
          }
          if (!cancelled) setProvincias(provData);
        } catch (e) {
          console.error("Error fetching provincias:", e);
        } finally {
          if (!cancelled) setLoadingProvs(false);
        }
      }

      if (dpto && prov) {
        setLoadingDists(true);
        try {
          const key = `${dpto}|${prov}`;
          let distData = cache.distritos.get(key);
          if (!distData) {
            distData = await fetchDistritos(dpto, prov);
            cache.distritos.set(key, distData);
          }
          if (!cancelled) setDistritos(distData);
        } catch (e) {
          console.error("Error fetching distritos:", e);
        } finally {
          if (!cancelled) setLoadingDists(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const loadProvincias = useCallback(async (dpto: string) => {
    if (!dpto) {
      setProvincias([]);
      setProvincia("");
      setDistritos([]);
      setDistrito("");
      setUbigeoSeleccionado("");
      return;
    }

    const cached = cache.provincias.get(dpto);
    if (cached) {
      setProvincias(cached);
      setProvincia("");
      setDistritos([]);
      setDistrito("");
      setUbigeoSeleccionado("");
      return;
    }

    setLoadingProvs(true);
    try {
      const data = await fetchProvincias(dpto);
      cache.provincias.set(dpto, data);
      if (mountedRef.current) {
        setProvincias(data);
        setProvincia("");
        setDistritos([]);
        setDistrito("");
        setUbigeoSeleccionado("");
      }
    } catch (e) {
      console.error("Error fetching provincias:", e);
    } finally {
      if (mountedRef.current) setLoadingProvs(false);
    }
  }, []);

  const loadDistritos = useCallback(async (dpto: string, prov: string) => {
    if (!dpto || !prov) {
      setDistritos([]);
      setDistrito("");
      setUbigeoSeleccionado("");
      return;
    }

    const key = `${dpto}|${prov}`;
    const cached = cache.distritos.get(key);
    if (cached) {
      setDistritos(cached);
      setDistrito("");
      setUbigeoSeleccionado("");
      return;
    }

    setLoadingDists(true);
    try {
      const data = await fetchDistritos(dpto, prov);
      cache.distritos.set(key, data);
      if (mountedRef.current) {
        setDistritos(data);
        setDistrito("");
        setUbigeoSeleccionado("");
      }
    } catch (e) {
      console.error("Error fetching distritos:", e);
    } finally {
      if (mountedRef.current) setLoadingDists(false);
    }
  }, []);

  const onDepartamentoChange = useCallback(
    (value: string) => {
      setDepartamento(value);
      loadProvincias(value);
    },
    [loadProvincias]
  );

  const onProvinciaChange = useCallback(
    (value: string) => {
      setProvincia(value);
      if (departamento) {
        loadDistritos(departamento, value);
      }
    },
    [departamento, loadDistritos]
  );

  const onDistritoChange = useCallback(
    (value: string) => {
      setDistrito(value);
      const found = distritos.find((d) => d.distrito === value);
      setUbigeoSeleccionado(found?.ubigeo ?? "");
    },
    [distritos]
  );

  const syncValues = useCallback(
    async (dept: string, prov: string, dist: string, ubigeoCode?: string) => {
      if (!dept) return;

      setDepartamento(dept);

      setLoadingProvs(true);
      try {
        let provData = cache.provincias.get(dept);
        if (!provData) {
          provData = await fetchProvincias(dept);
          cache.provincias.set(dept, provData);
        }
        if (mountedRef.current) setProvincias(provData);
      } catch (e) {
        console.error("Error fetching provincias:", e);
      } finally {
        if (mountedRef.current) setLoadingProvs(false);
      }

      if (prov) {
        setProvincia(prov);

        setLoadingDists(true);
        try {
          const key = `${dept}|${prov}`;
          let distData = cache.distritos.get(key);
          if (!distData) {
            distData = await fetchDistritos(dept, prov);
            cache.distritos.set(key, distData);
          }
          if (mountedRef.current) setDistritos(distData);

          if (dist) {
            setDistrito(dist);
            const found = distData?.find((d) => d.distrito === dist);
            setUbigeoSeleccionado(ubigeoCode ?? found?.ubigeo ?? "");
          }
        } catch (e) {
          console.error("Error fetching distritos:", e);
        } finally {
          if (mountedRef.current) setLoadingDists(false);
        }
      }
    },
    []
  );

  const departamentoOptions = departamentos.map((d) => ({ value: d, label: d }));
  const provinciaOptions = provincias.map((p) => ({ value: p, label: p }));
  const distritoOptions = distritos.map((d) => ({ value: d.distrito, label: d.distrito }));

  return {
    departamento,
    provincia,
    distrito,
    ubigeoSeleccionado,
    departamentoOptions,
    provinciaOptions,
    distritoOptions,
    loadingDeptos,
    loadingProvs,
    loadingDists,
    onDepartamentoChange,
    onProvinciaChange,
    onDistritoChange,
    syncValues,
    setDepartamento,
    setProvincia,
    setDistrito,
    setUbigeoSeleccionado,
  };
}
