import axios from "axios";
import { Config } from "../../config";
import tokenManager from "./token.manager";

const api = axios.create({
  baseURL: `${Config.API_URL}/api/v1`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn("🔒 [Axios] 401 Unauthorized - Clearing token");
      tokenManager.setToken(null);
    }
    return Promise.reject(error);
  },
);

export default api;
