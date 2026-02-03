import api from "./axios.instance";

api.interceptors.request.use(async (config) => {
  const token = "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  },
);
