import {ColumnDef} from "@tanstack/react-table";
import {ClusterGeneralDto} from "@/api";
import DataTable from "@/components/DataTable.tsx";
import {useClusters} from "@/data/cluster/useClusters.ts";
import {LoaderIcon} from "lucide-react";
import React from "react";

type ClusterListProps = {
    columns: ColumnDef<ClusterGeneralDto>[]
}

const ClusterList: React.FC<ClusterListProps> = ({
    columns
}) => {
    const { clusters, isLoading } = useClusters();

    if (isLoading) {
        return (
            <div className="flex flex-col my-auto items-center justify-center">
                <LoaderIcon className="animate-spin size-10" />
            </div>
        );
    }

    return (
        <>
            <DataTable columns={columns} data={clusters ?? []} paginationEnabled={true} />
        </>
    );
}

export default ClusterList;