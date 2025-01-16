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
import {ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal} from "lucide-react";
import { Link, useNavigate } from "react-router";
import React, {useCallback, useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import i18next, { TFunction } from "i18next";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import {RouteHandle} from "@/AuthGuard";

const columns = (
    t: TFunction,
    handleSort: (column: string) => void,
    chooseSortingArrow: (column: string) => JSX.Element
): ColumnDef<ClusterGeneralDto>[] => [
  {
    accessorKey: "name",
    header: () => {
      return (
          <Button variant="ghost" onClick={() => handleSort("name")}>
            {t("clusters.table.columns.name")}
            {(chooseSortingArrow("name"))}
          </Button>
      );
    }
  },
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
                <Link to={`/maintenance/clusters/${cluster.id}`}>
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
  const navigate = useNavigate();

  const [ sortColumn, setSortColumn ] = useState<string | null>(null);
  const [ sortDirection, setSortDirection ] = useState<"asc" | "desc" | null>(null);

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
        toast.error("You don't have required privileges to see this page.");
        navigate(-1);
      }
    }

    checkAuthorization();
  }, [navigate, t]);

  const handleSort = useCallback((column: string) => {
    if (sortColumn === column) {
      setSortDirection((prevDirection) => prevDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }, [sortColumn]);

  const chooseSortingArrow = (column: string) => {
    if (column === sortColumn && sortDirection === "desc")
      return <ArrowDown className="ml-2 h-4 w-4" />;
    else if (column === sortColumn && sortDirection === "asc")
      return <ArrowUp className="ml-2 h-4 w-4" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

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
          <ClusterList
            columns={columns(t, handleSort, chooseSortingArrow)}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default MaintenancePage;

export const handle: RouteHandle = {
  roles: ["administrator"],
};

export const meta = () => {
  return [{ title: i18next.t("pageTitles.maintenanceIntervals") }];
};