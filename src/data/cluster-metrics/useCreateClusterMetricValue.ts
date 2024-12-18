import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClusterMetricControllerApi, CreateMetricValueDto } from "@/api";
import { keys } from "@/data/keys";
import { toast } from "sonner";

export const useCreateClusterMetricValue = (id: string) => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["createClusterMetricValue"],
    mutationFn: async (createDto: CreateMetricValueDto) => {
      console.log(`ID: ${id}`);
      console.log(`createDto.metricId: ${createDto.metricId}`);
      console.log(`createDto.value: ${createDto.value}`);
      const controller = new ClusterMetricControllerApi();
      const response = await controller.createMetricValue(id, createDto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.CLUSTER_METRIC_VALUES] });
      toast.success("Cluster metric value created successfully!");
    },
    onError: () => {
      toast.error("Failed to create metric value for given cluster.");
    },
  });

  return {
    createClusterMetricValue: mutate,
    createClusterMetricValueAsync: mutateAsync,
  };
};
