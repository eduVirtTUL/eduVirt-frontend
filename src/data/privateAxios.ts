import axios, { AxiosError } from "axios";

export type ErrorKey =
  | "networkAlreadyExists"
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
  | "resource.group.pool.not.found"
  | "clusters.error.not.found"
  | "metrics.error.not.found"
  | "metrics.error.delete.exception"
  | "metrics.error.name.already.taken"
  | "clusterMetricValues.error.value.not.defined"
  | "clusterMetricValues.error.value.already.defined"
  | "maintenanceIntervals.error.not.found"
  | "maintenanceIntervals.error.too.long"
  | "maintenanceIntervals.error.invalid.time.window"
  | "maintenanceIntervals.error.begin.at.past"
  | "maintenanceIntervals.error.conflict"
  | "maintenanceIntervals.error.already.finished"
  | "reservations.error.not.found"
  | "reservations.error.conflict"
  | "reservations.error.end.before.start"
  | "reservations.error.start.in.past"
  | "reservations.error.too.short"
  | "reservations.error.creation.error"
  | "reservations.error.maintenance.interval.conflict"
  | "reservations.error.course.resources.insufficient"
  | "reservations.error.cluster.resources.insufficient"
  | "reservations.error.max.length.exceeded"
  | "reservations.error.grace.period.not.finished"
  | "reservations.error.grace.period.could.not.finish"
  | "reservations.error.resource.group.already.reserved"
  | "reservations.error.notification.time.too.long"
  | "reservations.error.reservation.count.exceeded"
  | "reservations.error.stateful.pod.not.assigned"
  | "reservations.error.stateless.pod.not.assigned";

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
