import { useParams } from "react-router";
import React from "react";
import ClusterDetails from "@/pages/Clusters/ClusterDetails";

const ClusterLimitsPage: React.FC = () => {
  const { id } = useParams();

  return (
    <>
      <ClusterDetails clusterId={id!} />
    </>
  );
};

export default ClusterLimitsPage;
