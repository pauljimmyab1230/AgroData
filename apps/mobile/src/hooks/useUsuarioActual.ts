import { useState, useEffect } from "react";
import { getStoredAuth, type User } from "../services/auth";

/**
 * Devuelve el usuario autenticado almacenado localmente.
 * Sustituye a la identidad hardcodeada en los headers de pantalla.
 */
export function useUsuarioActual(): { user: User | null; loading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelado = false;
    getStoredAuth()
      .then((auth) => {
        if (!cancelado) setUser(auth?.user ?? null);
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  return { user, loading };
}
