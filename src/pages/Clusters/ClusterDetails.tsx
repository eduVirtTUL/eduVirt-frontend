import React from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClusterDetails } from "@/data/cluster-metrics/useClusterDetails";
import { Link } from "react-router";
import { LoaderIcon, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HostList from "@/pages/Clusters/HostList";
import ClusterInfo from "@/pages/Clusters/ClusterInfo";

type ClusterDetailsProps = {
  clusterId: string;
};

const ClusterDetails: React.FC<ClusterDetailsProps> = ({ clusterId }) => {
  const { cluster, isLoading } = useClusterDetails(clusterId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen my-auto">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <>
      <CardHeader>
        <div className="flex flex-row items-center justify-items-start">
          <Button asChild variant="outline" size="icon" className="mr-5">
            <Link to={"/limits"}>
              <Undo2 />
            </Link>
          </Button>
          <CardTitle>{`Cluster: ${cluster?.name}`}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-y-4">
        <Tabs defaultValue="cluster-details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cluster-details">Details</TabsTrigger>
            <TabsTrigger value="host-list">Hosts</TabsTrigger>
          </TabsList>
          <TabsContent value="cluster-details">
            <ClusterInfo cluster={cluster!} />
          </TabsContent>
          <TabsContent value="host-list">
            <HostList clusterId={clusterId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </>
  );
};

export default ClusterDetails;
