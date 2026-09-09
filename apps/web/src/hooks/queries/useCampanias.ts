import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCampanias,
  fetchCampania,
  createCampania,
  updateCampania,
  deleteCampania,
  fetchCampaniaStats,
  fetchCampaniaGlobalStats,
  fetchCampaniaTimeline,
  type Campania,
  type CampaniaFormData,
  type CampaniasQuery,
  type CampaniaStats,
  type CampaniaGlobalStats,
  type TimelineEvent,
} from "../../services/campanias";

export function useCampanias(filters?: CampaniasQuery) {
  return useQuery({
    queryKey: ["campanias", filters],
    queryFn: () => fetchCampanias(filters),
  });
}

export function useCampania(id: number | null) {
  return useQuery<Campania>({
    queryKey: ["campania", id],
    queryFn: () => fetchCampania(id!),
    enabled: id !== null,
  });
}

export function useCreateCampania() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CampaniaFormData>) => createCampania(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campanias"] });
      qc.invalidateQueries({ queryKey: ["campaniaGlobalStats"] });
    },
  });
}

export function useUpdateCampania() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CampaniaFormData> }) =>
      updateCampania(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["campanias"] });
      qc.invalidateQueries({ queryKey: ["campania", variables.id] });
      qc.invalidateQueries({ queryKey: ["campaniaStats", variables.id] });
      qc.invalidateQueries({ queryKey: ["campaniaTimeline", variables.id] });
      qc.invalidateQueries({ queryKey: ["campaniaGlobalStats"] });
    },
  });
}

export function useDeleteCampania() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCampania(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campanias"] });
      qc.invalidateQueries({ queryKey: ["campaniaGlobalStats"] });
    },
  });
}

export function useCampaniaStats(id: number | null) {
  return useQuery<CampaniaStats>({
    queryKey: ["campaniaStats", id],
    queryFn: () => fetchCampaniaStats(id!),
    enabled: id !== null,
  });
}

export function useCampaniaGlobalStats(filters?: CampaniasQuery) {
  return useQuery<CampaniaGlobalStats>({
    queryKey: ["campaniaGlobalStats", filters],
    queryFn: () => fetchCampaniaGlobalStats(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCampaniaTimeline(id: number | null) {
  return useQuery<TimelineEvent[]>({
    queryKey: ["campaniaTimeline", id],
    queryFn: () => fetchCampaniaTimeline(id!),
    enabled: id !== null,
  });
}
