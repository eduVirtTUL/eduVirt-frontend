import { useParams } from "react-router";
import React from "react";
import ClusterDetails from "@/pages/Clusters/ClusterDetails";
import { RouteHandle } from "@/AuthGuard";
import i18next from "i18next";

const ClusterLimitsPage: React.FC = () => {
  const { id } = useParams();

  return (
    <>
      <ClusterDetails clusterId={id!} />
    </>
  );
};

export default ClusterLimitsPage;

export const handle: RouteHandle = {
  roles: ["administrator"],
};

export const meta = () => {
  return [{ title: i18next.t("pageTitles.clusterMetricValues") }];
};