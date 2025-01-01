export const keys = {
  CLUSTER: "cluster",
  CLUSTER_METRIC_VALUES: "clusterMetricValues",
  CLUSTER_RESOURCES: "clusterResources",
  COURSE: "course",
  COURSE_RESOURCES: "courseResources",
  HOSTS: "hosts",
  MAINTENANCE_INTERVALS: "maintenanceIntervals",
  MAINTENANCE_INTERVAL: "maintenanceInterval",
  METRICS: "metrics",
  NETWORKS: "networks",
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
