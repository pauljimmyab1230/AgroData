import axios from "axios";

function getApiBaseUrl(): string {
  const { hostname, protocol } = window.location;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000/api";
  }

  // Detect devtunnels: s79msm32-5173.brs.devtunnels.ms -> s79msm32-5000.brs.devtunnels.ms
  const tunnelMatch = hostname.match(/^([a-z0-9]+)-\d+\.(.+\.devtunnels\.ms)$/i);
  if (tunnelMatch) {
    const prefix = tunnelMatch[1];
    const domain = tunnelMatch[2];
    return `${protocol}//${prefix}-5000.${domain}/api`;
  }

  // Red local: usar la misma IP pero puerto 5000
  return `${protocol}//${hostname}:5000/api`;
}

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
