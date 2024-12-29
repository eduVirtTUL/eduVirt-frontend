export const keys = {
  CLUSTER: "cluster",
  CLUSTER_METRIC_VALUES: "clusterMetricValues",
  COURSE: "course",
  HOSTS: "hosts",
  MAINTENANCE_INTERVALS: "maintenance_intervals",
  METRICS: "metrics",
  RESOURCE_GROUP: "resourceGroup",
  RESERVATIONS: "reservations",
  VNIC_PROFILE: "vnicProfile",
  VLANS_RANGE: "vlansRange",
  TEAM: "team",
};

export const resourceGroupKeys = {
  all: ["resourceGroup"] as const,
  detail: (id: string) => ["resourceGroup", id] as const,
  networks: (id: string) => ["resourceGroup", id, "network"] as const,
  vm: (id: string, vmId: string) => ["resourceGroup", id, "vm", vmId] as const,
};

export const courseKeys = {
  all: ["course"] as const,
  detail: (id: string) => ["course", id] as const,
  metrics: (id: string) => ["course", id, "metrics"] as const,
  metric: (id: string, metricId: string) =>
    ["course", id, "metrics", metricId] as const,
};
