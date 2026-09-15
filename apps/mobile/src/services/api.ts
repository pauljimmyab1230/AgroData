import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";
import { emit } from "../events";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  try {
    const raw = await AsyncStorage.getItem("agrodata-auth");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
  } catch {}
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("agrodata-auth");
      emit("LOGOUT");
    }
    return Promise.reject(error);
  }
);

export default api;
