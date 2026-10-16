import api from "./api";
import {
  guardarSesion,
  limpiarSesion,
  obtenerRefreshToken,
  obtenerSesionGuardada,
} from "./sesion";

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

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post("/auth/login", { email, password });
  const result = data.data ?? data;

  await guardarSesion(result.token, result.refreshToken, result.user);

  return result;
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get("/auth/profile");
  return data.data ?? data;
}

export async function logout(): Promise<void> {
  const refreshToken = await obtenerRefreshToken();
  try {
    await api.post("/auth/logout", refreshToken ? { refreshToken } : {});
  } catch {
    // El logout local se hace igualmente aunque falle el servidor.
  }
  await limpiarSesion();
}

export async function getStoredAuth(): Promise<{ user: User } | null> {
  return (await obtenerSesionGuardada()) as { user: User } | null;
}
