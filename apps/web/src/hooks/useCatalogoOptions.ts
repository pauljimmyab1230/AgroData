import { useState, useEffect } from "react";
import { fetchCatalogoActivos } from "../services/catalogos";

type CatalogoOption = { value: string; label: string };

export function useCatalogoOptions(tipo: string): { options: CatalogoOption[]; loading: boolean } {
  const [options, setOptions] = useState<CatalogoOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCatalogoActivos(tipo)
      .then((items) => setOptions(items.map((i) => ({ value: i.nombre, label: i.nombre }))))
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, [tipo]);

  return { options, loading };
}
