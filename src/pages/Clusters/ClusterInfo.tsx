import {useClusterDetails} from "@/data/cluster-metrics/useClusterDetails.ts";
import {LoaderIcon} from "lucide-react";
import React from "react";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";

type ClusterDetailsProps = {
    clusterId: string,
}

const ClusterInfo: React.FC<ClusterDetailsProps> = ({clusterId}) => {
    const {cluster, isLoading} = useClusterDetails(clusterId!);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen my-auto">
                <LoaderIcon className="animate-spin size-10"/>
            </div>
        )
    }

    return (
        <>
            {[
                { label: "Identifier", value: cluster?.id },
                { label: "Description", value: cluster?.description },
                { label: "Comment", value: cluster?.comment },
                { label: "CPU Type", value: cluster?.clusterCpuType },
                { label: "Comp. Version", value: cluster?.compatibilityVersion },
                { label: "Threads as CPUs", value: cluster?.useThreadsAsCpus ? "Yes" : "No" },
                { label: "Max Over-Commit", value: cluster?.maxMemoryOverCommit },
            ].map((field, index) => (
                <div key={index} className="flex items-center w-full">
                    <Label className="w-48 text-left mr-4">{field.label}</Label>
                    <Input className="flex-1" value={field.value || ""} disabled />
                </div>
            ))}
        </>
    );
}

export default ClusterInfo;