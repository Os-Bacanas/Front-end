import axios, { type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://api-estagio.up.railway.app",
});

api.interceptors.request.use(
  (config) => {
    if (
      !config.url?.includes("/login") &&
      !config.url?.includes("/users/cadastro")
    ) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;