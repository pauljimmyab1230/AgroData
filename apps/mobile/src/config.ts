import { Platform } from "react-native";

const DEV_URL = Platform.select({
  android: "http://192.168.100.4:5000/api",
  ios: "http://192.168.100.4:5000/api",
  default: "http://localhost:5000/api",
});

export const API_BASE_URL = __DEV__ ? DEV_URL : "https://api.agrodata.com/api";
