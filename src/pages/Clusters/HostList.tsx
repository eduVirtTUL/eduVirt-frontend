import React from "react";
import DataTable from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { HostDto } from "@/api";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";
import {CardContent} from "@/components/ui/card";

type ClusterDetailsProps = {
  hosts: HostDto[];
};

const columns = (
    t: TFunction
): ColumnDef<HostDto>[] => [
  { accessorKey: "name", header: t("hosts.table.columns.name") },
  { accessorKey: "address", header: t("hosts.table.columns.domainName") },
  { accessorKey: "cpus", header: t("hosts.table.columns.cpuCount") },
  { accessorKey: "memory", header: t("hosts.table.columns.memorySize") },
];

const HostList: React.FC<ClusterDetailsProps> = ({ hosts }) => {
  const { t } = useTranslation();

  return (
    <>
      <CardContent className={"p-4"}>
        <DataTable data={hosts ?? []} columns={columns(t)} />
      </CardContent>
    </>
  );
};

export default HostList;
