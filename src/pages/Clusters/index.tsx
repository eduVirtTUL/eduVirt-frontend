import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ClusterGeneralDto } from "@/api";
import PageHeader from "@/components/PageHeader.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import {MoreHorizontal} from "lucide-react";
import { Link } from "react-router";
import ClusterList from "@/pages/Clusters/ClusterList.tsx";

const columns: ColumnDef<ClusterGeneralDto>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "comment",
    header: "Comment",
  },
  {
    accessorKey: "hostCount",
    header: "Hosts",
  },
  {
    accessorKey: "vmCount",
    header: "VMs",
  },
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
                <Link to={`/limits/${cluster.id}`}>View cluster limits</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

const ClustersPage: React.FC = () => {
  return (
    <>
      <PageHeader title="Clusters" />
      <ClusterList columns={columns} />
    </>
  );
};

export default ClustersPage;
