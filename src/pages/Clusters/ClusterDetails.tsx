import React from "react";
import { useClusterDetails } from "@/data/cluster-metrics/useClusterDetails";
import { Link } from "react-router";
import { LoaderIcon, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HostList from "@/pages/Clusters/HostList";
import ClusterInfo from "@/pages/Clusters/ClusterInfo";
import {useTranslation} from "react-i18next";
import NetworkList from "@/pages/Clusters/NetworkList";
import {useNetworks} from "@/data/cluster/useNetworks";
import {useHosts} from "@/data/cluster/useHosts";
import ClusterMetricsList from "@/pages/ClusterLimits/ClusterMetricsList";
import {useClusterMetrics} from "@/data/cluster-metrics/useClusterMetrics";
import PageHeader from "@/components/PageHeader";

type ClusterDetailsProps = {
  clusterId: string;
};

const ClusterDetails: React.FC<ClusterDetailsProps> = ({ clusterId }) => {
  const { t } = useTranslation();

  const { cluster, isLoading: clusterLoading } = useClusterDetails(clusterId);
  const { metrics, isLoading: metricsLoading } = useClusterMetrics(clusterId);
  const { hosts, isLoading: hostsLoading} = useHosts(clusterId);
  const { networks, isLoading: networksLoading} = useNetworks(clusterId);

  if (clusterLoading || hostsLoading || networksLoading || metricsLoading) {
    return (
      <div className="flex items-center justify-center h-screen my-auto">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-start">
        <Button asChild variant="outline" size="icon" className="mr-5">
          <Link to={"/limits"}>
            <Undo2/>
          </Link>
        </Button>
        <PageHeader title={`${t("clusters.details.title")}: ${cluster?.name}`}/>
      </div>

      <Tabs defaultValue="cluster-details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cluster-details">{t("clusters.details.tabs.details")}</TabsTrigger>
          <TabsTrigger value="host-list">{t("clusters.details.tabs.hosts")}</TabsTrigger>
          <TabsTrigger value="network-list">{t("clusters.details.tabs.network")}</TabsTrigger>
          <TabsTrigger value="metric-list">{t("clusters.details.tabs.metric")}</TabsTrigger>
        </TabsList>
        <TabsContent value="cluster-details">
          {cluster ? <ClusterInfo cluster={cluster}/> :
            <div className="flex items-center justify-center h-screen my-auto">
              <LoaderIcon className="animate-spin size-10"/>
            </div>}
        </TabsContent>
        <TabsContent value="host-list">
          <HostList hosts={hosts ?? []}/>
        </TabsContent>
        <TabsContent value="network-list">
          <NetworkList networks={networks ?? []}/>
        </TabsContent>
        <TabsContent value="metric-list">
          <ClusterMetricsList clusterId={clusterId} metrics={metrics?.items ?? []}/>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ClusterDetails;
