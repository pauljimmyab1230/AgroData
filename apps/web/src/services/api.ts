import axios from "axios";

function getApiBaseUrl(): string {
  const { hostname, protocol } = window.location;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000/api";
  }

  // Devtunnels o cualquier host no-localhost: usar proxy de Vite (mismo origen /api)
  return `${protocol}//${hostname}/api`;
}

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("agrodata-auth");
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = parsed?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // ignora errores de parseo
  }
  return config;
});

// Rutas de auth donde un 401 es esperado (credenciales incorrectas).
const RUTAS_AUTH = ["/auth/login", "/auth/refresh"];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? "";
    const esAuth = RUTAS_AUTH.some((ruta) => url.includes(ruta));

    if (error.response?.status === 401 && !esAuth) {
      localStorage.removeItem("agrodata-auth");
      // Navegación SPA sin recarga completa: preserva el estado de React Query.
      if (window.location.pathname !== "/login") {
        window.history.pushState({}, "", "/login");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
