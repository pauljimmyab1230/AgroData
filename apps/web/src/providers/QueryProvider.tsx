import { QueryClient, QueryClientProvider, MutationCache } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { toast } from "../utils/toast";

// Toast global de error para mutaciones: evita que cada página trague el error.
const mutationCache = new MutationCache({
  onError: (error, _variables, _context, mutation) => {
    // Si la mutación define su propio onError, no duplicar el toast.
    if (mutation.options.onError) return;
    const mensaje =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      "Ocurrió un error. Inténtalo de nuevo.";
    toast.error(mensaje);
  },
});

const queryClient = new QueryClient({
  mutationCache,
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

interface Props {
  children: ReactNode;
}

export function QueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
