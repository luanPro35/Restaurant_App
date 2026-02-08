import axios from "axios";
import { Config } from "../../config";

console.log("🔧 API Base URL:", Config.API_URL);

const api = axios.create({
  baseURL: `${Config.API_URL}/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(
      "📡 Request:",
      config.method?.toUpperCase(),
      (config.baseURL || "") + (config.url || ""),
    );
    return config;
  },
  (error) => {
    console.log("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log("❌ Response Error:", error.message);
    if (error.response) {
      console.log("   Status:", error.response.status);
      console.log("   Data:", error.response.data);
    } else if (error.request) {
      console.log("   No response received - possible network/CORS issue");
    }
    return Promise.reject(error);
  },
);

export default api;
