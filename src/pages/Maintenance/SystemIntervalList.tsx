import {useMaintenanceIntervals} from "@/data/maintenance/useMaintenanceIntervals.ts";
import React, {useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {MaintenanceIntervalDto} from "@/api";
import DataTable from "@/components/DataTable.tsx";
import {LoaderIcon, MoreHorizontal, PlusIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router";
import {Switch} from "@/components/ui/switch.tsx";
import {Label} from "@/components/ui/label.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useRemoveMaintenanceInterval} from "@/data/maintenance/useRemoveMaintenanceInterval.ts";

type SystemIntervalListProps = {
    active: boolean
}

const SystemIntervalList: React.FC<SystemIntervalListProps> = () => {
    const [active, setActive] = useState<boolean>(true);
    const {intervals, isLoading} = useMaintenanceIntervals('', active);
    const {removeMaintenanceIntervalAsync} = useRemoveMaintenanceInterval();

    const handleRemoveMaintenanceInterval = async (maintenanceInterval: string) => {
        await removeMaintenanceIntervalAsync(maintenanceInterval);
    }

    const columns: ColumnDef<MaintenanceIntervalDto>[] = [
        {accessorKey: "cause", header: "Cause"},
        {accessorKey: "description", header: "Description"},
        {
            accessorKey: "beginAt",
            header: "Start",
            cell: (start) => {
                const value = start.getValue() as string;
                const startTime = new Date(value);
                return startTime.toUTCString();
            }
        },
        {
            accessorKey: "endAt",
            header: "End",
            cell: (end) => {
                const value = end.getValue() as string;
                const endTime = new Date(value);
                return endTime.toUTCString();
            }
        },
        {
            id: "action",
            cell: ({ row }) => {
                const maintenanceInterval = row.original;

                return (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => handleRemoveMaintenanceInterval(maintenanceInterval.id!)}
                                >
                                    Remove
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                );
            }
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen my-auto">
                <LoaderIcon className="animate-spin size-10"/>
            </div>
        )
    }

    return (
        <>
            <div className="pb-5 flex flex-row items-center justify-between">
                <Button>
                    <Link to={"/maintenance/calendar"} className="flex items-center justify-between w-full">
                        <PlusIcon/>
                        New interval
                    </Link>
                </Button>
                <div className={"flex flex-row space-x-3"}>
                    <Switch checked={active}
                            onCheckedChange={setActive}/>
                    <div className="space-y-0.5">
                        <Label className="text-base">Active intervals</Label>
                    </div>
                </div>
            </div>
            <DataTable columns={columns} data={intervals?.items ?? []} paginationEnabled={true}/>
        </>
    );
}

export default SystemIntervalList;