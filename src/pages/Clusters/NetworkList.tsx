import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { ColumnDef } from "@tanstack/react-table";
import { HostDto } from "@/api";
import SimpleDataTable from "@/components/SimpleDataTable";
import { CardContent } from "@/components/ui/card";
import { useNetworks } from "@/data/cluster/useNetworks";
import { Skeleton } from "@/components/ui/skeleton";
import SimplePagination from "@/components/SimplePagination";
import {Button} from "@/components/ui/button";
import {Link} from "react-router";
import {ExternalLinkIcon} from "lucide-react";

type NetworkListProps = {
    clusterId: string;
    clusterName: string;
};

const columns = (
  t: TFunction
): ColumnDef<HostDto>[] => [
    { accessorKey: "name", header: t("networks.table.columns.name") },
    { accessorKey: "description", header: t("networks.table.columns.description") },
    { accessorKey: "comment", header: t("networks.table.columns.comment") },
    { accessorKey: "status", header: t("networks.table.columns.status") },
];

const NetworkList: React.FC<NetworkListProps> = ({ clusterId, clusterName }) => {
  const { t } = useTranslation();

  const [ pageNumber, setPageNumber ] = useState<number>(0);
  const [ pageSize ] = useState<number>(10);

  const { networks, isLoading } = useNetworks({id: clusterId, page: pageNumber, size: pageSize});
  const { networks: nextNetworks, isLoading: nextLoading } = useNetworks({id: clusterId, page: pageNumber + 1, size: pageSize});

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
              to={`https://vteste1.vlab.it.p.lodz.pl/ovirt-engine/webadmin/?locale=en_US#clusters-logical_networks;name=${clusterName}`}
            >
              <ExternalLinkIcon/>
              {t("clusters.details.ovirt.network")}
            </Link>
          </Button>
        </div>

        <SimpleDataTable
          data={networks ?? []}
          columns={columns(t)}
        />

        <SimplePagination
          page={pageNumber}
          setPage={setPageNumber}
          hasMore={nextNetworks !== undefined && nextNetworks.length !== 0}
        />
      </CardContent>
    </>
  );
};

export default NetworkList;