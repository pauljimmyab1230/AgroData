import axios from "axios";
import { API_BASE_URL } from "../config";
import { emit } from "../events";
import {
  guardarSesion,
  limpiarSesion,
  obtenerRefreshToken,
  obtenerToken,
} from "./sesion";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = obtenerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Rutas de auth donde un 401 es esperado (credenciales incorrectas).
const RUTAS_AUTH = ["/auth/login", "/auth/refresh"];

async function refrescarSesion(): Promise<boolean> {
  try {
    const refreshToken = await obtenerRefreshToken();
    if (!refreshToken) return false;

    const { data } = await api.post("/auth/refresh", { refreshToken });
    const resultado = data.data ?? data;

    await guardarSesion(resultado.token, resultado.refreshToken, resultado.user);
    return true;
  } catch {
    return false;
  }
}

let refrescando: Promise<boolean> | null = null;

async function intentarRefresh(): Promise<boolean> {
  if (refrescando) return refrescando;
  refrescando = refrescarSesion();
  try {
    return await refrescando;
  } finally {
    refrescando = null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url: string = error.config?.url ?? "";
    const esAuth = RUTAS_AUTH.some((ruta) => url.includes(ruta));
    const yaReintentado = error.config?._reintentoRefresh === true;

    if (error.response?.status === 401 && !esAuth && !yaReintentado) {
      const ok = await intentarRefresh();
      if (ok) {
        error.config._reintentoRefresh = true;
        error.config.headers.Authorization = `Bearer ${obtenerToken()}`;
        return api(error.config);
      }
      // Sesión irrecuperable: limpiar también el almacenamiento persistente
      // para que el próximo arranque no "resucite" una sesión inválida.
      await limpiarSesion();
      emit("LOGOUT");
    }
    return Promise.reject(error);
  }
);

export default api;
