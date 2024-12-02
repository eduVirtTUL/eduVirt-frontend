import { ResourceGroupDto } from "@/api";
import DataTable from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useResourceGroups } from "@/data/resourceGroup/useResourceGroups";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const columns: ColumnDef<ResourceGroupDto>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "stateless", header: "Stateless" },
  {
    id: "actions",
    cell: ({ row }) => {
      const rg = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/rg/${rg.id}`}>Details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const ResourceGroupsPage: React.FC = () => {
  const { t } = useTranslation();
  const { resourceGroups } = useResourceGroups();

  return (
    <>
      <PageHeader title={t("menu.resourceGroups")} />
      <DataTable columns={columns} data={resourceGroups ?? []} />
    </>
  );
};

export default ResourceGroupsPage;
