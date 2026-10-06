import { Platform } from "react-native";

// La URL de la API se configura por variable de entorno.
// En desarrollo: EXPO_PUBLIC_API_URL (o fallback por plataforma).
// En producción: EXPO_PUBLIC_API_URL_PROD (o fallback a api.agrodata.com).
const DEV_URL = Platform.select({
  android: process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.100.4:5000/api",
  ios: process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.100.4:5000/api",
  default: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5000/api",
});

export const API_BASE_URL = __DEV__
  ? DEV_URL
  : process.env.EXPO_PUBLIC_API_URL_PROD ?? "https://api.agrodata.com/api";
