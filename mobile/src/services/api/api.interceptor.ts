import api from "./axios.instance";

api.interceptors.request.use((config) => {
  // Add token to headers
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
