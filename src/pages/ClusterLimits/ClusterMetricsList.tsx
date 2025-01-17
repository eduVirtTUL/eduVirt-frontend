import { useRemoveClusterMetricValue } from "@/data/cluster-metrics/useRemoveClusterMetricValue";
import { useDialog } from "@/stores/dialogStore";
import { CardContent } from "@/components/ui/card";
import CreateClusterMetricValue from "@/components/Modals/CreateClusterMetricValueModal";
import { Button } from "@/components/ui/button";
import React, {useRef, useState} from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MetricValueDto } from "@/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {MoreHorizontal, Pen, PlusIcon, TrashIcon} from "lucide-react";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import UpdateClusterMetricValueModal from "@/components/Modals/UpdateClusterMetricValueModal";
import { useClusterMetrics } from "@/data/cluster-metrics/useClusterMetrics";
import { Skeleton } from "@/components/ui/skeleton";
import SimplePagination from "@/components/SimplePagination";
import SimpleDataTable from "@/components/SimpleDataTable";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import {getBaseUnit, getBaseUnitValue, UnitDefinition} from "@/utils/unitUtils.js";

type ClusterMetricListProps = {
  clusterId: string,
};

const columns = (
  t: TFunction,
  onEdit: (dto: MetricValueDto) => void,
  onDelete: (id: string) => void
): ColumnDef<MetricValueDto>[] => [
  { accessorKey: "name", header: t("clusterMetricValues.table.columns.name") },
  {
    accessorKey: "value",
    header: t("clusterMetricValues.table.columns.value"),
    cell: ({ row }) => {
      const clusterMetric = row.original;
      return getBaseUnitValue(clusterMetric.category!, clusterMetric.value!);
    }
  },
  {
    id: "unit",
    header: t("clusterMetricValues.table.columns.unit"),
    cell: ({ row }) => {
      const clusterMetric = row.original;
      const baseUnit: UnitDefinition = getBaseUnit(clusterMetric.category!);
      {/* @ts-expect-error this doesn't impact the page */}
      return t(baseUnit.symbol)
    },
  },
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
                <Pen className="h-4 w-4 mr-2"/>
                {t("clusterMetricValues.table.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(metric.id!)}
                className="text-destructive"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                {t("clusterMetricValues.table.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

const ClusterMetricsList: React.FC<ClusterMetricListProps> = ({ clusterId }) => {
  const { t } = useTranslation();

  const [ pageNumber, setPageNumber ] = useState<number>(0);
  const [ pageSize ] = useState<number>(10);

  const { open } = useDialog();

  const { metrics, isLoading } = useClusterMetrics({
    id: clusterId,
    page: pageNumber,
    size: pageSize
  });

  const { metrics: nextMetrics, isLoading: nextLoading } = useClusterMetrics({
    id: clusterId,
    page: pageNumber + 1,
    size: pageSize
  });

  const { removeClusterMetricValueAsync } = useRemoveClusterMetricValue(clusterId);

  const deleteId = useRef<string>();
  const [ updateMetric, setUpdateMetric ] = useState<MetricValueDto>();

  const handleUpdateClusterMetricValue = async (metricValue: MetricValueDto) => {
    setUpdateMetric(metricValue);
    open("updateClusterMetricValue");
  };

  const handleRemoveClusterMetricValue = async (metricId: string) => {
    deleteId.current = metricId;
    open("confirmation");
  };

  if (isLoading || nextLoading) {
    return (
      <>
        <div className="pl-5 pt-3">
          <Skeleton className="h-10 w-[100px]"/>
        </div>
        <div className="space-y-6 p-5">
        <div className="rounded-md border">
          <div className="border-b">
            <div className="grid grid-cols-2 p-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-4 w-[100px]" />
              ))}
            </div>
          </div>
          <div>
            {Array.from({ length: pageSize }, (_, i) => i + 1).map((row) => (
              <div key={row} className="grid grid-cols-2 p-4 border-b">
                {[1, 2].map((col) => (
                  <Skeleton key={col} className="h-4 w-[100px]" />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center space-x-3 mt-4">
          <Skeleton className="h-8 w-[100px]"/>
          <Skeleton className="h-8 w-[40px]"/>
          <Skeleton className="h-8 w-[100px]"/>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <CardContent className={"p-4"}>
        {updateMetric && <UpdateClusterMetricValueModal
          clusterId={clusterId}
          metric={updateMetric}
        />}

        <ConfirmationDialog
          header={t("clusterMetricValues.removeClusterMetricValue.confirmation.header")}
          text={t("clusterMetricValues.removeClusterMetricValue.confirmation.text")}
          onConfirm={async () => {
            await removeClusterMetricValueAsync(deleteId.current!);
            deleteId.current = undefined;
          }}
        />

        <CreateClusterMetricValue clusterId={clusterId} />

        <div className="pb-5">
          <Button onClick={() => { open("createClusterMetricValue"); }}>
            <PlusIcon />
            {t("clusterMetricValues.add")}
          </Button>
        </div>

        <SimpleDataTable
          columns={columns(t, handleUpdateClusterMetricValue, handleRemoveClusterMetricValue)}
          data={metrics ?? []}
        />

        <SimplePagination
          page={pageNumber}
          setPage={setPageNumber}
          hasMore={nextMetrics !== undefined && nextMetrics.length !== 0}
        />
      </CardContent>
    </>
  );
};

export default ClusterMetricsList;
