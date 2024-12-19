import { Link, useParams } from "react-router";
import { useMaintenanceIntervals } from "@/data/maintenance/useMaintenanceIntervals";
import { ColumnDef } from "@tanstack/react-table";
import { MaintenanceIntervalDto } from "@/api";
import DataTable from "@/components/DataTable";
import { LoaderIcon, MoreHorizontal, PlusIcon, Undo2 } from "lucide-react";
import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useCluster } from "@/data/cluster/useCluster";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRemoveMaintenanceInterval } from "@/data/maintenance/useRemoveMaintenanceInterval";

const ClusterIntervalList: React.FC = () => {
  const { id } = useParams();
  const [active, setActive] = useState<boolean>(true);
  const { cluster, isLoading: clusterLoading } = useCluster(id!);
  const { intervals, isLoading: intervalsLoading } = useMaintenanceIntervals(
    id!,
    active
  );
  const { removeMaintenanceIntervalAsync } = useRemoveMaintenanceInterval();

  const handleRemoveMaintenanceInterval = async (
    maintenanceInterval: string
  ) => {
    await removeMaintenanceIntervalAsync(maintenanceInterval);
  };

  const columns: ColumnDef<MaintenanceIntervalDto>[] = [
    { accessorKey: "cause", header: "Cause" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "type", header: "Type" },
    {
      accessorKey: "beginAt",
      header: "Start",
      cell: (start) => {
        const value = start.getValue() as string;
        const startTime = new Date(value);
        return startTime.toUTCString();
      },
    },
    {
      accessorKey: "endAt",
      header: "End",
      cell: (end) => {
        const value = end.getValue() as string;
        const endTime = new Date(value);
        return endTime.toUTCString();
      },
    },
    {
      id: "action",
      cell: ({ row }) => {
        const maintenanceInterval = row.original;

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
                <DropdownMenuItem
                  onClick={() =>
                    handleRemoveMaintenanceInterval(maintenanceInterval.id!)
                  }
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

  if (clusterLoading || intervalsLoading) {
    return (
      <div className="flex items-center justify-center h-screen my-auto">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-start">
        <Button variant="outline" size="icon" className="mr-5">
          <Link to={"/maintenance"}>
            <Undo2 />
          </Link>
        </Button>
        <PageHeader
          title={`Intervals for ${cluster != null ? cluster.name : ""} cluster`}
        />
      </div>
      <div className="flex flex-row items-center justify-between pb-5">
        <Button>
          <Link
            to={`/maintenance/calendar/${id}`}
            className="flex items-center justify-between w-full"
          >
            <PlusIcon />
            New interval
          </Link>
        </Button>
        <div className={"flex flex-row space-x-3"}>
          <Switch checked={active} onCheckedChange={setActive} />
          <div className="space-y-0.5">
            <Label className="text-base">Active intervals</Label>
          </div>
        </div>
      </div>
      <DataTable columns={columns} data={intervals?.items ?? []} />
    </>
  );
};

export default ClusterIntervalList;
