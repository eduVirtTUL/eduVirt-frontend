import {Link, useParams} from "react-router";
import {useMaintenanceIntervals} from "@/data/maintenance/useMaintenanceIntervals.ts";
import {ColumnDef} from "@tanstack/react-table";
import {MaintenanceIntervalDto} from "@/api";
import DataTable from "@/components/DataTable.tsx";
import {LoaderIcon, PlusIcon, Undo2} from "lucide-react";
import React from "react";
import PageHeader from "@/components/PageHeader.tsx";
import {useCluster} from "@/data/cluster/useCluster.ts";
import {Button} from "@/components/ui/button.tsx";

const columns: ColumnDef<MaintenanceIntervalDto>[] = [
    {accessorKey: "cause", header: "Cause"},
    {accessorKey: "description", header: "Description"},
    {accessorKey: "type", header: "Type"},
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

const ClusterIntervalList: React.FC = () => {
    const {id} = useParams();
    const {cluster, isLoading: clusterLoading} = useCluster(id!);
    const {intervals, isLoading: intervalsLoading} = useMaintenanceIntervals(id!, true);

    if (clusterLoading || intervalsLoading) {
        return (
            <div className="flex items-center justify-center h-screen my-auto">
                <LoaderIcon className="animate-spin size-10"/>
            </div>
        )
    }

    return (
        <>
            <div className="flex justify-start">
                <Button variant="outline" size="icon" className="mr-5">
                    <Link to={"/maintenance"}>
                        <Undo2/>
                    </Link>
                </Button>
                <PageHeader title={`Intervals for ${cluster != null ? cluster.name : ''} cluster`}/>
            </div>
            <div className="pb-5">
                <Button>
                    <Link to={`/maintenance/calendar/${id}`} className="flex items-center justify-between w-full">
                        <PlusIcon/>
                        New interval
                    </Link>
                </Button>
            </div>
            <DataTable columns={columns} data={intervals?.items ?? []}/>
        </>
    );
}

export default ClusterIntervalList;