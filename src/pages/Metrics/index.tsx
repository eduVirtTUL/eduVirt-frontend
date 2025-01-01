import { useTranslation } from "react-i18next";
import { useMetrics } from "@/data/metrics/useMetrics";
import { useRemoveMetric } from "@/data/metrics/useRemoveMetric";
import { useDialog } from "@/stores/dialogStore";
import { TFunction } from "i18next";
import { ColumnDef } from "@tanstack/react-table";
import { MetricDto } from "@/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button} from "@/components/ui/button";
import { LoaderIcon, MoreHorizontal, PlusIcon } from "lucide-react";
import React from "react";
import CreateMetricModal from "@/pages/Metrics/modals/CreateMetricModal";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";

const columns = (
  t: TFunction,
  onDelete: (id: string) => void
): ColumnDef<MetricDto>[] => [
  { accessorKey: "name", header: t("metrics.table.columns.name") },
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
  const { open } = useDialog();
  const { metrics, isLoading } = useMetrics();
  const { removeMetricAsync } = useRemoveMetric();

  const handleRemoveMetric = async (id: string) => {
    await removeMetricAsync(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen my-auto">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <>
      <PageHeader title={t("metrics.title")} />

      <CreateMetricModal />

      <div className="pb-5">
        <Button onClick={() => { open("createMetric"); }}>
          <PlusIcon />
          {t("metrics.add")}
        </Button>
      </div>

      <DataTable columns={
        columns(t, handleRemoveMetric)}
                 data={metrics?.items ?? []}
      />
    </>
  );
}

export default MetricsPage;