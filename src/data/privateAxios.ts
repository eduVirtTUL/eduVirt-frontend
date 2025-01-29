import { appEnv } from "@/environment";
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
  | "clusterMetricValues.error.conflict.exception"
  | "maintenanceIntervals.error.not.found"
  | "maintenanceIntervals.error.invalid.time.window"
  | "maintenanceIntervals.error.begin.too.early"
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
  | "reservations.error.stateless.pod.not.assigned"
  | "ovirt.vnic.profile.not.found"
  | "eduvirt.vnic.profile.not.found"
  | "vnic.profile.already.exists"
  | "vlans.range.not.found"
  | "vlans.range.invalid.definition"
  | "vlans.range.conflicting.range"
  | "general.error.connection.open.error"
  | "course.invalid.type"
  | "teacher.already.in.course"
  | "teacher.not.in.course"
  | "course.no.teachers"
  | "user.not.found"
  | "user.not.authorized"
  | "user.name.already.exists"
  | "team.not.found"
  | "team.not.found.in.course"
  | "team.already.exists"
  | "team.not.active"
  | "team.user.not.member"
  | "team.user.already.member"
  | "team.validation.exception"
  | "incorrect.team.type.exception"
  | "user.already.in.course.exception"
  | "team.conflict.exception"
  | "pod.not.found"
  | "pod.already.exists"
  | "pod.invalid.type"
  | "access.key.not.found.exception"
  | "access.key.already.exists"
  | "access.key.invalid.format"
  | "access.key.invalid.type"
  | "access.key.duplicate"
  | "access.key.could.not.be.generated"
  | "teacher.self.modification.exception"
  | "pod.deletion.exception"
  | "team.deletion.exception"
  | "ovirt.vnic.profile.currently.in.use"

export type ErrorResponse = {
  message: string;
  key: ErrorKey;
};

export type CustomAxiosError = AxiosError<ErrorResponse>;

export const privateAxios = axios.create({
  baseURL:
    typeof window !== "undefined"
      ? appEnv.apiUrl
      : import.meta.env.VITE_API_LOCATION,
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
