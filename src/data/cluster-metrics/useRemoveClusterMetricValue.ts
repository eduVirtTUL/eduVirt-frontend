import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClusterMetricControllerApi } from "@/api";
import { keys } from "@/data/keys";
import { toast } from "sonner";

export const useRemoveClusterMetricValue = (id: string) => {
    const queryClient = useQueryClient();
    const {mutate, mutateAsync} = useMutation({
        mutationKey: ["removeClusterMetricValue"],
        mutationFn: async (metricId: string) => {
            const controller = new ClusterMetricControllerApi();
            const response = await controller.deleteMetric(id, metricId);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [keys.CLUSTER_METRIC_VALUES]});
            toast.success("Cluster metric value removed successfully!");
        },
        onError: () => {
            toast.error("Failed to remove metric value for given cluster.");
        },
    });

  return {
    removeClusterMetricValue: mutate,
    removeClusterMetricValueAsync: mutateAsync,
  };
};
