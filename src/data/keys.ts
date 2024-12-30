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
  ACCESS_KEY: "accessKey",
};

export const resourceGroupKeys = {
  all: ["resourceGroup"] as const,
  detail: (id: string) => ["resourceGroup", id] as const,
  networks: (id: string) => ["resourceGroup", id, "network"] as const,
  vm: (id: string, vmId: string) => ["resourceGroup", id, "vm", vmId] as const,
};
