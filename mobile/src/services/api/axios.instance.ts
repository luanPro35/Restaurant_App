import axios from "axios";
import { Config } from "../../config";

const api = axios.create({
  baseURL: `${Config.API_URL}/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
