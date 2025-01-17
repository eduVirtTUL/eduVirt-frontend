import React, { useCallback, useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ClusterGeneralDto } from "@/api";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router";
import ClusterList from "@/pages/Clusters/ClusterList";
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
  { accessorKey: "hostCount", header: t("clusters.table.columns.hosts") },
  { accessorKey: "vmCount", header: t("clusters.table.columns.vms") },
  {
    id: "action",
    cell: ({ row }) => {
      const cluster = row.original;

      return (
        <>
          <div className="flex justify-end">
            <Link
              to={`/limits/${cluster.id}`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
            >
              <ExternalLink className="h-4 w-4"/>
              <span className="sr-only">{t("clusters.table.viewLimits")}</span>
            </Link>
          </div>
        </>
      );
    },
  },
];

const ClustersPage: React.FC = () => {
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
        toast.error(t("general.error.not.authorized"));
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
      <PageHeader title={t("clusters.title")} />
      <ClusterList
        columns={columns(t, handleSort, chooseSortingArrow)}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />
    </>
  );
};

export default ClustersPage;

export const handle: RouteHandle = {
  roles: ["administrator"],
};

export const meta = () => {
  return [{ title: i18next.t("pageTitles.clusters") }];
};