import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SystemIntervalList from "@/pages/MaintenanceIntervals/SystemIntervalList";
import ClusterList from "@/pages/Clusters/ClusterList";
import { ColumnDef } from "@tanstack/react-table";
import { ClusterGeneralDto } from "@/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router";
import React from "react";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";

const columns = (
    t: TFunction
): ColumnDef<ClusterGeneralDto>[] => [
  { accessorKey: "name", header: t("clusters.table.columns.name") },
  { accessorKey: "description", header: t("clusters.table.columns.description") },
  { accessorKey: "comment", header: t("clusters.table.columns.comment") },
  {
    id: "action",
    cell: ({ row }) => {
      const cluster = row.original;

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
                <DropdownMenuItem asChild>
                  <Link to={`/maintenance/${cluster.id}`}>
                    {t("clusters.table.showIntervals")}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
      );
    },
  },
];

const MaintenancePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t("maintenanceIntervals.title")}/>
      <Tabs defaultValue="system">
        <TabsList className={"grid w-full grid-cols-2"}>
          <TabsTrigger value="system">{t("maintenanceIntervals.system.name")}</TabsTrigger>
          <TabsTrigger value="cluster">{t("maintenanceIntervals.cluster.name")}</TabsTrigger>
        </TabsList>
        <TabsContent value="system">
          <SystemIntervalList active={true}/>
        </TabsContent>
        <TabsContent value="cluster">
          <ClusterList columns={columns(t)}/>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default MaintenancePage;
