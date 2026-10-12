import { Alert } from "react-native";

export const toast = {
  success: (message: string) => Alert.alert("Éxito", message),
  error: (message: string) => Alert.alert("Error", message),
  info: (message: string) => Alert.alert("Información", message),
  warning: (message: string) => Alert.alert("Advertencia", message),
};