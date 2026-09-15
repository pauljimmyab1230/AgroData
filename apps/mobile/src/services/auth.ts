import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post("/auth/login", { email, password });
  const result = data.data ?? data;
  await AsyncStorage.setItem("agrodata-auth", JSON.stringify({ token: result.token, user: result.user }));
  return result;
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get("/auth/profile");
  return data.data ?? data;
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem("agrodata-auth");
}

export async function getStoredAuth(): Promise<{ token: string; user: User } | null> {
  try {
    const raw = await AsyncStorage.getItem("agrodata-auth");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
