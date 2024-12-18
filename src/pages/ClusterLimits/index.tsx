import { useCluster } from "@/data/cluster/useCluster";
import { useParams } from "react-router";
import { useClusterMetrics } from "@/data/cluster-metrics/useClusterMetrics";
import PageHeader from "@/components/PageHeader";
import { ColumnDef } from "@tanstack/react-table";
import { MetricValueDto } from "@/api";
import DataTable from "@/pages/Courses/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import React from "react";
import { useDialog } from "@/stores/dialogStore";
import CreateClusterMetricValue from "@/components/Modals/CreateClusterMetricValue";
import { useRemoveClusterMetricValue } from "@/data/cluster-metrics/useRemoveClusterMetricValue";

const ClusterLimitsPage: React.FC = () => {
  const { id } = useParams();
  const { cluster } = useCluster(id!);
  const { metrics } = useClusterMetrics(id!);
  const { removeClusterMetricValueAsync } = useRemoveClusterMetricValue(id!);
  const { open } = useDialog();

  const columns: ColumnDef<MetricValueDto>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "value",
      header: "Value",
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
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRemoveClusterMetricValue(metric.id!)}
                >
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  const handleRemoveClusterMetricValue = async (metricId: string) => {
    await removeClusterMetricValueAsync(metricId);
  };

  return (
    <>
      <CreateClusterMetricValue clusterId={id!} />
      <PageHeader title={`Cluster: ${cluster?.name ?? ""}`} />

      <div className="pb-5">
        <Button
          onClick={() => {
            open("createClusterMetricValue");
          }}
        >
          <PlusIcon />
          New metric value
        </Button>
      </div>

      <DataTable columns={columns} data={metrics?.items ?? []} />
    </>
  );
};

export default ClusterLimitsPage;
