import {useMaintenanceIntervals} from "@/data/maintenance/useMaintenanceIntervals.ts";
import React from "react";
import {ColumnDef} from "@tanstack/react-table";
import {MaintenanceIntervalDto} from "@/api";
import DataTable from "@/components/DataTable.tsx";
import {LoaderIcon, PlusIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router";

type SystemIntervalListProps = {
    active: boolean
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
];

const SystemIntervalList: React.FC<SystemIntervalListProps> = ({active}) => {
    const {intervals, isLoading} = useMaintenanceIntervals('', active);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen my-auto">
                <LoaderIcon className="animate-spin size-10"/>
            </div>
        )
    }

    return (
        <>
            <div className="pb-5">
                <Button>
                    <Link to={"/maintenance/calendar"} className="flex items-center justify-between w-full">
                        <PlusIcon/>
                        New interval
                    </Link>
                </Button>
            </div>
            <DataTable columns={columns} data={intervals?.items ?? []}/>
        </>
    );
}

export default SystemIntervalList;