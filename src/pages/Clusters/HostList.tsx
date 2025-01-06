import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { HostDto } from "@/api";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { CardContent } from "@/components/ui/card";
import { useHosts } from "@/data/cluster/useHosts";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "@/pages/Courses/DataTable";
import SimplePagination from "@/components/SimplePagination";

type HostListProps = {
  clusterId: string;
};

const columns = (
  t: TFunction
): ColumnDef<HostDto>[] => [
  { accessorKey: "name", header: t("hosts.table.columns.name") },
  { accessorKey: "address", header: t("hosts.table.columns.domainName") },
  { accessorKey: "cpus", header: t("hosts.table.columns.cpuCount") },
  { accessorKey: "memory", header: t("hosts.table.columns.memorySize") },
];

const HostList: React.FC<HostListProps> = ({ clusterId }) => {
  const { t } = useTranslation();

  const [ pageNumber, setPageNumber ] = useState<number>(0);
  const [ pageSize ] = useState<number>(10);

  const { hosts, isLoading } = useHosts({id: clusterId, page: pageNumber, size: pageSize});
  const { hosts: nextHosts, isLoading: nextLoading } = useHosts({id: clusterId, page: pageNumber + 1, size: pageSize});

  if (isLoading || nextLoading) {
    return (
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
    );
  }

  return (
    <>
      <CardContent className={"p-4"}>
        <DataTable data={hosts ?? []} columns={columns(t)}/>

        <SimplePagination
          page={pageNumber}
          setPage={setPageNumber}
          hasMore={nextHosts !== undefined && nextHosts.length === 0}
        />
      </CardContent>
    </>
  );
};

export default HostList;
