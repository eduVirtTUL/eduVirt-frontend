import PageHeader from "@/components/PageHeader";
import { useVnicProfiles } from "@/data/network/useVnicProfiles";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useAddVnicProfileToPool } from "@/data/network/useAddVnicProfileToPool";
import { useRemoveVnicProfileFromPool } from "@/data/network/useRemoveVnicProfileFromPool";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  FilterIcon,
  FilterX,
  LoaderIcon,
  MoreHorizontal,
} from "lucide-react";
import DataTable from "@/pages/Courses/DataTable";
import { Column, ColumnDef, SortDirection } from "@tanstack/react-table";
import { VnicProfileDto } from "@/api";
import React from "react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import ShowVnicProfileDetailsModal from "@/components/Modals/ShowVnicProfileDetailsModal";
import { useDialog } from "@/stores/dialogStore";

const VnicProfilesPage: React.FC = () => {
  const { vnicProfiles, isLoading } = useVnicProfiles();
  const { addVnicProfileToPoolAsync } = useAddVnicProfileToPool();
  const { removeVnicProfileFromPoolAsync } = useRemoveVnicProfileFromPool();

  const [selectedFiltering, setSelectedFiltering] =
    React.useState<string>("allItems");
  const { open } = useDialog();

  const handleAddVnicProfile = async (vnicProfileId?: string) => {
    if (vnicProfileId) {
      await addVnicProfileToPoolAsync(vnicProfileId);
    }
  };

  const handleRemoveVnicProfileFromPool = async (vnicProfileId?: string) => {
    if (vnicProfileId) {
      await removeVnicProfileFromPoolAsync(vnicProfileId);
    }
  };

  const chooseSortingArrow = (param: false | SortDirection) => {
    if (param === "asc") {
      return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    if (param === "desc") {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  const handleSortingToggling = (column: Column<VnicProfileDto>) => {
    if (column.getIsSorted() === false) {
      column.toggleSorting(false);
    } else if (column.getIsSorted() === "asc") {
      column.toggleSorting(true);
    } else {
      column.clearSorting();
    }
  };

  const columns: ColumnDef<VnicProfileDto>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => handleSortingToggling(column)}>
            Vnic profile name
            {chooseSortingArrow(column.getIsSorted())}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ml-8">{row.original.name}</div>;
      },
    },
    {
      accessorKey: "networkName",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => handleSortingToggling(column)}>
            Network name
            {chooseSortingArrow(column.getIsSorted())}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ml-8">{row.original.networkName}</div>;
      },
    },
    {
      accessorKey: "networkVlanId",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => handleSortingToggling(column)}>
            Network VLAN ID
            {chooseSortingArrow(column.getIsSorted())}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="ml-14">{row.original.networkVlanId}</div>;
      },
    },
    {
      accessorKey: "inPool",
      header: ({ column }) => {
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">
                In pool
                {column.getFilterValue() == null ? (
                  <FilterIcon className="ml-2 h-4 w-4" />
                ) : (
                  <FilterX className="ml-2 h-4 w-4" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <RadioGroup value={selectedFiltering}>
                <div
                  className="flex items-center space-x-2"
                  onClick={() => {
                    setSelectedFiltering("allItems");
                    column.setFilterValue(null);
                  }}
                >
                  <RadioGroupItem value="allItems" id="r1" />
                  <Label htmlFor="r1">All</Label>
                </div>
                <div
                  className="flex items-center space-x-2"
                  onClick={() => {
                    setSelectedFiltering("inPoolItem");
                    column.setFilterValue(true);
                  }}
                >
                  <RadioGroupItem value="inPoolItem" id="r2" />
                  <Label htmlFor="r2">In pool</Label>
                </div>
                <div
                  className="flex items-center space-x-2"
                  onClick={() => {
                    setSelectedFiltering("notInPoolItem");
                    column.setFilterValue(false);
                  }}
                >
                  <RadioGroupItem value="notInPoolItem" id="r3" />
                  <Label htmlFor="r3">Not in pool</Label>
                </div>
              </RadioGroup>
            </PopoverContent>
          </Popover>
        );
      },
      cell: ({ row }) => {
        const vnicProfile = row.original;

        return (
          <Checkbox
            disabled={true}
            checked={vnicProfile.inPool}
            className="ml-10"
          />
        );
      },
      enableGlobalFilter: false,
    },
    {
      id: "actions",
      header: ({ table }) => {
        return (
          <Input
            className="w-full"
            placeholder="Search by value"
            onChange={(e) => table.setGlobalFilter(e.target.value)}
          />
        );
      },
      cell: ({ row }) => {
        const vnicProfile = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/*TODO fix className in scaling*/}
              <Button variant="ghost" className="h-8 w-8 p-0 ml-40">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Button
                  className={"h-full w-full"}
                  variant="ghost"
                  disabled={vnicProfile.inPool}
                  onClick={() => handleAddVnicProfile(vnicProfile.id)}
                >
                  Add to pool
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  className={"h-full w-full"}
                  variant="ghost"
                  disabled={!vnicProfile.inPool}
                  onClick={() =>
                    handleRemoveVnicProfileFromPool(vnicProfile.id)
                  }
                >
                  Remove from pool
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  className={"h-full w-full"}
                  variant="ghost"
                  onClick={() => open("showVnicProfileDetails")}
                >
                  Show info
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) {
    return <LoaderIcon className="animate-spin size-10" />;
  }

  /// TODO pagination
  /// TODO add displaying extended info about selected vnic profile (isInUse, maybe id etc...)
  return (
    <>
      <ShowVnicProfileDetailsModal />
      <PageHeader title="Vnic profiles" />

      <div className="pb-5">
        <Button asChild>
          <Link to={"/networks/vlans"}>VLAN ranges</Link>
        </Button>
      </div>

      <DataTable data={vnicProfiles ?? []} columns={columns} />
    </>
  );
};

export default VnicProfilesPage;
