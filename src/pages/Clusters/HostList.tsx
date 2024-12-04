import {useParams} from "react-router";
import {LoaderIcon} from "lucide-react";
import React from "react";
import DataTable from "@/components/DataTable.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {useHosts} from "@/data/cluster/useHosts.ts";
import {HostDto} from "@/api";

const columns: ColumnDef<HostDto>[] = [
    {accessorKey: "name", header: "Name"},
    {accessorKey: "address", header: "Domain name"},
    {accessorKey: "cpu", header: "CPU count"},
    {accessorKey: "memory", header: "Memory size"}
]

const HostList: React.FC = () => {
    const {clusterId} = useParams();
    const {hosts, isLoading} = useHosts(clusterId!);

    if (isLoading) {
        return (
            <div className="flex flex-col my-auto items-center justify-center">
                <LoaderIcon className="animate-spin size-10" />
            </div>
        );
    }

    return (
        <>
            <DataTable data={hosts ?? []} columns={columns}/>
        </>
    );
}

export default HostList;