import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { ColumnDef } from "@tanstack/react-table";
import { HostDto } from "@/api";
import DataTable from "@/pages/Courses/DataTable";
import { CardContent } from "@/components/ui/card";
import { useNetworks } from "@/data/cluster/useNetworks";
import { Skeleton } from "@/components/ui/skeleton";
import SimplePagination from "@/components/SimplePagination";

type NetworkListProps = {
    clusterId: string;
};

const columns = (
  t: TFunction
): ColumnDef<HostDto>[] => [
    { accessorKey: "name", header: t("networks.table.columns.name") },
    { accessorKey: "description", header: t("networks.table.columns.description") },
    { accessorKey: "comment", header: t("networks.table.columns.comment") },
    { accessorKey: "status", header: t("networks.table.columns.status") },
];

const NetworkList: React.FC<NetworkListProps> = ({ clusterId }) => {
  const { t } = useTranslation();

  const [ pageNumber, setPageNumber ] = useState<number>(0);
  const [ pageSize ] = useState<number>(10);

  const { networks, isLoading } = useNetworks({id: clusterId, page: pageNumber, size: pageSize});
  const { networks: nextNetworks, isLoading: nextLoading } = useNetworks({id: clusterId, page: pageNumber + 1, size: pageSize});

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
        <DataTable data={networks ?? []} columns={columns(t)}/>

        <SimplePagination
          page={pageNumber}
          setPage={setPageNumber}
          hasMore={nextNetworks !== undefined && nextNetworks.length === 0}
        />
      </CardContent>
    </>
  );
};

export default NetworkList;