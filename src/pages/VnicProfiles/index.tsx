import PageHeader from "@/components/PageHeader.tsx";
import {useVnicProfiles} from "@/data/network/useVnicProfiles.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useAddVnicProfileToPool} from "@/data/network/useAddVnicProfileToPool.ts";
import {useRemoveVnicProfileFromPool} from "@/data/network/useRemoveVnicProfileFromPool.ts";
import {Link} from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {ArrowUpDown, FilterIcon, MoreHorizontal} from "lucide-react";
import DataTable from "@/pages/Courses/DataTable.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {VnicProfileDto} from "@/api";
import React from "react";
import {Label} from "@/components/ui/label.tsx";
import {Popover, PopoverContent} from "@/components/ui/popover.tsx";
import {PopoverTrigger} from "@radix-ui/react-popover";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";

const VnicProfilesPage: React.FC = () => {
    const {vnicProfiles, isLoading} = useVnicProfiles();
    const {addVnicProfileToPoolAsync} = useAddVnicProfileToPool();
    const {removeVnicProfileFromPoolAsync} = useRemoveVnicProfileFromPool();

    const [selectedFiltering, setSelectedFiltering] = React.useState<string>("allItems");


    const handleAddVnicProfile = (async (vnicProfileId?: string) => {
        if (vnicProfileId) {
            await addVnicProfileToPoolAsync(vnicProfileId);
        }
    });

    const handleRemoveVnicProfileFromPool = (async (vnicProfileId?: string) => {
        if (vnicProfileId) {
            await removeVnicProfileFromPoolAsync(vnicProfileId);
        }
    });

    //TODO multisort???

    const columns: ColumnDef<VnicProfileDto>[] = [
        {
            accessorKey: "name",
            header: ({column}) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Vnic profile name
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                );
            },
        },
        {
            accessorKey: "networkName",
            header: ({column}) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Network name
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                );
            },
        },
        {
            accessorKey: "networkVlanId",
            header: ({column}) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Network VLAN ID
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                );
            },
        },
        //TODO add filtering for flag values
        {
            id: "inPoolFlag",
            header: ({column}) => {
/*                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                {/!*<span className="sr-only">Open menu</span>*!/}
                                In pool
                                <FilterIcon className="ml-2 h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <div>
                                    <Checkbox
                                        id="inPoolFilteringFlag"
                                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                                    />
                                    <Label
                                        htmlFor="inPoolFilteringFlag"
                                    >
                                        In pool
                                    </Label>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <div>
                                    <Checkbox id="notInPoolFilteringFlag"/>
                                    <Label
                                        htmlFor="notInPoolFilteringFlag"
                                    >
                                        Not in pool
                                    </Label>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );*/
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                            >
                                In pool
                                <FilterIcon className="ml-2 h-4 w-4"/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <RadioGroup value={selectedFiltering}>
                                <div
                                    className="flex items-center space-x-2"
                                    onClick={() => setSelectedFiltering("allItems")}
                                >
                                    <RadioGroupItem value="allItems" id="r1"/>
                                    <Label htmlFor="r1">All</Label>
                                </div>
                                <div
                                    className="flex items-center space-x-2"
                                    onClick={() => setSelectedFiltering("inPoolItem")}
                                >
                                    <RadioGroupItem value="inPoolItem" id="r2"/>
                                    <Label htmlFor="r2">In pool</Label>
                                </div>
                                <div
                                    className="flex items-center space-x-2"
                                    onClick={() => {
                                        setSelectedFiltering("notInPoolItem");
                                        //TODO merge main into this branch
                                        // column.tog("inPoolItem");
                                    }}
                                >
                                    <RadioGroupItem value="notInPoolItem" id="r3"/>
                                    <Label htmlFor="r3">Not in pool</Label>
                                </div>
                            </RadioGroup>
                        </PopoverContent>
                    </Popover>
                );
            },
            cell: ({row}) => {
                const vnicProfile = row.original;

                return (
                    <Checkbox disabled={true} checked={vnicProfile.inPool}/>
                );
            },
            
        },
        {
            id: "actions",
            cell: ({row}) => {
                const vnicProfile = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Button className={"h-full w-full"}
                                        variant="ghost"
                                        disabled={vnicProfile.inPool}
                                        onClick={() => handleAddVnicProfile(vnicProfile.id)}
                                >
                                    Add to pool
                                </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Button className={"h-full w-full"}
                                        variant="ghost"
                                        disabled={!vnicProfile.inPool}
                                        onClick={() => handleRemoveVnicProfileFromPool(vnicProfile.id)}
                                >
                                    Remove from pool
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    /// TODO pagination
    /// TODO add displaying extended info about selected vnic profile (isInUse, maybe id etc...)
    return (
        <>
            <PageHeader title="Vnic profiles"/>

            <div className="pb-5">
                <Button asChild>
                    <Link to={'/networks/vlans'}>VLAN ranges</Link>
                </Button>
            </div>

            <DataTable data={vnicProfiles ?? []} columns={columns}/>
        </>
    );
};

export default VnicProfilesPage;