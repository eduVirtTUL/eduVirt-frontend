import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ClusterDetailsDto } from "@/api";

type ClusterDetailsProps = {
  cluster: ClusterDetailsDto;
};

const ClusterInfo: React.FC<ClusterDetailsProps> = ({ cluster }) => {
  return (
    <>
      <div className="flex flex-col space-y-2">
        {[
          { label: "Identifier", value: cluster?.id },
          { label: "Description", value: cluster?.description },
          { label: "Comment", value: cluster?.comment },
          { label: "CPU Type", value: cluster?.clusterCpuType },
          { label: "Comp. Version", value: cluster?.compatibilityVersion },
          {
            label: "Threads as CPUs",
            value: cluster?.useThreadsAsCpus ? "Yes" : "No",
          },
          { label: "Max Over-Commit", value: cluster?.maxMemoryOverCommit },
        ].map((field, index) => (
          <div key={index} className="flex items-center w-full">
            <Label className="w-48 text-left mr-4">{field.label}</Label>
            <Input className="flex-1" value={field.value || ""} disabled />
          </div>
        ))}
      </div>
    </>
  );
};

export default ClusterInfo;
