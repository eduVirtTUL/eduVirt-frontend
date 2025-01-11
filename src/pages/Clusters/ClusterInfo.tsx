import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ClusterDetailsDto } from "@/api";
import { useTranslation } from "react-i18next";
import { CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import { ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type ClusterDetailsProps = {
    cluster: ClusterDetailsDto;
};

const ClusterInfo: React.FC<ClusterDetailsProps> = ({cluster}) => {
  const {t} = useTranslation();

  return (
    <>
      <CardContent className="flex flex-col items-center space-y-4 p-6 w-3/4 mx-auto">
        {[
          {label: t("clusters.details.table.columns.identifier"), value: cluster.id},
          {label: t("clusters.details.table.columns.description"), value: cluster.description},
          {label: t("clusters.details.table.columns.comment"), value: cluster.comment},
          {label: t("clusters.details.table.columns.cpuType"), value: cluster.clusterCpuType},
          {
            label: t("clusters.details.table.columns.compatibilityVersion"),
            value: cluster.compatibilityVersion
          },
          {
            label: t("clusters.details.table.columns.threadsAsCores"),
            value: cluster.threadsAsCores ? t("general.yes") : t("general.no"),
          },
          {
            label: t("clusters.details.table.columns.maxMemoryOverCommit"),
            value: cluster.maxMemoryOverCommit
          },
        ].map((field, index) => (
          <div key={index} className="flex w-full items-center space-x-4">
            <Label className="w-1/3 text-left">{field.label}</Label>
            <Input className="w-2/3" value={field.value || ""} disabled/>
          </div>
        ))}

        <Button
          className={"text-wrap"}
          variant="secondary"
          onClick={(e) => e.stopPropagation()}
          asChild
        >

          <Link
            target="_blank"
            to={`https://vteste1.vlab.it.p.lodz.pl/ovirt-engine/webadmin/?locale=en_US#clusters-general;name=${cluster?.name}`}
          >
            <ExternalLinkIcon/>
            {t("clusters.details.ovirt.cluster")}
          </Link>
        </Button>
      </CardContent>
    </>
  );
};

export default ClusterInfo;
