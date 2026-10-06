import api from "./api";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

const CLAVE_AUTH = "agrodata-auth";
const CLAVE_REFRESH = "agrodata-refresh";

// El access token va en memoria (opción A); el refresh token en SecureStore.
let tokenEnMemoria: string | null = null;

export function getToken(): string | null {
  return tokenEnMemoria;
}

export function setToken(token: string | null): void {
  tokenEnMemoria = token;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post("/auth/login", { email, password });
  const result = data.data ?? data;

  // Access token en memoria, refresh token en SecureStore (cifrado por el SO).
  tokenEnMemoria = result.token;
  await SecureStore.setItemAsync(CLAVE_REFRESH, result.refreshToken);
  await AsyncStorage.setItem(CLAVE_AUTH, JSON.stringify({ user: result.user }));

  return result;
}

export async function refresh(): Promise<LoginResponse | null> {
  try {
    const refreshToken = await SecureStore.getItemAsync(CLAVE_REFRESH);
    if (!refreshToken) return null;

    const { data } = await api.post("/auth/refresh", { refreshToken });
    const result = data.data ?? data;

    tokenEnMemoria = result.token;
    await SecureStore.setItemAsync(CLAVE_REFRESH, result.refreshToken);
    await AsyncStorage.setItem(CLAVE_AUTH, JSON.stringify({ user: result.user }));

    return result;
  } catch {
    return null;
  }
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get("/auth/profile");
  return data.data ?? data;
}

export async function logout(): Promise<void> {
  const refreshToken = await SecureStore.getItemAsync(CLAVE_REFRESH);
  try {
    await api.post("/auth/logout", refreshToken ? { refreshToken } : {});
  } catch {
    // El logout local se hace igualmente aunque falle el servidor.
  }
  tokenEnMemoria = null;
  await SecureStore.deleteItemAsync(CLAVE_REFRESH);
  await AsyncStorage.removeItem(CLAVE_AUTH);
}

export async function getStoredAuth(): Promise<{ user: User } | null> {
  try {
    const raw = await AsyncStorage.getItem(CLAVE_AUTH);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
