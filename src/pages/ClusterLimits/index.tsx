import {useCluster} from "@/data/cluster/useCluster.ts";
import {useParams} from "react-router-dom";
import {useClusterMetrics} from "@/data/cluster-metrics/useClusterMetrics.ts";
import PageHeader from "@/components/PageHeader.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {MetricValueDto} from "@/api";
import DataTable from "@/pages/Courses/DataTable.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal, PlusIcon} from "lucide-react";
import React from "react";
import {useDialog} from "@/stores/dialogStore.ts";
import CreateClusterMetricValue from "@/components/Modals/CreateClusterMetricValue.tsx";
import {useRemoveClusterMetricValue} from "@/data/cluster-metrics/useRemoveClusterMetricValue.ts";

const ClusterLimitsPage: React.FC = () => {
    const {id} = useParams();
    const {cluster} = useCluster(id!);
    const {metrics} = useClusterMetrics(id!);
    const {removeClusterMetricValueAsync} = useRemoveClusterMetricValue(id!);
    const { open } = useDialog();

    const columns: ColumnDef<MetricValueDto>[] = [
        {
            accessorKey: "name", header: "Name"
        },
        {
            accessorKey: "value", header: "Value"
        },
        {
            id: "actions",
            cell: ({row}) => {
                const metric = row.original;
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
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleRemoveClusterMetricValue(metric.id!)}>Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                );
            }
        }
    ]

    const handleRemoveClusterMetricValue = (async (metricId: string) => {
        await removeClusterMetricValueAsync(metricId);
    });

    return (
        <>
            <CreateClusterMetricValue clusterId={id!} />
            <PageHeader title={`Cluster: ${cluster?.name ?? ""}`}/>

            <div className="pb-5">
                <Button
                    onClick={() => {
                        open("createClusterMetricValue");
                    }}
                >
                    <PlusIcon/>
                    New metric value
                </Button>
            </div>

            <DataTable columns={columns} data={metrics?.items ?? []}/>
        </>
    );
}

export default ClusterLimitsPage;