import axios from "axios";
import { API_BASE_URL } from "../config";
import { emit } from "../events";
import { getToken, setToken, refresh } from "./auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Rutas de auth donde un 401 es esperado (credenciales incorrectas).
const RUTAS_AUTH = ["/auth/login", "/auth/refresh"];

let refrescando: Promise<boolean> | null = null;

async function intentarRefresh(): Promise<boolean> {
  if (refrescando) return refrescando;
  refrescando = (async () => {
    const resultado = await refresh();
    return resultado !== null;
  })();
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
        error.config.headers.Authorization = `Bearer ${getToken()}`;
        return api(error.config);
      }
      setToken(null);
      emit("LOGOUT");
    }
    return Promise.reject(error);
  }
);

export default api;
