import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CLAVE_AUTH = "agrodata-auth";
const CLAVE_REFRESH = "agrodata-refresh";

// El access token va en memoria (opción A); el refresh token en SecureStore.
let tokenEnMemoria: string | null = null;

export function obtenerToken(): string | null {
  return tokenEnMemoria;
}

export function establecerToken(token: string | null): void {
  tokenEnMemoria = token;
}

export async function guardarSesion(
  token: string,
  refreshToken: string,
  usuario: unknown
): Promise<void> {
  // Access token en memoria, refresh token en SecureStore (cifrado por el SO).
  tokenEnMemoria = token;
  await SecureStore.setItemAsync(CLAVE_REFRESH, refreshToken);
  await AsyncStorage.setItem(CLAVE_AUTH, JSON.stringify({ user: usuario }));
}

export async function obtenerRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(CLAVE_REFRESH);
}

export async function obtenerSesionGuardada(): Promise<{ user: unknown } | null> {
  try {
    const raw = await AsyncStorage.getItem(CLAVE_AUTH);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function limpiarSesion(): Promise<void> {
  tokenEnMemoria = null;
  await SecureStore.deleteItemAsync(CLAVE_REFRESH);
  await AsyncStorage.removeItem(CLAVE_AUTH);
}
