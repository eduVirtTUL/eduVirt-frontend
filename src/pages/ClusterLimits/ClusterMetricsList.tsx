import { useRemoveClusterMetricValue } from "@/data/cluster-metrics/useRemoveClusterMetricValue";
import { useDialog } from "@/stores/dialogStore";
import { CardContent } from "@/components/ui/card";
import CreateClusterMetricValue from "@/pages/ClusterLimits/modals/CreateClusterMetricValueModal";
import { Button } from "@/components/ui/button";
import DataTable from "@/pages/VnicProfiles/DataTable";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MetricValueDto } from "@/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import UpdateClusterMetricValueModal from "@/pages/ClusterLimits/modals/UpdateClusterMetricValueModal";

type ClusterMetricListProps = {
  clusterId: string,
  metrics: MetricValueDto[];
};

const columns = (
  t: TFunction,
  onEdit: (dto: MetricValueDto) => void,
  onDelete: (id: string) => void
): ColumnDef<MetricValueDto>[] => [
  { accessorKey: "name", header: t("clusterMetricValues.table.columns.name") },
  { accessorKey: "value", header: t("clusterMetricValues.table.columns.value") },
  {
    id: "actions",
    cell: ({ row }) => {
      const metric = row.original;
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">
                  {t("clusterMetricValues.table.openMenu")}
                </span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onEdit(metric)}
              >
                {t("clusterMetricValues.table.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(metric.id!)}
              >
                {t("clusterMetricValues.table.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

const ClusterMetricsList: React.FC<ClusterMetricListProps> = ({ clusterId, metrics }) => {
  const { t } = useTranslation();
  const { open } = useDialog();
  const { removeClusterMetricValueAsync } = useRemoveClusterMetricValue(clusterId);

  const [ editId, setEditId ] = React.useState<string>();

  const handleUpdateClusterMetricValue = async (dto: MetricValueDto) => {
    setEditId(dto.id);
    open("updateClusterMetricValue");
  };

  const handleRemoveClusterMetricValue = async (metricId: string) => {
    await removeClusterMetricValueAsync(metricId);
  };

  return (
    <>
      <CardContent className={"p-4"}>
        {editId && <UpdateClusterMetricValueModal
            clusterId={clusterId} metricId={editId}
        />}

        <CreateClusterMetricValue clusterId={clusterId} />

        <div className="pb-5">
          <Button onClick={() => { open("createClusterMetricValue"); }}>
            <PlusIcon />
            {t("clusterMetricValues.add")}
          </Button>
        </div>

        <DataTable columns={
          columns(t, handleUpdateClusterMetricValue, handleRemoveClusterMetricValue)}
                   data={metrics ?? []}
        />
      </CardContent>
    </>
  );
};

export default ClusterMetricsList;
