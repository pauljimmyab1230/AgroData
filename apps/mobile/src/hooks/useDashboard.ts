import { useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";

export interface Actividad {
  id: number;
  codigo: string;
  tipoActividad: string;
  estado: string;
}

export interface CampaniaActiva {
  id: string;
  nombre: string;
  codigo: string;
  anio_agricola: string;
}

export interface DashboardStats {
  productores: number;
  parcelas: number;
  cultivos: number;
  campanias: number;
  campaniaActiva: CampaniaActiva | null;
  actividadesRecientes: Actividad[];
}

export function useDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setIsLoading(true);
      setError(null);

      const [prodRes, parRes, cultRes, campRes, actRes] = await Promise.allSettled([
        api.get("/productores?limit=1", { signal: controller.signal }),
        api.get("/parcelas?limit=1", { signal: controller.signal }),
        api.get("/cultivos?limit=1", { signal: controller.signal }),
        api.get("/campanias?limit=50", { signal: controller.signal }),
        api.get("/actividades?limit=5&sort=created_at:desc", { signal: controller.signal }),
      ]);

      if (controller.signal.aborted) return;

      const productores = prodRes.status === "fulfilled" ? prodRes.value.data.total ?? 0 : 0;
      const parcelas = parRes.status === "fulfilled" ? parRes.value.data.total ?? 0 : 0;
      const cultivos = cultRes.status === "fulfilled" ? cultRes.value.data.total ?? 0 : 0;

      let campanias = 0;
      let campaniaActiva: CampaniaActiva | null = null;
      if (campRes.status === "fulfilled") {
        const camps = campRes.value.data.data ?? [];
        campanias = campRes.value.data.total ?? camps.length;
        const activa = camps.find((c: any) => c.estado === "ACTIVA");
        if (activa) {
          campaniaActiva = {
            id: String(activa.id),
            nombre: String(activa.nombre),
            codigo: String(activa.codigo),
            anio_agricola: String(activa.anio_agricola),
          };
        }
      }

      const actividadesRecientes = actRes.status === "fulfilled"
        ? (actRes.value.data.data ?? []).map((dto: any) => ({
            id: Number(dto.id),
            codigo: String(dto.codigo),
            tipoActividad: String(dto.tipo_actividad ?? dto.tipoActividad ?? ""),
            estado: String(dto.estado),
          }))
        : [];

      setData({ productores, parcelas, cultivos, campanias, campaniaActiva, actividadesRecientes });
    } catch (err: any) {
      if (!controller.signal.aborted) {
        setError(err?.response?.data?.message || "Error al cargar dashboard");
      }
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
