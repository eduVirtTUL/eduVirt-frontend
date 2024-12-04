export const keys = {
  CLUSTER: "cluster",
  CLUSTER_METRIC_VALUES: "clusterMetricValues",
  COURSE: "course",
  METRICS: "metrics",
  RESOURCE_GROUP: "resourceGroup",
  VNIC_PROFILE: "vnicProfile",
  VLANS_RANGE: "vlansRange",
  TEAM: "team",
};

export const resourceGroupKeys = {
  all: ["resourceGroup"] as const,
  detail: (id: string) => ["resourceGroup", id] as const,
  networks: (id: string) => ["resourceGroup", id, "network"] as const,
};
