import Constants from "expo-constants";
import { Platform } from "react-native";

// La URL de la API se configura por variable de entorno.
// En desarrollo: EXPO_PUBLIC_API_URL o, en su defecto, la IP del dev server de
// Expo (hostUri) desde donde se cargo el bundle; asi funciona en cualquier red
// y dispositivo (telefono, tablet, emulador) sin cambiar el codigo.
// En produccion: EXPO_PUBLIC_API_URL_PROD (fallback a api.agrodata.com, HTTPS).

function hostDelDevServer(): string | null {
  const config = Constants.expoConfig as (typeof Constants.expoConfig & { hostUri?: string }) | null;
  const extra = Constants as unknown as {
    manifest2?: { extra?: { expoGo?: { debuggerHost?: string } } };
    manifest?: { debuggerHost?: string };
  };
  const hostUri = config?.hostUri ?? extra.manifest2?.extra?.expoGo?.debuggerHost ?? extra.manifest?.debuggerHost;
  if (!hostUri) return null;
  const host = hostUri.split(":")[0];
  return host || null;
}

const hostDev = hostDelDevServer();

const urlDesarrollo =
  process.env.EXPO_PUBLIC_API_URL ??
  (hostDev
    ? `http://${hostDev}:5000/api`
    : Platform.OS === "web"
      ? "http://localhost:5000/api"
      : "http://192.168.1.94:5000/api");

const urlProduccion = process.env.EXPO_PUBLIC_API_URL_PROD ?? "https://api.agrodata.com/api";

if (!__DEV__ && !urlProduccion.startsWith("https://")) {
  console.warn("EXPO_PUBLIC_API_URL_PROD deberia usar HTTPS en produccion");
}

export const API_BASE_URL = __DEV__ ? urlDesarrollo : urlProduccion;
