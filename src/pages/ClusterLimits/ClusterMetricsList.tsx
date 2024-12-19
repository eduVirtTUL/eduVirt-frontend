import { useParams } from "react-router";
import { useClusterMetrics } from "@/data/cluster-metrics/useClusterMetrics";
import { useRemoveClusterMetricValue } from "@/data/cluster-metrics/useRemoveClusterMetricValue";
import { useDialog } from "@/stores/dialogStore";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateClusterMetricValue from "@/components/Modals/CreateClusterMetricValue";
import { Button } from "@/components/ui/button";
import DataTable from "@/pages/Courses/DataTable";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MetricValueDto } from "@/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoaderIcon, MoreHorizontal, PlusIcon } from "lucide-react";

const ClusterMetricsList: React.FC = () => {
  const { id } = useParams();
  const { metrics, isLoading } = useClusterMetrics(id!);
  const { removeClusterMetricValueAsync } = useRemoveClusterMetricValue(id!);
  const { open } = useDialog();

  const handleRemoveClusterMetricValue = async (metricId: string) => {
    await removeClusterMetricValueAsync(metricId);
  };

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
        <CardTitle>Defined metrics values</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateClusterMetricValue clusterId={id!} />
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
      </CardContent>
    </>
  );
};

export default ClusterMetricsList;
