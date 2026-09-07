import { useQuery } from "@tanstack/react-query";
import { fetchCatalogoActivos } from "../services/catalogos";

type CatalogoOption = { value: string; label: string };

export function useCatalogoOptions(tipo: string): { options: CatalogoOption[]; loading: boolean } {
  const { data, isLoading } = useQuery<CatalogoOption[]>({
    queryKey: ["catalogoOptions", tipo],
    queryFn: async () => {
      const items = await fetchCatalogoActivos(tipo);
      return items.map((i) => ({ value: i.nombre, label: i.nombre }));
    },
    staleTime: 1000 * 60 * 10,
    enabled: !!tipo,
  });

  return { options: data ?? [], loading: isLoading };
}
