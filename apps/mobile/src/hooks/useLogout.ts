import { useCallback } from "react";
import { Alert } from "react-native";
import { logout } from "../services/auth";

export function useLogout() {
  const handleLogout = useCallback(() => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: async () => {
          await logout();
          const { emit } = require("../events");
          emit("LOGOUT");
        },
      },
    ]);
  }, []);

  return handleLogout;
}
