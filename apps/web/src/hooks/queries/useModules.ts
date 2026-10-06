import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import api from "../../services/api";
import { fetchRecepciones, type RecepcionesQuery } from "../../services/recepciones";
import {
  fetchInspecciones,
  fetchInspeccion,
  createInspeccion,
  updateInspeccion,
  type Inspeccion,
  type InspeccionesQuery,
} from "../../services/inspecciones";
import {
  fetchActividades as fetchActividadesService,
  fetchActividad as fetchActividadService,
  createActividad as createActividadService,
  updateActividad as updateActividadService,
  deleteActividad as deleteActividadService,
  type Actividad,
  type ActividadesQuery,
} from "../../services/actividades";

// Re-export Actividad type from canonical source
export type { Actividad } from "../../services/actividades";

export function useActividades(filters?: ActividadesQuery) {
  return useQuery({
    queryKey: ["actividades", filters],
    queryFn: () => fetchActividadesService(filters),
    placeholderData: keepPreviousData,
  });
}

export function useActividad(id: string | null) {
  return useQuery<Actividad>({
    queryKey: ["actividad", id],
    queryFn: () => fetchActividadService(id!),
    enabled: id !== null,
  });
}

export function useCreateActividad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Actividad>) => createActividadService(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["actividades"] }),
  });
}

export function useUpdateActividad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Actividad> }) =>
      updateActividadService(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["actividades"] }),
  });
}

export function useDeleteActividad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteActividadService(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["actividades"] }),
  });
}

// ─── Inspecciones ─────────────────────────────────────────
export function useInspecciones(filters?: InspeccionesQuery) {
  return useQuery({
    queryKey: ["inspecciones", filters],
    queryFn: () => fetchInspecciones(filters),
    placeholderData: keepPreviousData,
  });
}

export function useInspeccion(id: string | undefined) {
  return useQuery({
    queryKey: ["inspecciones", id],
    queryFn: () => fetchInspeccion(id!),
    enabled: Boolean(id),
  });
}

export function useCreateInspeccion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Inspeccion>) => createInspeccion(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inspecciones"] }),
  });
}

export function useUpdateInspeccion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Inspeccion> }) => updateInspeccion(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inspecciones"] }),
  });
}

export function useDeleteInspeccion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/inspecciones/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inspecciones"] }),
  });
}

// ─── Acopios ──────────────────────────────────────────────
export function useAcopios(filters?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["acopios", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined && v !== "") params[k] = String(v);
        });
      }
      const res = await api.get("/acopios", { params });
      return {
        data: res.data.data ?? [],
        total: res.data.total ?? 0,
        page: res.data.page ?? 1,
        limit: res.data.limit ?? 20,
        totalPages: res.data.totalPages ?? 1,
      };
    },
    placeholderData: keepPreviousData,
  });
}

export function useDeleteAcopio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/acopios/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["acopios"] }),
  });
}

// ─── Recepciones ──────────────────────────────────────────
export function useRecepciones(filters?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["recepciones", filters],
    queryFn: async () => {
      const params: RecepcionesQuery = {};
      if (filters) {
        if (filters.search) params.search = String(filters.search);
        if (filters.estado) params.estado = String(filters.estado);
        if (filters.page) params.page = Number(filters.page);
        if (filters.limit) params.limit = Number(filters.limit);
      }
      return fetchRecepciones(params);
    },
    placeholderData: keepPreviousData,
  });
}

export function useDeleteRecepcion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/recepciones/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recepciones"] }),
  });
}

// ─── Procesamientos ───────────────────────────────────────
export function useProcesamientos(filters?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["procesamientos", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined && v !== "") params[k] = String(v);
        });
      }
      const res = await api.get("/procesamientos", { params });
      return {
        data: res.data.data ?? [],
        total: res.data.total ?? 0,
        page: res.data.page ?? 1,
        limit: res.data.limit ?? 20,
        totalPages: res.data.totalPages ?? 1,
      };
    },
    placeholderData: keepPreviousData,
  });
}

export function useDeleteProcesamiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/procesamientos/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["procesamientos"] }),
  });
}

// ─── Lotes ────────────────────────────────────────────────
export function useLotes(filters?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["lotes", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined && v !== "") params[k] = String(v);
        });
      }
      const res = await api.get("/lotes", { params });
      return {
        data: res.data.data ?? [],
        total: res.data.total ?? 0,
        page: res.data.page ?? 1,
        limit: res.data.limit ?? 20,
        totalPages: res.data.totalPages ?? 1,
      };
    },
    placeholderData: keepPreviousData,
  });
}

export function useDeleteLote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/lotes/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lotes"] }),
  });
}

// ─── Inventario ───────────────────────────────────────────
export function useInventario(filters?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["inventario", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined && v !== "") params[k] = String(v);
        });
      }
      const res = await api.get("/inventario", { params });
      return {
        data: res.data.data ?? [],
        total: res.data.total ?? 0,
        page: res.data.page ?? 1,
        limit: res.data.limit ?? 20,
        totalPages: res.data.totalPages ?? 1,
      };
    },
    placeholderData: keepPreviousData,
  });
}

export function useDeleteInventario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/inventario/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inventario"] }),
  });
}

// ─── Usuarios ─────────────────────────────────────────────
export function useUsuarios(filters?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["usuarios", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined && v !== "") params[k] = String(v);
        });
      }
      const res = await api.get("/usuarios", { params });
      return {
        data: res.data.data ?? [],
        total: res.data.total ?? 0,
        page: res.data.page ?? 1,
        limit: res.data.limit ?? 20,
        totalPages: res.data.totalPages ?? 1,
      };
    },
    placeholderData: keepPreviousData,
  });
}

export function useDeleteUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/usuarios/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

// ─── Dashboard ────────────────────────────────────────────
export interface DashboardStats {
  productores: number;
  parcelas: number;
  cultivos: number;
  campanias: number;
  campaniaActiva: { id: string; nombre: string; codigo: string; anio_agricola: string } | null;
  actividadesRecientes: Actividad[];
}

export function useDashboard() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [prodRes, parRes, cultRes, campRes, actRes] = await Promise.allSettled([
        api.get("/productores?limit=1"),
        api.get("/parcelas?limit=1"),
        api.get("/cultivos?limit=1"),
        api.get("/campanias?limit=50"),
        api.get("/actividades?limit=5&sort=created_at:desc"),
      ]);

      const productores = prodRes.status === "fulfilled" ? prodRes.value.data.total ?? 0 : 0;
      const parcelas = parRes.status === "fulfilled" ? parRes.value.data.total ?? 0 : 0;
      const cultivos = cultRes.status === "fulfilled" ? cultRes.value.data.total ?? 0 : 0;

      let campanias = 0;
      let campaniaActiva: DashboardStats["campaniaActiva"] = null;
      if (campRes.status === "fulfilled") {
        const camps = campRes.value.data.data ?? [];
        campanias = campRes.value.data.total ?? camps.length;
        campaniaActiva = camps.find((c: Record<string, unknown>) => c.estado === "ACTIVA") ?? null;
        if (campaniaActiva) {
          campaniaActiva = {
            id: String(campaniaActiva.id),
            nombre: String(campaniaActiva.nombre),
            codigo: String(campaniaActiva.codigo),
            anio_agricola: String(campaniaActiva.anio_agricola),
          };
        }
      }

      const actividadesRecientes = actRes.status === "fulfilled"
        ? (actRes.value.data.data ?? []).map((dto: Record<string, unknown>) => {
            const d = dto as Record<string, string | number | boolean | null>;
            const cultivo = d.cultivo as { cultivo?: string; codigo?: string; parcela?: { id?: number; nombre?: string; codigo?: string } } | null;
            return {
              id: Number(d.id),
              codigo: String(d.codigo),
              cultivoId: Number(d.cultivo_id),
              cultivoNombre: cultivo?.cultivo ?? "",
              cultivoCodigo: cultivo?.codigo ?? "",
              parcelaId: cultivo?.parcela?.id ?? 0,
              parcelaNombre: cultivo?.parcela?.nombre ?? "",
              parcelaCodigo: cultivo?.parcela?.codigo ?? "",
              fecha: String(d.fecha ?? "").split("T")[0],
              tipoActividad: String(d.tipo_actividad),
              descripcion: String(d.descripcion ?? ""),
              responsableTecnico: String(d.responsable_tecnico),
              horaInicio: String(d.hora_inicio ?? ""),
              horaFin: String(d.hora_fin ?? ""),
              duracionEstimada: String(d.duracion_estimada ?? ""),
              prioridad: String(d.prioridad),
              estado: String(d.estado),
              jornales: Number(d.jornales ?? 0),
              latitud: String(d.latitud ?? ""),
              longitud: String(d.longitud ?? ""),
              altitud: String(d.altitud ?? ""),
              precisionGps: String(d.precision_gps ?? ""),
              observacionesTecnicas: String(d.observaciones_tecnicas ?? ""),
              recomendaciones: String(d.recomendaciones ?? ""),
              objetivo: String(d.objetivo ?? ""),
              resultado: String(d.resultado ?? ""),
              proximaActividad: String(d.proxima_actividad ?? ""),
              insumos: [],
              manoObra: [],
              maquinaria: [],
              createdAt: String(d.created_at),
              updatedAt: String(d.updated_at),
            };
          })
        : [];

      return { productores, parcelas, cultivos, campanias, campaniaActiva, actividadesRecientes };
    },
    staleTime: 1000 * 60 * 3,
  });
}
