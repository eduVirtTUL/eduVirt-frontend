import { DetailedResourceGroupPoolDto } from "@/api";
import { RouteHandle } from "@/AuthGuard";
import DataTable from "@/components/DataTable";
import CreatePoolModal from "@/components/Modals/CreatePoolModal";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useResourceGroupPools } from "@/data/rgPool/useResourceGroupPools";
import { useDialog } from "@/stores/dialogStore";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";

const columns = (t: TFunction): ColumnDef<DetailedResourceGroupPoolDto>[] => [
  { accessorKey: "name", header: t("resourceGroupPools.table.name") },
  { accessorKey: "course.name", header: t("resourceGroupPools.table.course") },
  {
    accessorFn: (row) => row.resourceGroups?.length ?? 0,
    header: t("resourceGroupPools.table.resourceGroups"),
  },
];

const ResourceGroupPoolsPage: React.FC = () => {
  const { open } = useDialog();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "0");
  const size = parseInt(searchParams.get("size") ?? "10");
  const { resourceGroupPools } = useResourceGroupPools(page, size);
  const nav = useNavigate();

  return (
    <>
      <CreatePoolModal />
      <PageHeader title={t("resourceGroupPools.title")} />
      <div className="flex flex-row gap-2 pb-5">
        <Button onClick={() => open("createPool")}>
          <PlusIcon />
          {t("resourceGroupPools.createPool")}
        </Button>
      </div>
      <DataTable
        data={resourceGroupPools?.items ?? []}
        columns={columns(t)}
        onRowClick={(row) => {
          const rgPool = row.original;
          nav(`/pools/${rgPool.id}`);
        }}
      />
      <Pagination className="mt-5">
        <PaginationContent>
          {page > 0 && (
            <PaginationItem>
              <PaginationPrevious
                href={`/pools?page=${page - 1}&size=${size}`}
              />
            </PaginationItem>
          )}

          {page > 0 && (
            <PaginationItem>
              <PaginationLink href={`/pools?page=${page - 1}&size=${size}`}>
                {page}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink href={`/pools?page=${page}&size=${size}`} isActive>
              {page + 1}
            </PaginationLink>
          </PaginationItem>
          {(resourceGroupPools?.page?.totalPages ?? 0) > page + 1 && (
            <PaginationItem>
              <PaginationLink href={`/pools?page=${page + 1}&size=${size}`}>
                {page + 2}
              </PaginationLink>
            </PaginationItem>
          )}
          {resourceGroupPools?.page?.totalPages !== page + 1 && (
            <PaginationItem>
              <PaginationNext href={`/pools?page=${page + 1}&size=${size}`} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default ResourceGroupPoolsPage;

export const handle: RouteHandle = {
  roles: ["administrator", "teacher"],
};
