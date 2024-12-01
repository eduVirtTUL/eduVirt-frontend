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
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import DataTable from "@/pages/Courses/DataTable.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {VnicProfileDto} from "@/api";
import React from "react";

const VnicProfilesPage: React.FC = () => {
    const {vnicProfiles, isLoading} = useVnicProfiles();
    const {addVnicProfileToPoolAsync} = useAddVnicProfileToPool();
    const {removeVnicProfileFromPoolAsync} = useRemoveVnicProfileFromPool();

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
        //TODO add sorting for other columns / multi sort
        {accessorKey: "networkName", header: "Network name"},
        {accessorKey: "networkVlanId", header: "Network VLAN ID"},
        //TODO add filtering for flag values
        {
            header: "In pool",
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
                            <DropdownMenuItem>
                                <Button variant="ghost"
                                        disabled={vnicProfile.inPool}
                                        onClick={() => handleAddVnicProfile(vnicProfile.id)}
                                >
                                    Add to pool
                                </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Button variant="ghost"
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