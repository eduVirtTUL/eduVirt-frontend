import axios, { AxiosError } from "axios";

export type ErrorKey =
  | "courseAlreadyExists"
  | "courseConflict"
  | "courseMetricNetworksNotSufficient"
  | "noNetworkAvailable"
  | "rgAlreadyExists"
  | "resourceGroupConflict"
  | "resourceGroupPoolAlreadyExists"
  | "rgPoolConflict"
  | "virtualMachineAlreadyExists"
  | "virtualMachineClusterMismatch"
  | "vmConflict"
  | "courseLimits.error.value.already.defined"
  | "courseLimits.error.value.not.defined"
  | "course.not.found"
  | "resource.group.not.found"
  | "resource.group.pool.not.found";

export type ErrorResponse = {
  message: string;
  key: ErrorKey;
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
      // localStorage.removeItem("token");
      // window.location.reload();
    }
    return Promise.reject(error);
  }
);
