import { ColumnDef } from "@tanstack/react-table";
import { ClusterGeneralDto } from "@/api";
import { useClusters } from "@/data/cluster/useClusters";
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SimpleDataTable from "@/components/SimpleDataTable";
import SimplePagination from "@/components/SimplePagination";

type ClusterListProps = {
  columns: ColumnDef<ClusterGeneralDto>[];
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null
};

const ClusterList: React.FC<ClusterListProps> = ({ columns, sortColumn, sortDirection }) => {
  const [ pageNumber, setPageNumber ] = useState<number>(0);
  const [ pageSize ] = useState<number>(10);

  const { clusters, isLoading } = useClusters({
      page: pageNumber,
      size: pageSize,
      sort: sortColumn === null ? [] : [ `${sortColumn},${sortDirection}` ]
  });

  const { clusters: nextClusters, isLoading: nextLoading } = useClusters({
      page: pageNumber + 1,
      size: pageSize,
      sort: sortColumn === null ? [] : [ `${sortColumn},${sortDirection}` ]
  });

  if (isLoading || nextLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border">
          <div className="border-b">
            <div className="grid grid-cols-5 p-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-[100px]" />
              ))}
            </div>
          </div>
            <div>
              {Array.from({ length: pageSize }, (_, i) => i + 1).map((row) => (
                <div key={row} className="grid grid-cols-5 p-4 border-b">
                  {[1, 2, 3, 4, 5].map((col) => (
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
      <SimpleDataTable
        columns={columns}
        data={clusters ?? []}
      />

      <SimplePagination
        page={pageNumber}
        setPage={setPageNumber}
        hasMore={nextClusters !== undefined && nextClusters.length !== 0}
      />
    </>
  );
};

export default ClusterList;
