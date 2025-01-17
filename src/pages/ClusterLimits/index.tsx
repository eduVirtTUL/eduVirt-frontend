import { useNavigate, useParams } from "react-router";
import React, { useEffect } from "react";
import ClusterDetails from "@/pages/Clusters/ClusterDetails";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { RouteHandle } from "@/AuthGuard";
import i18next from "i18next";

const ClusterLimitsPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthorization = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate(-1);
        return;
      }

      const decoded = jwtDecode<{ groups: string[] }>(token);
      const userGroups = decoded.groups;

      if (!userGroups.includes("/ovirt-administrator")) {
        toast.error("You don't have required privileges to see this page.");
        navigate(-1);
      }
    }

    checkAuthorization();
  }, [navigate, t]);

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