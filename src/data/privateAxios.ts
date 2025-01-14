import axios, { AxiosError } from "axios";

export type ErrorResponse = {
  message: string;
  key: string;
};

export type CustomAxiosError = AxiosError<ErrorResponse>;

export const privateAxios = axios.create({
  baseURL: "http://localhost:8080",
});

privateAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

privateAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);
