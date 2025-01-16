import { useTranslation } from "react-i18next";
import { useMetrics } from "@/data/metrics/useMetrics";
import { useRemoveMetric } from "@/data/metrics/useRemoveMetric";
import { useDialog } from "@/stores/dialogStore";
import i18next, { TFunction } from "i18next";
import { ColumnDef } from "@tanstack/react-table";
import { MetricDto } from "@/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button} from "@/components/ui/button";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import React, {useEffect, useRef, useState} from "react";
import CreateMetricModal from "@/components/Modals/CreateMetricModal";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import SimplePagination from "@/components/SimplePagination";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { getCategory } from "@/utils/unitUtils.js";
import {RouteHandle} from "@/AuthGuard";

const columns = (
  t: TFunction,
  onDelete: (id: string) => void
): ColumnDef<MetricDto>[] => [
  { accessorKey: "name", header: t("metrics.table.columns.name") },
  {
    accessorKey: "category", header: t("metrics.table.columns.category") ,
    cell: (category) => {
      const value = getCategory(category.getValue() as string);
      {/* @ts-expect-error this doesn't impact the page */}
      return value.label ? t(value.label) : "";
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
                  {t("metrics.table.openMenu")}
                </span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onDelete(metric.id!)}
              >
                {t("metrics.table.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
]

const MetricsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [ pageNumber, setPageNumber ] = useState<number>(0);
  const [ pageSize ] = useState<number>(10);

  const { open } = useDialog();
  const { metrics, isLoading } = useMetrics({page: pageNumber, size: pageSize});
  const { metrics: nextMetrics, isLoading: nextLoading } = useMetrics({page: pageNumber + 1, size: pageSize});
  const deleteId = useRef<string>();

  const { removeMetricAsync } = useRemoveMetric();

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

  const handleRemoveMetric = (id: string) => {
    deleteId.current = id;
    open("confirmation");
  };

  if (isLoading || nextLoading) {
    return (
      <>
        <PageHeader title={t("metrics.title")}/>

        <div className="pb-5">
          <Skeleton className="h-8 w-[100px]"/>
        </div>

        <div className="space-y-6">
          <div className="rounded-md border">
            <div className="border-b">
              <div className="grid grid-cols-2 p-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-4 w-[100px]"/>
                ))}
              </div>
            </div>
            <div>
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="grid grid-cols-2 p-4 border-b">
                  {[1, 2].map((col) => (
                    <Skeleton key={col} className="h-4 w-[100px]"/>
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
      <PageHeader title={t("metrics.title")}/>

      <CreateMetricModal />
      <ConfirmationDialog
        header={t("metrics.removeMetric.confirmation.header")}
        text={t("metrics.removeMetric.confirmation.text")}
        onConfirm={async () => {
          await removeMetricAsync(deleteId.current!);
          deleteId.current = undefined;
        }}
      />

      <div className="pb-5">
        <Button onClick={() => { open("createMetric"); }}>
          <PlusIcon />
          {t("metrics.add")}
        </Button>
      </div>

      <DataTable columns={
        columns(t, handleRemoveMetric)}
                 data={metrics ?? []}
      />

      <SimplePagination
        page={pageNumber}
        setPage={setPageNumber}
        hasMore={nextMetrics !== undefined && nextMetrics.length !== 0}
      />
    </>
  );
};

export default MetricsPage;

export const handle: RouteHandle = {
  roles: ["administrator"],
};

export const meta = () => {
  return [{ title: i18next.t("pageTitles.metrics") }];
};