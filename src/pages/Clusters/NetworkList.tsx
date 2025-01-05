import React from "react";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";
import {ColumnDef} from "@tanstack/react-table";
import {HostDto, NetworkDto} from "@/api";
import DataTable from "@/components/DataTable";
import {CardContent} from "@/components/ui/card";

type ClusterDetailsProps = {
    networks: NetworkDto[];
};

const columns = (
    t: TFunction
): ColumnDef<HostDto>[] => [
    { accessorKey: "name", header: t("networks.table.columns.name") },
    { accessorKey: "description", header: t("networks.table.columns.description") },
    { accessorKey: "comment", header: t("networks.table.columns.comment") },
    { accessorKey: "status", header: t("networks.table.columns.status") },
];

const NetworkList: React.FC<ClusterDetailsProps> = ({ networks }) => {
  const { t } = useTranslation();

  return (
    <>
      <CardContent className={"p-4"}>
        <DataTable data={networks ?? []} columns={columns(t)} />
      </CardContent>
    </>
  );
};

export default NetworkList;