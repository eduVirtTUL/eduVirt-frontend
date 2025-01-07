import { DetailedResourceGroupPoolDto } from "@/api";
import DataTable from "@/components/DataTable";
import CreatePoolModal from "@/components/Modals/CreatePoolModal";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useResourceGroupPools } from "@/data/rgPool/useResourceGroupPools";
import { useDialog } from "@/stores/dialogStore";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const columns: ColumnDef<DetailedResourceGroupPoolDto>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "course.name", header: "Course" },
  {
    accessorFn: (row) => row.resourceGroups?.length ?? 0,
    header: "Resource Groups",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rgPool = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit pool</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/pools/${rgPool.id}`}>Pool Details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const ResourceGroupPoolsPage: React.FC = () => {
  const { open } = useDialog();
  const { t } = useTranslation();
  const { resourceGroupPools } = useResourceGroupPools();
  return (
    <>
      <CreatePoolModal />
      <PageHeader title={t("resourceGroupPools.title")} />
      <div className="flex flex-row gap-2 pb-5">
        <Button onClick={() => open("createPool")}>Create pool</Button>
      </div>
      <DataTable data={resourceGroupPools ?? []} columns={columns} />
    </>
  );
};

export default ResourceGroupPoolsPage;
