import { useRef } from "react";

interface EstadoAcumulado<T> {
  clave: string;
  items: T[];
}

/**
 * Acumula los ítems de páginas sucesivas de una lista paginada.
 * - Página 1 (o cambio de filtros) reemplaza el acumulado.
 * - Páginas siguientes se fusionan sin duplicar (gana el ítem más reciente).
 */
export function useAcumulado<T extends { id: number | string }>() {
  const estado = useRef<EstadoAcumulado<T>>({ clave: "", items: [] });

  return (clave: string, pagina: number, items: T[] | undefined): T[] => {
    if (!items) {
      return estado.current.clave === clave ? estado.current.items : [];
    }
    const mismoContexto = estado.current.clave === clave;
    if (pagina > 1 && mismoContexto) {
      const mapa = new Map<T["id"], T>(estado.current.items.map((i) => [i.id, i]));
      for (const item of items) mapa.set(item.id, item);
      estado.current = { clave, items: [...mapa.values()] };
    } else {
      estado.current = { clave, items: [...items] };
    }
    return estado.current.items;
  };
}
