export const keys = {
  CLUSTER: "cluster",
  CLUSTER_METRIC_VALUES: "clusterMetricValues",
  CLUSTER_RESOURCES: "clusterResources",
  COURSE: "course",
  COURSES: "courses",
  COURSE_RESOURCES: "courseResources",
  EVENTS: "events",
  HOSTS: "hosts",
  MAINTENANCE_INTERVALS: "maintenanceIntervals",
  MAINTENANCE_INTERVAL: "maintenanceInterval",
  METRICS: "metrics",
  NETWORKS: "networks",
  RESOURCE_GROUP: "resourceGroup",
  RESERVATIONS: "reservations",
  VNIC_PROFILE: "vnicProfile",
  VNIC_PROFILE_DETAIL: "vnicProfileDetail",
  VLANS_RANGE: "vlansRange",
  VM_EVENTS: "vmEvents",
  TEAM: "team",
  TIME_WINDOW: "timeWindow",
  ACCESS_KEY: "accessKey",
  POD: "pod",
  STATELESS_POD: "statelessPod",
  USER: "user",
  TEACHER: "teacher",
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
  resourceGroups: (id: string) => ["course", id, "resourceGroups"] as const,
};

export const resourceGroupPoolKeys = {
  all: ["resourceGroupPool"] as const,
  detail: (id: string) => ["resourceGroupPool", id] as const,
};
