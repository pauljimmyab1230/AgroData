import { useCallback } from "react";
import { Alert } from "react-native";
import { logout } from "../services/auth";
import { emit } from "../events";

export function useLogout() {
  const handleLogout = useCallback(() => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch {
            // El cierre local se hace igualmente aunque falle el servidor.
          }
          emit("LOGOUT");
        },
      },
    ]);
  }, []);

  return handleLogout;
}
