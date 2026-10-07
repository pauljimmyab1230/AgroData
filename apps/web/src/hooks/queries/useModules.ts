import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  fetchActividades as fetchActividadesService,
  fetchActividad as fetchActividadService,
  createActividad as createActividadService,
  updateActividad as updateActividadService,
  deleteActividad as deleteActividadService,
  type Actividad,
  type ActividadesQuery,
} from "../../services/actividades";
import {
  fetchInspecciones,
  fetchInspeccion,
  createInspeccion,
  updateInspeccion,
  deleteInspeccion,
  type Inspeccion,
  type InspeccionesQuery,
} from "../../services/inspecciones";
import {
  fetchAcopios,
  fetchAcopio,
  createAcopio,
  updateAcopio,
  deleteAcopio,
  fetchAcopioStats,
  type Acopio,
  type AcopiosQuery,
} from "../../services/acopios";
import {
  fetchRecepciones,
  fetchRecepcion,
  createRecepcion,
  updateRecepcion,
  deleteRecepcion,
  fetchRecepcionStats,
  type Recepcion,
  type RecepcionesQuery,
  type RecepcionStats,
} from "../../services/recepciones";
import {
  fetchProcesamientos,
  fetchProcesamiento,
  createProcesamiento,
  updateProcesamiento,
  deleteProcesamiento,
  type OrdenProcesamiento,
  type ProcesamientosQuery,
} from "../../services/procesamientos";

export type { Actividad } from "../../services/actividades";

// Convención de query keys:
//   ["recurso", "lista", filtros]  → listados paginados
//   ["recurso", "detalle", id]     → detalle individual
//   ["recurso", "stats"]           → estadísticas
// Invalidar ["recurso"] cubre lista + detalle + stats de una sola vez.

// ===================== Actividades =====================
export function useActividades(filters?: ActividadesQuery) {
  return useQuery({
    queryKey: ["actividades", "lista", filters],
    queryFn: () => fetchActividadesService(filters),
    placeholderData: keepPreviousData,
  });
}

export function useActividad(id: string | number | null | undefined) {
  return useQuery<Actividad>({
    queryKey: ["actividades", "detalle", id],
    queryFn: () => fetchActividadService(id!),
    enabled: id != null && id !== "",
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
    mutationFn: ({ id, data }: { id: string | number; data: Partial<Actividad> }) =>
      updateActividadService(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["actividades"] }),
  });
}

export function useDeleteActividad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteActividadService(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["actividades"] }),
  });
}

// ===================== Inspecciones =====================
export function useInspecciones(filters?: InspeccionesQuery) {
  return useQuery({
    queryKey: ["inspecciones", "lista", filters],
    queryFn: () => fetchInspecciones(filters),
    placeholderData: keepPreviousData,
  });
}

export function useInspeccion(id: string | number | null | undefined) {
  return useQuery<Inspeccion>({
    queryKey: ["inspecciones", "detalle", id],
    queryFn: () => fetchInspeccion(String(id)),
    enabled: id != null && id !== "",
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
    mutationFn: ({ id, data }: { id: string | number; data: Partial<Inspeccion> }) =>
      updateInspeccion(String(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inspecciones"] }),
  });
}

export function useDeleteInspeccion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteInspeccion(String(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inspecciones"] }),
  });
}

// ===================== Acopios =====================
export function useAcopios(filters?: AcopiosQuery) {
  return useQuery({
    queryKey: ["acopios", "lista", filters],
    queryFn: () => fetchAcopios(filters),
    placeholderData: keepPreviousData,
  });
}

export function useAcopio(id: string | number | null | undefined) {
  return useQuery<Acopio>({
    queryKey: ["acopios", "detalle", id],
    queryFn: () => fetchAcopio(String(id)),
    enabled: id != null && id !== "",
  });
}

export function useAcopioStats() {
  return useQuery({
    queryKey: ["acopios", "stats"],
    queryFn: fetchAcopioStats,
    staleTime: 60_000,
  });
}

export function useCreateAcopio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Acopio>) => createAcopio(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["acopios"] }),
  });
}

export function useUpdateAcopio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<Acopio> }) =>
      updateAcopio(String(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["acopios"] }),
  });
}

export function useDeleteAcopio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteAcopio(String(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["acopios"] }),
  });
}

// ===================== Recepciones =====================
export function useRecepciones(filters?: RecepcionesQuery) {
  return useQuery({
    queryKey: ["recepciones", "lista", filters],
    queryFn: () => fetchRecepciones(filters),
    placeholderData: keepPreviousData,
  });
}

export function useRecepcion(id: string | number | null | undefined) {
  return useQuery<Recepcion>({
    queryKey: ["recepciones", "detalle", id],
    queryFn: () => fetchRecepcion(id!),
    enabled: id != null && id !== "",
  });
}

export function useRecepcionStats() {
  return useQuery<RecepcionStats>({
    queryKey: ["recepciones", "stats"],
    queryFn: fetchRecepcionStats,
    staleTime: 60_000,
  });
}

export function useCreateRecepcion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Recepcion>) => createRecepcion(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recepciones"] }),
  });
}

export function useUpdateRecepcion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<Recepcion> }) =>
      updateRecepcion(String(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recepciones"] }),
  });
}

export function useDeleteRecepcion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteRecepcion(String(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recepciones"] }),
  });
}

// ===================== Procesamientos =====================
export function useProcesamientos(filters?: ProcesamientosQuery) {
  return useQuery({
    queryKey: ["procesamientos", "lista", filters],
    queryFn: () => fetchProcesamientos(filters),
    placeholderData: keepPreviousData,
  });
}

export function useProcesamiento(id: string | number | null | undefined) {
  return useQuery<OrdenProcesamiento>({
    queryKey: ["procesamientos", "detalle", id],
    queryFn: () => fetchProcesamiento(String(id)),
    enabled: id != null && id !== "",
  });
}

export function useCreateProcesamiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<OrdenProcesamiento>) => createProcesamiento(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["procesamientos"] }),
  });
}

export function useUpdateProcesamiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<OrdenProcesamiento> }) =>
      updateProcesamiento(String(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["procesamientos"] }),
  });
}

export function useDeleteProcesamiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteProcesamiento(String(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["procesamientos"] }),
  });
}

// ===================== Dashboard =====================
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
        fetch("/api/productores?limit=1").then((r) => r.json()),
        fetch("/api/parcelas?limit=1").then((r) => r.json()),
        fetch("/api/cultivos?limit=1").then((r) => r.json()),
        fetch("/api/campanias?limit=50").then((r) => r.json()),
        fetch("/api/actividades?limit=5").then((r) => r.json()),
      ]);

      const productores = prodRes.status === "fulfilled" ? prodRes.value.total ?? 0 : 0;
      const parcelas = parRes.status === "fulfilled" ? parRes.value.total ?? 0 : 0;
      const cultivos = cultRes.status === "fulfilled" ? cultRes.value.total ?? 0 : 0;

      let campanias = 0;
      let campaniaActiva: DashboardStats["campaniaActiva"] = null;
      if (campRes.status === "fulfilled") {
        const camps = campRes.value.data ?? [];
        campanias = campRes.value.total ?? camps.length;
        const activa = camps.find((c: Record<string, unknown>) => c.estado === "ACTIVA");
        if (activa) {
          campaniaActiva = {
            id: String(activa.id),
            nombre: String(activa.nombre),
            codigo: String(activa.codigo),
            anio_agricola: String(activa.anio_agricola),
          };
        }
      }

      const actividadesRecientes: Actividad[] =
        actRes.status === "fulfilled"
          ? (actRes.value.data ?? []).map((dto: Record<string, unknown>) => {
              const cultivo = dto.cultivo as
                | { cultivo?: string; codigo?: string; parcela?: { id?: number; nombre?: string; codigo?: string } }
                | null;
              return {
                id: Number(dto.id),
                codigo: String(dto.codigo),
                cultivoId: Number(dto.cultivo_id),
                cultivoNombre: cultivo?.cultivo ?? "",
                cultivoCodigo: cultivo?.codigo ?? "",
                parcelaId: cultivo?.parcela?.id ?? 0,
                parcelaNombre: cultivo?.parcela?.nombre ?? "",
                parcelaCodigo: cultivo?.parcela?.codigo ?? "",
                productorNombre: "",
                fecha: String(dto.fecha ?? "").split("T")[0],
                tipoActividad: String(dto.tipo_actividad),
                descripcion: String(dto.descripcion ?? ""),
                responsableTecnico: String(dto.responsable_tecnico),
                horaInicio: String(dto.hora_inicio ?? ""),
                horaFin: String(dto.hora_fin ?? ""),
                duracionEstimada: String(dto.duracion_estimada ?? ""),
                prioridad: String(dto.prioridad),
                estado: String(dto.estado),
                jornales: Number(dto.jornales) || 0,
                latitud: String(dto.latitud ?? ""),
                longitud: String(dto.longitud ?? ""),
                altitud: String(dto.altitud ?? ""),
                precisionGps: String(dto.precision_gps ?? ""),
                observacionesTecnicas: String(dto.observaciones_tecnicas ?? ""),
                recomendaciones: String(dto.recomendaciones ?? ""),
                objetivo: String(dto.objetivo ?? ""),
                resultado: String(dto.resultado ?? ""),
                proximaActividad: String(dto.proxima_actividad ?? ""),
                insumos: [],
                manoObra: [],
                maquinaria: [],
                createdAt: String(dto.created_at ?? ""),
                updatedAt: String(dto.updated_at ?? ""),
              };
            })
          : [];

      return { productores, parcelas, cultivos, campanias, campaniaActiva, actividadesRecientes };
    },
    staleTime: 30_000,
  });
}
