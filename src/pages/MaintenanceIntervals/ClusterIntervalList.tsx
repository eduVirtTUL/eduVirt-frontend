import {Link, useNavigate, useParams} from "react-router";
import { ColumnDef } from "@tanstack/react-table";
import { MaintenanceIntervalDto } from "@/api";
import DataTable from "@/components/DataTable";
import { CalendarIcon, MoreHorizontal, Undo2 } from "lucide-react";
import React, {useEffect, useState} from "react";
import PageHeader from "@/components/PageHeader";
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
import { useMaintenanceIntervals } from "@/data/maintenance/useMaintenanceIntervals";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { Skeleton } from "@/components/ui/skeleton";
import SimplePagination from "@/components/SimplePagination";
import {jwtDecode} from "jwt-decode";
import {toast} from "sonner";

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
  const navigate = useNavigate();

  const [ pageNumber, setPageNumber ] = useState<number>(0);
  const [ pageSize ] = useState<number>(10);

  const { id } = useParams();
  const [ active, setActive ] = useState<boolean>(true);

  const { intervals, isLoading } = useMaintenanceIntervals({
    clusterId: id,
    active: active,
    page: pageNumber,
    size: pageSize
  });

  const { intervals: nextIntervals, isLoading: nextLoading } = useMaintenanceIntervals({
    clusterId: id,
    active: active,
    page: pageNumber,
    size: pageSize
  });

  const { removeMaintenanceIntervalAsync } = useRemoveMaintenanceInterval();

  const handleRemoveMaintenanceInterval = async (
      maintenanceInterval: string
  ) => {
    await removeMaintenanceIntervalAsync(maintenanceInterval);
  };

  useEffect(() => {
    const checkAuthorization = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate(-1);
        return;
      }

      const decoded = jwtDecode<{ groups: string[] }>(token);
      const userGroups = decoded.groups;

      if (!userGroups.includes("/ovirt-administrator")) {
        toast.error(t("general.error.not.authorized"));
        navigate(-1);
      }
    }

    checkAuthorization();
  }, [navigate, t]);

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
      <div className="flex justify-start">
        <Link to={"/maintenance"}>
          <Button variant="outline" size="icon" className="mr-5">
            <Undo2/>
          </Button>
        </Link>
        <PageHeader
          title={t("maintenanceIntervals.cluster.title")}
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
        data={intervals ?? []}
      />

      <SimplePagination
          page={pageNumber}
          setPage={setPageNumber}
          hasMore={nextIntervals !== undefined && nextIntervals.length !== 0}
      />
    </>
  );
};

export default ClusterIntervalList;
