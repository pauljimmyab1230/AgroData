import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  fetchUsuarios,
  fetchUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  fetchUsuariosBasic,
  type Usuario,
  type Rol,
  type RolSic,
} from "../../services/usuarios";

export function useUsuarios(filters?: {
  search?: string;
  rol?: string;
  rol_sic?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["usuarios", "lista", filters],
    queryFn: () => fetchUsuarios(filters),
    placeholderData: keepPreviousData,
  });
}

export function useUsuario(id: string | number | null | undefined) {
  return useQuery<Usuario>({
    queryKey: ["usuarios", "detalle", id],
    queryFn: () => fetchUsuario(String(id)),
    enabled: id != null && id !== "",
  });
}

export function useUsuariosBasic(rol_sic?: string) {
  return useQuery({
    queryKey: ["usuarios", "basic", rol_sic ?? "todos"],
    queryFn: () => fetchUsuariosBasic(rol_sic),
    staleTime: 5 * 60_000,
  });
}

export function useCreateUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { nombre: string; email: string; password: string; rol?: Rol; rolSic?: RolSic | null }) =>
      createUsuario(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

export function useUpdateUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<{ nombre: string; email: string; password: string; rol: Rol; rolSic: RolSic | null; activo: boolean }> }) =>
      updateUsuario(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

export function useDeleteUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUsuario(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}
