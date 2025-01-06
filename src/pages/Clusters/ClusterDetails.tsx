import React, {useEffect} from "react";
import { useClusterDetails } from "@/data/cluster-metrics/useClusterDetails";
import {Link, useNavigate} from "react-router";
import { Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HostList from "@/pages/Clusters/HostList";
import ClusterInfo from "@/pages/Clusters/ClusterInfo";
import { useTranslation } from "react-i18next";
import NetworkList from "@/pages/Clusters/NetworkList";
import ClusterMetricsList from "@/pages/ClusterLimits/ClusterMetricsList";
import PageHeader from "@/components/PageHeader";
import {jwtDecode} from "jwt-decode";
import {toast} from "sonner";
import {Skeleton} from "@/components/ui/skeleton";
import {Label} from "@/components/ui/label";
import {CardContent} from "@/components/ui/card";
import EventList from "@/pages/Clusters/EventList";

type ClusterDetailsProps = {
  clusterId: string;
};

const ClusterDetails: React.FC<ClusterDetailsProps> = ({ clusterId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { cluster, isLoading: clusterLoading } = useClusterDetails(clusterId);

  useEffect(() => {
    if (!clusterLoading && !cluster) {
      toast.error(t("clusters.error.not.found"));
      navigate(-1);
    }
  }, [cluster, clusterLoading, navigate, t]);

  return (
    <>
      <div className="flex justify-start">
        <Button asChild variant="outline" size="icon" className="mr-5">
          <Link to={"/limits"}>
            <Undo2/>
          </Link>
        </Button>
        <PageHeader title={`${t("clusters.details.title")}`}/>
      </div>

      <Tabs defaultValue="cluster-details" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="cluster-details">{t("clusters.details.tabs.details")}</TabsTrigger>
          <TabsTrigger value="host-list">{t("clusters.details.tabs.hosts")}</TabsTrigger>
          <TabsTrigger value="network-list">{t("clusters.details.tabs.network")}</TabsTrigger>
          <TabsTrigger value="metric-list">{t("clusters.details.tabs.metric")}</TabsTrigger>
          <TabsTrigger value="event-list">{t("clusters.details.tabs.event")}</TabsTrigger>
        </TabsList>
        <TabsContent value="cluster-details">
          {cluster ? (
              <ClusterInfo cluster={cluster} />
          ) : (
            <>
              <CardContent className="flex flex-col items-center space-y-4 p-6 w-3/4 mx-auto">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="flex w-full items-center space-x-4">
                    <Label className="w-1/3 text-left">
                      <Skeleton className="h-5 w-24" />
                    </Label>
                    <Skeleton className="h-10 w-2/3" />
                  </div>
                ))}

                <div className="mt-4 flex w-full justify-center">
                  <Skeleton className="h-10 w-48" />
                </div>
              </CardContent>
            </>
          )}
        </TabsContent>
        <TabsContent value="host-list">
          <HostList clusterId={clusterId}/>
        </TabsContent>
        <TabsContent value="network-list">
          <NetworkList clusterId={clusterId}/>
        </TabsContent>
        <TabsContent value="metric-list">
          <ClusterMetricsList clusterId={clusterId}/>
        </TabsContent>
        <TabsContent value="event-list">
          <EventList clusterId={clusterId} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ClusterDetails;
