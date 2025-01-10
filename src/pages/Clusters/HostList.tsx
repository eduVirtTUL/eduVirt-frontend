import React, { useCallback, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { HostDto } from "@/api";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { CardContent } from "@/components/ui/card";
import { useHosts } from "@/data/cluster/useHosts";
import { Skeleton } from "@/components/ui/skeleton";
import SimpleDataTable from "@/components/SimpleDataTable";
import SimplePagination from "@/components/SimplePagination";
import {ArrowDown, ArrowUp, ArrowUpDown, ExternalLinkIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Link} from "react-router";

type HostListProps = {
  clusterId: string;
  clusterName: string;
};

const columns = (
  t: TFunction,
  handleSort: (column: string) => void,
  chooseSortingArrow: (column: string) => JSX.Element
): ColumnDef<HostDto>[] => [
  {
    accessorKey: "name",
    header: () => {
      return (
          <Button variant="ghost" onClick={() => handleSort("name")}>
            {t("hosts.table.columns.name")}
            {(chooseSortingArrow("name"))}
          </Button>
      );
    }
  },
  { accessorKey: "address", header: t("hosts.table.columns.domainName") },
  { accessorKey: "cpus", header: t("hosts.table.columns.cpuCount") },
  { accessorKey: "memory", header: t("hosts.table.columns.memorySize") },
];

const HostList: React.FC<HostListProps> = ({
  clusterId, clusterName
}) => {
  const { t } = useTranslation();

  const [ pageNumber, setPageNumber ] = useState<number>(0);
  const [ pageSize ] = useState<number>(10);

  const [ sortColumn, setSortColumn ] = useState<string | null>(null);
  const [ sortDirection, setSortDirection ] = useState<"asc" | "desc" | null>(null);

  const { hosts, isLoading } = useHosts({
    id: clusterId,
    page: pageNumber,
    size: pageSize,
    sort: sortColumn === null ? [] : [ `${sortColumn},${sortDirection}` ]
  });

  const { hosts: nextHosts, isLoading: nextLoading } = useHosts({
    id: clusterId,
    page: pageNumber + 1,
    size: pageSize,
    sort: sortColumn === null ? [] : [ `${sortColumn},${sortDirection}` ]
  });

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

  if (isLoading || nextLoading) {
    return (
      <>
        <div className={"flex items-center justify-start pt-4 pl-4"}>
          <Skeleton className="h-10 w-1/4"/>
        </div>
        <div className="space-y-6 p-4">
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
      <CardContent className={"p-4"}>
        <div className={"flex items-center justify-start pb-4"}>
          <Button
            className={"w-1/4"}
            variant="secondary"
            onClick={(e) => e.stopPropagation()}
            asChild
          >

            <Link
              target="_blank"
              to={`https://vteste1.vlab.it.p.lodz.pl/ovirt-engine/webadmin/?locale=en_US#clusters-hosts;name=${clusterName}`}
            >
              <ExternalLinkIcon/>
              {t("clusters.details.ovirt.host")}
            </Link>
          </Button>
        </div>

        <SimpleDataTable
            data={hosts ?? []}
            columns={columns(t, handleSort, chooseSortingArrow)}
        />

        <SimplePagination
          page={pageNumber}
          setPage={setPageNumber}
          hasMore={nextHosts !== undefined && nextHosts.length !== 0}
        />
      </CardContent>
    </>
  );
};

export default HostList;
