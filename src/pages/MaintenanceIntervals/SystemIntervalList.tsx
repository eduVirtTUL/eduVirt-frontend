import React, { useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MaintenanceIntervalDto } from "@/api";
import DataTable from "@/components/DataTable";
import { CalendarIcon, MoreHorizontal, TrashIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRemoveMaintenanceInterval } from "@/data/maintenance/useRemoveMaintenanceInterval";
import { useMaintenanceIntervals } from "@/data/maintenance/useMaintenanceIntervals";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { Skeleton } from "@/components/ui/skeleton";
import SimplePagination from "@/components/SimplePagination";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useDialog } from "@/stores/dialogStore";

type SystemIntervalListProps = {
  active: boolean;
};

const columns = (
    t: TFunction,
    onDelete: (id: MaintenanceIntervalDto) => void,
): ColumnDef<MaintenanceIntervalDto>[] => [
  { accessorKey: "cause", header: t("maintenanceIntervals.system.table.columns.cause") },
  { accessorKey: "description", header: t("maintenanceIntervals.system.table.columns.description") },
  {
    accessorKey: "beginAt", header: t("maintenanceIntervals.system.table.columns.start"),
    cell: (start) => {
      const value = start.getValue() as string;
      const startTime = new Date(value + 'Z');
      return startTime.toLocaleString();
    },
  },
  {
    accessorKey: "endAt", header: t("maintenanceIntervals.system.table.columns.end"),
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

      const start = new Date(maintenanceInterval.beginAt + 'Z');
      const end = new Date(maintenanceInterval.endAt + 'Z');

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">
                  {t("maintenanceIntervals.system.table.openMenu")}
                </span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {start < new Date() && new Date() < end ? (
                <DropdownMenuItem
                  onClick={() => onDelete(maintenanceInterval)}
                >
                  <XIcon className="h-4 w-4 mr-2" />
                  {t("maintenanceIntervals.cluster.table.finish")}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  disabled={new Date() > end} className="text-destructive"
                  onClick={() => onDelete(maintenanceInterval)}
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  {t("maintenanceIntervals.cluster.table.remove")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

const SystemIntervalList: React.FC<SystemIntervalListProps> = () => {
  const { t } = useTranslation();
  const { open } = useDialog();
  const navigate = useNavigate();

  const [ pageNumber, setPageNumber ] = useState<number>(0);
  const [ pageSize ] = useState<number>(10);

  const [ active, setActive ] = useState<boolean>(true);

  const deleteInterval = useRef<MaintenanceIntervalDto>();

  const { intervals, isLoading } = useMaintenanceIntervals({
    clusterId: undefined,
    active: active,
    page: pageNumber,
    size: pageSize
  });

  const { intervals: nextIntervals, isLoading: nextLoading } = useMaintenanceIntervals({
    clusterId: undefined,
    active: active,
    page: pageNumber + 1,
    size: pageSize
  });

  const { removeMaintenanceIntervalAsync } = useRemoveMaintenanceInterval();

  const handleRemoveMaintenanceInterval = async (maintenanceInterval: MaintenanceIntervalDto) => {
    deleteInterval.current = maintenanceInterval;
    open("confirmation")
  };

  if (isLoading || nextLoading) {
    return (
      <>
        <div className="p-3 flex flex-row items-center justify-between">
          <Skeleton className="h-8 w-[100px]" />
          <div className={"flex flex-row space-x-3"}>
            <Skeleton className="h-8 w-[300px]" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-md border">
            <div className="border-b">
              <div className="grid grid-cols-4 p-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-4 w-[100px]" />
                ))}
              </div>
            </div>
            <div>
              {Array.from({ length: pageSize }, (_, i) => i + 1).map((row) => (
                <div key={row} className="grid grid-cols-4 p-4 border-b">
                  {[1, 2, 3, 4].map((col) => (
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
      {deleteInterval.current && <ConfirmationDialog
        header={new Date(deleteInterval.current?.beginAt + 'Z') < new Date() ?
          t("maintenanceIntervals.removeMaintenanceInterval.confirmation.finish.header") :
          t("maintenanceIntervals.removeMaintenanceInterval.confirmation.delete.header")}
        text={new Date(deleteInterval.current?.beginAt + 'Z') < new Date() ?
          t("maintenanceIntervals.removeMaintenanceInterval.confirmation.finish.text") :
          t("maintenanceIntervals.removeMaintenanceInterval.confirmation.delete.text")}
        onConfirm={async () => {
          await removeMaintenanceIntervalAsync(deleteInterval.current!.id ?? '');
          deleteInterval.current = undefined;
        }}
      />}

      <div className="p-3 flex flex-row items-center justify-between">
        <Button onClick={() => (navigate("/maintenance/calendar"))}>
          <CalendarIcon />
          {t("maintenanceIntervals.calendar")}
        </Button>
        <div className={"flex flex-row space-x-3"}>
          <Switch checked={active} onCheckedChange={setActive} />
          <div className="space-y-0.5">
            <Label className="text-base">{t("maintenanceIntervals.active")}</Label>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns(t, handleRemoveMaintenanceInterval)}
        data={intervals ?? []}
        paginationEnabled={true}
      />

      <SimplePagination
        page={pageNumber}
        setPage={setPageNumber}
        hasMore={nextIntervals !== undefined && nextIntervals.length !== 0}
      />
    </>
  );
};

export default SystemIntervalList;
