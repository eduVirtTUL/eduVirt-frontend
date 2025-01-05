import { Link, useParams } from "react-router";
import { ColumnDef } from "@tanstack/react-table";
import { MaintenanceIntervalDto } from "@/api";
import DataTable from "@/components/DataTable";
import {CalendarIcon, LoaderIcon, MoreHorizontal, Undo2} from "lucide-react";
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
import {useMaintenanceIntervals} from "@/data/maintenance/useMaintenanceIntervals";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";

const columns= (
    t: TFunction,
    onDelete: (id: string) => void,
): ColumnDef<MaintenanceIntervalDto>[] => [
  { accessorKey: "cause", header: t("maintenanceIntervals.cluster.table.columns.cause") },
  { accessorKey: "description", header: t("maintenanceIntervals.cluster.table.columns.description") },
  { accessorKey: "type", header: t("maintenanceIntervals.cluster.table.columns.type") },
  {
    accessorKey: "beginAt", header: t("maintenanceIntervals.cluster.table.columns.start"),
    cell: (start) => {
      const value = start.getValue() as string;
      const startTime = new Date(value + 'Z');
      return startTime.toLocaleString();
    },
  },
  {
    accessorKey: "endAt", header: t("maintenanceIntervals.cluster.table.columns.end"),
    cell: (end) => {
      const value = end.getValue() as string;
      const endTime = new Date(value + 'Z');
      return endTime.toLocaleString();
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
                  <span className="sr-only">
                    {t("maintenanceIntervals.cluster.table.openMenu")}
                  </span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => onDelete(maintenanceInterval.id!)}
                >
                  {t("maintenanceIntervals.cluster.table.remove")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
      );
    },
  },
];

const ClusterIntervalList: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [ active, setActive ] = useState<boolean>(true);
  const { cluster, isLoading: clusterLoading } = useCluster(id!);
  const { intervals, isLoading: intervalsLoading } = useMaintenanceIntervals(id, active);
  const { removeMaintenanceIntervalAsync } = useRemoveMaintenanceInterval();

  const handleRemoveMaintenanceInterval = async (
      maintenanceInterval: string
  ) => {
    await removeMaintenanceIntervalAsync(maintenanceInterval);
  };

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
        <Link to={"/maintenance"}>
          <Button variant="outline" size="icon" className="mr-5">
            <Undo2/>
          </Button>
        </Link>
        <PageHeader
          title={t("maintenanceIntervals.cluster.title") + `${cluster != null ? cluster.name : ""}`}
        />
      </div>

      <div className="p-3 flex flex-row items-center justify-between pb-5">
        <Link to={`/maintenance/calendar/${id}`}>
          <Button>
            <CalendarIcon/>
            {t("maintenanceIntervals.calendar")}
          </Button>
        </Link>
        <div className={"flex flex-row space-x-3"}>
          <Switch checked={active} onCheckedChange={setActive}/>
          <div className="space-y-0.5">
            <Label className="text-base">{t("maintenanceIntervals.active")}</Label>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns(t, handleRemoveMaintenanceInterval)}
        data={intervals?.items ?? []}
      />
    </>
  );
};

export default ClusterIntervalList;
